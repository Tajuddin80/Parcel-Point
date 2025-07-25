require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const stripe = require("stripe")(process.env.PAYMENT_GATEWAY_KEY);
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // tls: true,
  // serverSelectionTimeoutMS: 3000,
  // autoSelectFamily: false,
});
app.use(cors());
app.use(express.json());

// const serviceAccount = require("./firebase-admin-key.json");
const decodedKey = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString(
  "utf8"
);
const serviceAccount = JSON.parse(decodedKey);

const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.PARCEL_POINT_EMAIL,
    pass: process.env.PARCEL_POINT_EMAIL_PASS,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const db = client.db("parcelPoint");

    // all collections
    const parcelsCollection = db.collection("allParcels");
    const usersCollection = db.collection("allUsers");
    const paymentsCollection = db.collection("allPayments");
    const ridersCollection = db.collection("allRiders");
    const trackingsCollection = db.collection("allTrackings");
    const roleRequestsCollection = db.collection("allRoleRequests");

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    // custom middlewares here
    const verifyFireBaseToken = async (req, res, next) => {
      // console.log('header in iddleware', req.headers);
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).send({ message: "unauthorized access" });
      }

      //  verify the token here
      try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.decoded = decoded;
        next();
      } catch (error) {
        return res.status(403).send({ message: "forbidden access" });
      }
    };

    // verify admin role
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email };
      const user = await usersCollection.findOne(query);

      // used just for checking
      // if (!user || user.role === "admin") {

      if (!user || user.role !== "admin") {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };
    // verify rider role
    const verifyRider = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email };
      const user = await usersCollection.findOne(query);

      // used just for checking
      // if (!user || user.role === "admin") {

      if (!user || user.role !== "rider") {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };

    app.post("/send-payment-email", async (req, res) => {
      try {
        const { transactionId, parcelName, amount, email, userName } = req.body;

        const mailOptions = {
          from: process.env.PARCEL_POINT_EMAIL,
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

    // -----------------------------------all parcel related api's here------------------------------------------
    // add parcels to the db
    app.post("/parcels", verifyFireBaseToken, async (req, res) => {
      try {
        const newOrder = req.body;
        const result = await parcelsCollection.insertOne(newOrder);
        res.status(200).send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "error happend" });
      }
    });

    // get parcels from db
    app.get("/parcels", verifyFireBaseToken, async (req, res) => {
      try {
        const userEmail = req.query.email;
        const query = userEmail ? { created_by: userEmail } : {};
        const options = {
          sort: { createdAt: -1 },
        };
        const parcels = await parcelsCollection.find(query, options).toArray();
        res.send(parcels);
      } catch (error) {
        console.error("error fetching parceels: ", error);
        res.status(500).send({ message: "failed to get parcels" });
      }
    });

    // delete parcel
    app.delete("/parcels/:id", verifyFireBaseToken, async (req, res) => {
      const parcelId = req.params.id;

      try {
        const result = await parcelsCollection.deleteOne({
          _id: new ObjectId(parcelId),
        });
        if (result.deletedCount > 0) {
          res.send(result);
        } else {
          res.status(404).send({ message: "failed to delete parcel" });
        }
      } catch (error) {
        console.error("Error deleting parcel:", error);
        res.status(500).send({ message: "failed to delete parcel" });
      }
    });

    // Get single parcel by id
    app.get("/parcelData/:id", verifyFireBaseToken, async (req, res) => {
      const parcelId = req.params.id;

      try {
        const result = await parcelsCollection.findOne({
          _id: new ObjectId(parcelId),
        });

        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ message: "Parcel not found" });
        }
      } catch (error) {
        console.error("Error fetching parcel:", error);
        res.status(500).send({ message: "Failed to fetch parcel" });
      }
    });

    // PATCH: Assign a rider to a parcel
    app.patch("/assign", verifyFireBaseToken, verifyAdmin, async (req, res) => {
      const {
        parcelId,
        assignedRiderId,
        assignedRiderEmail,
        assignedRiderContact,
        assignedRiderNid,
      } = req.body;

      if (
        !parcelId ||
        !assignedRiderId ||
        !assignedRiderEmail ||
        !assignedRiderContact ||
        !assignedRiderNid
      ) {
        return res.status(400).send({ message: "Missing assignment details" });
      }

      try {
        // 1. Update parcel: deliveryStatus + rider info
        const parcelUpdate = await parcelsCollection.updateOne(
          { _id: new ObjectId(parcelId) },
          {
            $set: {
              deliveryStatus: "rider_assigned",
              assignedRiderId,
              assignedRiderEmail,
              assignedRiderContact,
              assignedRiderNid,
            },
          }
        );

        // 2. Update rider status
        const riderUpdate = await ridersCollection.updateOne(
          { _id: new ObjectId(assignedRiderId) },
          { $set: { status: "in-delivery" } }
        );

        if (
          parcelUpdate.modifiedCount === 0 ||
          riderUpdate.modifiedCount === 0
        ) {
          return res
            .status(404)
            .send({ message: "Failed to assign rider or update status" });
        }

        res.send({ message: "Rider assigned to parcel successfully" });
      } catch (err) {
        console.error("Assignment failed:", err);
        res.status(500).send({ message: "Assignment failed" });
      }
    });

    // GET /parcels?status=assignable paid but not collected
    app.get(
      "/parcels/assignable",
      verifyFireBaseToken,
      verifyAdmin,
      async (req, res) => {
        try {
          console.log("Received request for assignable parcels");

          // Log database connection and collection info
          // console.log("parcelCollection:", parcelsCollection ? "OK" : "NOT OK");

          const parcels = await parcelsCollection
            .find({
              deliveryStatus: "not_collected",
              paymentStatus: "paid",
            })
            .toArray();

          // console.log("Found parcels:", parcels.length);

          res.send(parcels);
        } catch (error) {
          console.error("Error fetching assignable parcels:", error);
          res.status(500).send({ message: "Internal server error" });
        }
      }
    );

    // ---------------------------------------------all user relateed api's here---------------------------------------------------------------
    // post an user to db
    app.post("/users", async (req, res) => {
      const { email, role, last_log_in, created_at } = req.body;

      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }

      const userExists = await usersCollection.findOne({ email });

      if (userExists) {
        // User already exists — update last_log_in only
        const updateResult = await usersCollection.updateOne(
          { email },
          { $set: { last_log_in } } // or use `new Date()` for server-side timestamp
        );

        return res.status(200).send({
          message: "User already exists, last_log_in updated",
          inserted: false,
          updated: updateResult.modifiedCount > 0,
        });
      }

      // New user — insert all data
      const user = {
        email,
        role: role || "user",
        last_log_in,
        created_at,
      };

      const insertResult = await usersCollection.insertOne(user);

      return res.status(201).send({
        message: "New user created",
        inserted: true,
        result: insertResult,
      });
    });

    // Get user by email search
    // Get users by email and/or role
    app.get("/users/search", verifyFireBaseToken, async (req, res) => {
      const { email = "", role = "" } = req.query;

      // If neither email nor role is provided
      if (!email && !role) {
        return res.status(400).send({ message: "Missing email or role query" });
      }

      const query = {};

      if (email) {
        const regex = new RegExp(email, "i"); // case-insensitive partial match
        query.email = { $regex: regex };
      }

      if (role) {
        query.role = role;
      }

      try {
        const users = await usersCollection
          .find(query)
          .project({ email: 1, created_at: 1, role: 1 })
          .limit(10)
          .toArray();

        res.send(users);
      } catch (err) {
        console.error("Error searching users", err);
        res.status(500).send({ message: "Error searching users" });
      }
    });

    // Get role by email
    app.get("/users/:email/role", async (req, res) => {
      try {
        const email = req.params.email;
        if (!email) {
          return res.status(400).send({ message: "Email is required" });
        }
        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(400).send({ message: "user not found" });
        }
        res.send({ role: user.role || "user" });
      } catch (error) {
        console.error("Error getting the role: ", error);
        res.status(500).send({ message: "Failed to get role" });
      }
    });

    app.post("/users", async (req, res) => {
      const { email, role, last_log_in, created_at } = req.body;

      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }

      const userExists = await usersCollection.findOne({ email });

      if (userExists) {
        // User already exists — update last_log_in only
        const updateResult = await usersCollection.updateOne(
          { email },
          { $set: { last_log_in } } // or use `new Date()` for server-side timestamp
        );
        return res.status(200).send({
          message: "User already exists, last_log_in updated",
          inserted: false,
          updated: updateResult.modifiedCount > 0,
        });
      }

      // New user — insert all data
      const user = {
        email,
        role: role || "user",
        last_log_in,
        created_at,
      };

      const insertResult = await usersCollection.insertOne(user);

      return res.status(201).send({
        message: "New user created",
        inserted: true,
        result: insertResult,
      });
    });

    app.patch(
      "/users/:id/role",
      verifyFireBaseToken,
      verifyAdmin,
      async (req, res) => {
        const { id } = req.params;
        const { role } = req.body;

        if (!["admin", "user"].includes(role)) {
          return res.status(400).send({ message: "invalid role" });
        }

        try {
          const result = await usersCollection.updateOne(
            {
              _id: new ObjectId(id),
            },
            {
              $set: { role },
            }
          );
          res.send({ message: `User role updated to ${role}`, result });
        } catch (error) {
          console.error(error);

          res.status(500).send({ message: "Failed to update user role" });
        }
      }
    );

    // ----------------------------------------------Rider related api's-------------------------------------

    app.post("/riders", verifyFireBaseToken, async (req, res) => {
      const riderEmail = req.body.email;
      const newRider = req.body;

      try {
        const existingRider = await ridersCollection.findOne({
          email: riderEmail,
        });

        if (existingRider) {
          const status = existingRider.status;

          const messages = {
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
    });

    // GET all pending riders
    app.get("/pending", verifyFireBaseToken, verifyAdmin, async (req, res) => {
      try {
        const pendingRiders = await ridersCollection
          .find({
            status: "pending",
          })
          .toArray();
        res.send(pendingRiders);
      } catch (error) {
        console.error("Error fetching pending riders:", error);
        res.status(500).send({ message: "Failed to load pending riders" });
      }
    });

    app.delete(
      "/riders/:id",
      verifyFireBaseToken,
      verifyAdmin,
      async (req, res) => {
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
      async (req, res) => {
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
    app.get("/riders", verifyFireBaseToken, verifyAdmin, async (req, res) => {
      const { status } = req.query;
      const query = {};

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
    });

    // get pending delivery task for rider

    app.get(
      "/rider-parcels",
      verifyFireBaseToken,
      verifyRider,
      async (req, res) => {
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
      async (req, res) => {
        try {
          const { email } = req.query;
          if (!email) {
            return res.status(400).send({ message: "Rider email is required" });
          }
          const query = {
            assignedRiderEmail: email,
            deliveryStatus: { $in: ["delivered", "service_center_delivered"] },
          };
          const options = {
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
      async (req, res) => {
        const { id } = req.params;
        const { deliveryStatus } = req.body;

        try {
          const updateFields = { deliveryStatus };

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
      async (req, res) => {
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
      async (req, res) => {
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
      async (req, res) => {
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
      async (req, res) => {
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
          const timeMatchStages = (start) => ({
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
      async (req, res) => {
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
        } catch (err) {
          console.error("Error in delivery stats:", err);
          res.status(500).send({ message: "Failed to fetch delivery stats" });
        }
      }
    );

    app.get(
      "/dashboard/parcel-summary",
      verifyFireBaseToken,
      verifyAdmin,
      async (req, res) => {
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
      async (req, res) => {
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
      async (req, res) => {
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
      async (req, res) => {
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
    app.post("/roleRequests", verifyFireBaseToken, async (req, res) => {
      const request = req.body;
      try {
        const result = await roleRequestsCollection.insertOne(request);
        res.send({ success: true, insertedId: result.insertedId });
      } catch (error) {
        console.error("Error saving role request:", error);
        res.status(500).send({ message: "Failed to submit role request" });
      }
    });

    // --------------------------------------Tracking related api's -------------------------------------

    // get updats by tracking id
    app.get("/trackings/:trackingId", verifyFireBaseToken, async (req, res) => {
      const trackingId = req.params.trackingId;

      const updates = await trackingsCollection
        .find({
          tracking_id: trackingId,
        })
        .sort({ timestamp: 1 })
        .toArray();

      res.send(updates);
    });

    // GET /trackings?tracking_id=TRK-XYZ123
    app.get("/trackings", verifyFireBaseToken, async (req, res) => {
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
    });

    // post tracking updats
    app.post("/trackings", verifyFireBaseToken, async (req, res) => {
      const update = req.body;

      update.timestamp = new Date();

      if (!update.tracking_id || !update.status) {
        return res
          .status(400)
          .send({ message: "tracking id and status are required" });
      }

      const result = await trackingsCollection.insertOne(update);
      res.status(201).send(result);
    });

    // --------------------------------------payent related apis here----------------------------------------------------
    // save payment in db
    app.post("/payments", verifyFireBaseToken, async (req, res) => {
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
    });

    // VVI:   write prompt in stripe.js AI : i want to create custom card payment system using react and node on the server
    // card payment intent related
    app.post(
      "/create-payment-intent",
      verifyFireBaseToken,
      async (req, res) => {
        const amountInCents = req.body.amountInCents;
        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents, // Amount in cents
            currency: "usd",
            payment_method_types: ["card"],
          });
          res.json({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
    );

    app.get("/payments", verifyFireBaseToken, async (req, res) => {
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
    });

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
