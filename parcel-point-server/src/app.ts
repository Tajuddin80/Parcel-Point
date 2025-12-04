import { Request, Response } from "express";
import { verifyFireBaseToken } from "./middleware/verifyFirebaseToken";
import config from "./config";
import express from "express";
import { verifyAdmin } from "./middleware/verifyAdmin";
import { verifyRider } from "./middleware/verifyRider";
import { FindOptions, ObjectId } from "mongodb";
import {
  parcelsCollection,
  paymentsCollection,
  ridersCollection,
  roleRequestsCollection,
  trackingsCollection,
  usersCollection,
} from "./config/db";
import { emailTransporter } from "./utils/mailer";
import { parcelRoutes } from "./parcel/parcel.routes";
import { userRoutes } from "./user/user.routes";

const cors = require("cors");
const stripe = require("stripe")(config.payment_gateway_key);
const admin = require("firebase-admin");

export const app = express();

app.use(cors());
app.use(express.json());

// const serviceAccount = require("./firebase-admin-key.json");
const decodedKey = Buffer.from(
  config.fb_service_key as string,
  "base64"
).toString("utf8");
const serviceAccount = JSON.parse(decodedKey);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use("/parcels", parcelRoutes);
app.use("/users", userRoutes);

async function run() {
  try {
    app.post("/send-payment-email", async (req: Request, res: Response) => {
      try {
        const { transactionId, parcelName, amount, email, userName } = req.body;

        const mailOptions = {
          from: config.parcel_point_email,
          to: email, // send to user
          subject: ` Payment Successful for ${parcelName}`,
          html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 8px; background: #f7f7f7;">
          <h2 style="color:#4CAF50;">Thank you for your payment, ${userName}!</h2>
          <p>Your payment has been successfully processed.</p>
          <ul>
            <li><strong>Parcel:</strong> ${parcelName}</li>
            <li><strong>Amount Paid:</strong> ৳${amount}</li>
            <li><strong>Transaction ID:</strong> ${transactionId}</li>
          </ul>
          <p style="margin-top:20px;">We appreciate your trust in Parcel Point. Track your parcel in your dashboard anytime!</p>
          <p style="color:gray;font-size:14px;margin-top:30px;">&copy; ${new Date().getFullYear()} Parcel Point</p>
        </div>
      `,
        };

        await emailTransporter.sendMail(mailOptions);
        res.json({ success: true, message: "Email sent successfully!" });
      } catch (error) {
        console.error("Error sending email:", error);
        res
          .status(500)
          .json({ success: false, message: "Failed to send email" });
      }
    });

   
    // ----------------------------------------------Rider related api's-------------------------------------

    app.post(
      "/riders",
      verifyFireBaseToken,
      async (req: Request, res: Response) => {
        const riderEmail = req.body.email;
        const newRider = req.body;

        try {
          type RiderStatus = "pending" | "active" | "rejected";
          const existingRider = await ridersCollection.findOne({
            email: riderEmail,
          });

          if (existingRider) {
            const status = existingRider.status as RiderStatus;

            const messages: {
              pending: string;
              active: string;
              rejected: string;
            } = {
              pending: "Your application is already under review. Please wait.",
              active: "You are already an approved rider.",
              rejected:
                "Your previous application was rejected. Please contact support or wait before reapplying.",
            };

            const message = messages[status] || "You have already applied.";

            return res.status(400).send({ message, status });
          }

          const result = await ridersCollection.insertOne(newRider);
          res.send(result);
        } catch (error) {
          console.error("Error inserting rider:", error);
          res
            .status(500)
            .send({ message: "Server error while submitting application." });
        }
      }
    );

    // GET all pending riders
    app.get(
      "/pending",
      verifyFireBaseToken,
      verifyAdmin,
      async (req: Request, res: Response) => {
        try {
          const pendingRiders = await ridersCollection
            .find({
              status: "pending",
            })
            .toArray();
          res.send(pendingRiders);
        } catch (error: any) {
          console.error("Error fetching pending riders:", error);
          res.status(500).send({ message: "Failed to load pending riders" });
        }
      }
    );

    app.delete(
      "/riders/:id",
      verifyFireBaseToken,
      verifyAdmin,
      async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
          const result = await ridersCollection.deleteOne({
            _id: new ObjectId(id),
          });
          res.send(result);
        } catch (error) {
          res.status(500).send({ message: "Failed to delete rider" });
        }
      }
    );

    app.patch(
      "/riders/:id",
      verifyFireBaseToken,
      verifyAdmin,
      async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, email } = req.body;

        const allowedStatuses = [
          "active",
          "rejected",
          "pending",
          "in-delivery",
        ];

        if (!allowedStatuses.includes(status)) {
          return res.status(400).send({ message: "Invalid status value" });
        }

        try {
          // Update rider status
          const result = await ridersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
          );

          if (result.modifiedCount === 0) {
            return res
              .status(404)
              .send({ message: "Rider not found or status unchanged" });
          }

          // Conditionally update user role
          const userQuery = { email };
          let userUpdateDoc = null;

          if (status === "active") {
            userUpdateDoc = { $set: { role: "rider" } };
          } else if (status === "rejected" || status === "pending") {
            userUpdateDoc = { $set: { role: "user" } };
          }

          if (userUpdateDoc) {
            const roleResult = await usersCollection.updateOne(
              userQuery,
              userUpdateDoc
            );
            console.log("User role update result:", roleResult.modifiedCount);
          }

          res.send({
            message: `Rider status updated to ${status}`,
            result,
          });
        } catch (error) {
          console.error("Error updating rider status:", error);
          res.status(500).send({ message: "Failed to update rider status" });
        }
      }
    );

    // Cleaner and secure since verifyAdmin is already checking the role
    app.get(
      "/riders",
      verifyFireBaseToken,
      verifyAdmin,
      async (req: Request, res: Response) => {
        const { status } = req.query as { status?: string };
        const query: Record<string, any> = {};
        if (status) {
          query.status = status;
        }

        try {
          const riders = await ridersCollection.find(query).toArray();
          res.send(riders);
        } catch (err) {
          console.error("Error fetching riders", err);
          res.status(500).send({ message: "Failed to load riders" });
        }
      }
    );

    // get pending delivery task for rider

    app.get(
      "/rider-parcels",
      verifyFireBaseToken,
      verifyRider,
      async (req: Request, res: Response) => {
        try {
          const { email } = req.query;

          if (!email) {
            return res
              .status(400)
              .send({ message: "Rider email is required." });
          }

          const riderParcels = await parcelsCollection
            .find({
              assignedRiderEmail: email,
              deliveryStatus: { $in: ["rider_assigned", "in_transit"] },
            })
            .sort({ createdAt: -1 }) // Newest first
            .toArray();

          res.send(riderParcels);
        } catch (error) {
          console.error("Failed to fetch rider parcels:", error);
          res
            .status(500)
            .send({ message: "Server error while fetching parcels." });
        }
      }
    );

    // load completed parcel deleveries for a rider

    app.get(
      "/rider-completed-parcels",
      verifyFireBaseToken,
      verifyRider,
      async (req: Request, res: Response) => {
        try {
          const { email } = req.query;
          if (!email) {
            return res.status(400).send({ message: "Rider email is required" });
          }
          const query = {
            assignedRiderEmail: email,
            deliveryStatus: { $in: ["delivered", "service_center_delivered"] },
          };
          const options: FindOptions = {
            sort: { createdAt: -1 },
          };

          const completedParcels = await parcelsCollection
            .find(query, options)
            .toArray();
          res.send(completedParcels);
        } catch (error) {
          console.error("Error loading completed parcels:", error);
          res
            .status(500)
            .send({ message: "Failed to load completed deliveries" });
        }
      }
    );

    // PATCH: Update parcel delivery status
    app.patch(
      "/rider-parcels/:id/status",
      verifyFireBaseToken,
      verifyRider,
      async (req: Request, res: Response) => {
        const { id } = req.params;
        const { deliveryStatus } = req.body;

        try {
          const updateFields: Record<string, any> = { deliveryStatus };

          const parcel = await parcelsCollection.findOne({
            _id: new ObjectId(id),
          });
          if (!parcel) {
            return res.status(404).send({ message: "Parcel not found." });
          }

          // Add pickedAt or deliveredAt timestamp
          if (deliveryStatus === "in_transit") {
            updateFields.pickedAt = new Date().toISOString();
          }

          if (deliveryStatus === "delivered") {
            updateFields.deliveredAt = new Date().toISOString();

            // Calculate earning
            const sameDistrict =
              parcel.senderDistrict === parcel.receiverDistrict;
            const totalCost = parseFloat(parcel.totalCost || 0);
            const earning = sameDistrict ? totalCost * 0.8 : totalCost * 0.3;

            // Update rider: add earnings, reset status to active
            await ridersCollection.updateOne(
              { email: parcel.assignedRiderEmail },
              {
                $set: { status: "active" },
                $inc: {
                  totalEarned: parseFloat(earning.toFixed(2)),
                },
              }
            );
          }

          const result = await parcelsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }
          );

          res.send(result);
        } catch (error) {
          console.error("Failed to update parcel status:", error);
          res.status(500).send({ message: "Failed to update parcel status." });
        }
      }
    );

    app.get(
      "/rider/wallet",
      verifyFireBaseToken,
      verifyRider,
      async (req: Request, res: Response) => {
        const { email } = req.query;
        if (!email) {
          return res.status(400).send({ message: "Email is required" });
        }

        try {
          const rider = await ridersCollection.findOne({ email });
          if (!rider) {
            return res.status(404).send({ message: "Rider not found." });
          }

          const totalEarned = rider.totalEarned || 0;
          const amountWithdrawn = rider.amountWithdrawn || 0;
          const amountAvailable = totalEarned - amountWithdrawn;

          res.send({ totalEarned, amountWithdrawn, amountAvailable });
        } catch (error) {
          console.error("Wallet fetch error:", error);
          res.status(500).send({ message: "Failed to fetch wallet info." });
        }
      }
    );

    app.post(
      "/rider/cashout",
      verifyFireBaseToken,
      verifyRider,
      async (req: Request, res: Response) => {
        const { email, amount } = req.body;

        if (!email || typeof amount !== "number" || amount <= 0) {
          return res.status(400).send({ message: "Invalid input." });
        }

        try {
          const rider = await ridersCollection.findOne({ email });
          if (!rider) {
            return res.status(404).send({ message: "Rider not found." });
          }

          const totalEarned = rider.totalEarned || 0;
          const amountWithdrawn = rider.amountWithdrawn || 0;
          const amountAvailable = totalEarned - amountWithdrawn;

          if (amount > amountAvailable) {
            return res.status(400).send({ message: "Insufficient balance." });
          }

          const newAmountWithdrawn = parseFloat(
            (amountWithdrawn + amount).toFixed(2)
          );
          const newAmountAvailable = parseFloat(
            (totalEarned - newAmountWithdrawn).toFixed(2)
          );

          const result = await ridersCollection.updateOne(
            { email },
            {
              $set: {
                amountWithdrawn: newAmountWithdrawn,
                amountAvailable: newAmountAvailable,
              },
            }
          );

          res.send({
            message: "Cashout successful",
            amountWithdrawn: newAmountWithdrawn,
            amountAvailable: newAmountAvailable,
            totalEarned,
          });
        } catch (error) {
          console.error("Cashout error:", error);
          res.status(500).send({ message: "Cashout failed." });
        }
      }
    );

    // ✅ Rider Dashboard API
    app.get(
      "/rider/dashboard",
      verifyFireBaseToken,
      verifyRider,
      async (req: Request, res: Response) => {
        try {
          const riderEmail = req.query.email;
          if (!riderEmail) {
            return res
              .status(400)
              .send({ message: "Invalid or missing user email" });
          }

          const assigned = await parcelsCollection.countDocuments({
            assignedRiderEmail: riderEmail,
            deliveryStatus: { $in: ["rider_assigned", "in_transit"] },
          });

          const deliveredParcels = await parcelsCollection
            .find({
              assignedRiderEmail: riderEmail,
              deliveryStatus: "delivered",
            })
            .toArray();

          let earnings = 0;
          deliveredParcels.forEach((parcel) => {
            const cost = Number(parcel.totalCost);
            if (!isNaN(cost)) {
              earnings +=
                parcel.senderDistrict === parcel.receiverDistrict
                  ? cost * 0.8
                  : cost * 0.3;
            }
          });

          res.send({
            assignedParcels: assigned,
            deliveredParcels: deliveredParcels.length,
            totalEarnings: parseFloat(earnings.toFixed(2)),
          });
        } catch (err) {
          console.error("Rider dashboard error:", err);
          res.status(500).send({ message: "Failed to fetch rider dashboard" });
        }
      }
    );
    // --------------------------------------- admin analytics api ---------------------------------------------

    // ✅ NEW ANALYTICS API for Admin Dashboard
    app.get(
      "/admin/analytics",
      verifyFireBaseToken,
      verifyAdmin,
      async (req: Request, res: Response) => {
        try {
          const now = new Date();

          const todayStart = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
          );
          const weekStart = new Date(todayStart);
          weekStart.setUTCDate(weekStart.getUTCDate() - now.getUTCDay());
          const monthStart = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
          );
          const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));

          // Helper function to create match stage with $toDate conversion for deliveredAt
          const timeMatchStages = (start: Date): Record<string, any> => ({
            $match: {
              deliveryStatus: "delivered",
              $expr: { $gte: [{ $toDate: "$deliveredAt" }, start] },
            },
          });

          // Revenue pipeline unchanged except it filters for deliveryStatus and paymentStatus without date filtering
          const revenuePipeline = [
            { $match: { deliveryStatus: "delivered", paymentStatus: "paid" } },
            {
              $project: {
                totalCost: 1,
                sameDistrict: {
                  $eq: ["$senderDistrict", "$receiverDistrict"],
                },
              },
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$totalCost" },
                riderShare: {
                  $sum: {
                    $cond: [
                      "$sameDistrict",
                      { $multiply: ["$totalCost", 0.8] },
                      { $multiply: ["$totalCost", 0.3] },
                    ],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                totalRevenue: 1,
                riderShare: 1,
                adminShare: { $subtract: ["$totalRevenue", "$riderShare"] },
              },
            },
          ];

          // Run all aggregation calls in parallel
          const [today, week, month, year, revenue] = await Promise.all([
            parcelsCollection
              .aggregate([timeMatchStages(todayStart), { $count: "total" }])
              .toArray(),
            parcelsCollection
              .aggregate([timeMatchStages(weekStart), { $count: "total" }])
              .toArray(),
            parcelsCollection
              .aggregate([timeMatchStages(monthStart), { $count: "total" }])
              .toArray(),
            parcelsCollection
              .aggregate([timeMatchStages(yearStart), { $count: "total" }])
              .toArray(),
            parcelsCollection.aggregate(revenuePipeline).toArray(),
          ]);

          const riderStatuses = await ridersCollection
            .aggregate([
              {
                $group: {
                  _id: "$status",
                  count: { $sum: 1 },
                },
              },
            ])
            .toArray();

          const pendingRequests = await roleRequestsCollection.countDocuments();

          res.send({
            deliveries: {
              today: today[0]?.total || 0,
              week: week[0]?.total || 0,
              month: month[0]?.total || 0,
              year: year[0]?.total || 0,
            },
            revenue: revenue[0] || {
              totalRevenue: 0,
              riderShare: 0,
              adminShare: 0,
            },
            riders: riderStatuses.reduce((acc, r) => {
              acc[r._id] = r.count;
              return acc;
            }, {}),
            pendingRoleRequests: pendingRequests,
          });
        } catch (err) {
          console.error("Failed to load analytics:", err);
          res.status(500).send({ message: "Failed to load analytics." });
        }
      }
    );

    app.get(
      "/dashboard/delivery-stats",
      verifyFireBaseToken,
      verifyAdmin,
      async (req: Request, res: Response) => {
        try {
          const now = new Date();

          const today = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
          );
          const thisWeek = new Date(today);
          thisWeek.setUTCDate(today.getUTCDate() - now.getUTCDay());
          const thisMonth = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
          );
          const thisYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));

          // Count documents with date conversion using $expr + $toDate
          const [day, week, month, year] = await Promise.all([
            parcelsCollection.countDocuments({
              deliveryStatus: "delivered",
              $expr: { $gte: [{ $toDate: "$deliveredAt" }, today] },
            }),
            parcelsCollection.countDocuments({
              deliveryStatus: "delivered",
              $expr: { $gte: [{ $toDate: "$deliveredAt" }, thisWeek] },
            }),
            parcelsCollection.countDocuments({
              deliveryStatus: "delivered",
              $expr: { $gte: [{ $toDate: "$deliveredAt" }, thisMonth] },
            }),
            parcelsCollection.countDocuments({
              deliveryStatus: "delivered",
              $expr: { $gte: [{ $toDate: "$deliveredAt" }, thisYear] },
            }),
          ]);

          res.send({
            today: day,
            week,
            month,
            year,
          });
        } catch (err: any) {
          console.error("Error in delivery stats:", err);
          res.status(500).send({ message: "Failed to fetch delivery stats" });
        }
      }
    );

    app.get(
      "/dashboard/parcel-summary",
      verifyFireBaseToken,
      verifyAdmin,
      async (req: Request, res: Response) => {
        try {
          const result = await parcelsCollection
            .aggregate([
              {
                $group: {
                  _id: "$deliveryStatus",
                  count: { $sum: 1 },
                },
              },
            ])
            .toArray();

          res.send(result);
        } catch (error) {
          console.error("Error in parcel summary:", error);
          res.status(500).send({ message: "Failed to fetch parcel summary" });
        }
      }
    );

    app.get(
      "/dashboard/revenue-summary",
      verifyFireBaseToken,
      verifyAdmin,
      async (req: Request, res: Response) => {
        try {
          const deliveredParcels = await parcelsCollection
            .find({
              deliveryStatus: {
                $in: ["delivered", "service_center_delivered"],
              },
            })
            .toArray();

          let riderEarnings = 0;
          let adminEarnings = 0;

          deliveredParcels.forEach((parcel) => {
            const cost = parseFloat(parcel.totalCost || 0);
            const isSameDistrict =
              parcel.senderDistrict === parcel.receiverDistrict;

            if (isSameDistrict) {
              riderEarnings += cost * 0.8;
              adminEarnings += cost * 0.2;
            } else {
              riderEarnings += cost * 0.3;
              adminEarnings += cost * 0.7;
            }
          });

          res.send({
            totalRevenue: riderEarnings + adminEarnings,
            riderEarnings: parseFloat(riderEarnings.toFixed(2)),
            adminEarnings: parseFloat(adminEarnings.toFixed(2)),
          });
        } catch (error) {
          console.error("Revenue summary error:", error);
          res.status(500).send({ message: "Failed to fetch revenue summary" });
        }
      }
    );

    app.get(
      "/dashboard/role-requests",
      verifyFireBaseToken,
      verifyAdmin,
      async (req: Request, res: Response) => {
        try {
          const result = await roleRequestsCollection
            .aggregate([
              {
                $group: {
                  _id: "$requestedRole",
                  count: { $sum: 1 },
                },
              },
            ])
            .toArray();

          res.send(result);
        } catch (error) {
          console.error("Role request summary failed:", error);
          res.status(500).send({ message: "Failed to fetch role requests" });
        }
      }
    );

    app.get(
      "/dashboard/rider-activity",
      verifyFireBaseToken,
      verifyAdmin,
      async (req: Request, res: Response) => {
        try {
          const active = await ridersCollection.countDocuments({
            status: "active",
          });
          const inDelivery = await ridersCollection.countDocuments({
            status: "in-delivery",
          });

          res.send({ active, inDelivery });
        } catch (error) {
          console.error("Failed to fetch rider activity:", error);
          res.status(500).send({ message: "Failed to load rider stats" });
        }
      }
    );

    //  -------------------------------------------role request related apis-----------------------------------------------
    // POST: /roleRequests
    app.post(
      "/roleRequests",
      verifyFireBaseToken,
      async (req: Request, res: Response) => {
        const request = req.body;
        try {
          const result = await roleRequestsCollection.insertOne(request);
          res.send({ success: true, insertedId: result.insertedId });
        } catch (error) {
          console.error("Error saving role request:", error);
          res.status(500).send({ message: "Failed to submit role request" });
        }
      }
    );

    // --------------------------------------Tracking related api's -------------------------------------

    // get updats by tracking id
    app.get(
      "/trackings/:trackingId",
      verifyFireBaseToken,
      async (req: Request, res: Response) => {
        const trackingId = req.params.trackingId;

        const updates = await trackingsCollection
          .find({
            tracking_id: trackingId,
          })
          .sort({ timestamp: 1 })
          .toArray();

        res.send(updates);
      }
    );

    // GET /trackings?tracking_id=TRK-XYZ123
    app.get(
      "/trackings",
      verifyFireBaseToken,
      async (req: Request, res: Response) => {
        try {
          const tracking_id = req.query.tracking_id;
          if (!tracking_id) {
            return res.status(400).json({ message: "Tracking ID is required" });
          }

          const logs = await trackingsCollection
            .find({ tracking_id })
            .sort({ timestamp: 1 }) // ascending order
            .toArray();

          res.send(logs);
        } catch (error) {
          console.error("Failed to fetch tracking logs:", error);
          res.status(500).json({ message: "Internal server error" });
        }
      }
    );

    // post tracking updats
    app.post(
      "/trackings",
      verifyFireBaseToken,
      async (req: Request, res: Response) => {
        const update = req.body;

        update.timestamp = new Date();

        if (!update.tracking_id || !update.status) {
          return res
            .status(400)
            .send({ message: "tracking id and status are required" });
        }

        const result = await trackingsCollection.insertOne(update);
        res.status(201).send(result);
      }
    );

    // --------------------------------------payent related apis here----------------------------------------------------
    // save payment in db
    app.post(
      "/payments",
      verifyFireBaseToken,
      async (req: Request, res: Response) => {
        const payment = req.body;
        const {
          parcelName,
          parcelId,
          transactionId,
          paymentMethod,
          email,
          userName,
          amount,
          cardType,
        } = payment;

        try {
          // 1. Insert into payments collection
          const paymentDoc = {
            parcelName,
            parcelId: new ObjectId(parcelId),
            userName,
            email,
            amount,
            paymentMethod,
            cardType,
            transactionId,
            paid_at_string: new Date().toISOString(),
            paid_at: new Date(),
          };

          const paymentResult = await paymentsCollection.insertOne(paymentDoc);

          // 2. Update the parcel's paymentStatus to 'paid'
          const parcelUpdateResult = await parcelsCollection.updateOne(
            { _id: new ObjectId(parcelId) },
            { $set: { paymentStatus: "paid" } }
          );

          res.send({
            success: true,
            insertedId: paymentResult.insertedId,
            modifiedParcel: parcelUpdateResult.modifiedCount,
          });
        } catch (error) {
          console.error("Error processing payment:", error);
          res.status(500).send({ message: "Payment processing failed" });
        }
      }
    );

    // VVI:   write prompt in stripe.js AI : i want to create custom card payment system using react and node on the server
    // card payment intent related
    app.post(
      "/create-payment-intent",
      verifyFireBaseToken,
      async (req: Request, res: Response) => {
        const amountInCents = req.body.amountInCents;
        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents, // Amount in cents
            currency: "usd",
            payment_method_types: ["card"],
          });
          res.json({ clientSecret: paymentIntent.client_secret });
        } catch (error: any) {
          res.status(500).json({ error: error.message });
        }
      }
    );

    app.get(
      "/payments",
      verifyFireBaseToken,
      async (req: Request, res: Response) => {
        const userEmail = req.query.email;

        try {
          const query = userEmail ? { email: userEmail } : {};
          const history = await paymentsCollection
            .find(query)
            .sort({ paid_at: -1 }) // Latest first
            .toArray();

          res.send(history);
        } catch (error) {
          console.error("Error fetching payment history:", error);
          res.status(500).send({ message: "Failed to load payment history" });
        }
      }
    );

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
