require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const stripe = require("stripe")(process.env.PAYMENT_GATEWAY_KEY);
const admin = require("firebase-admin");
const serviceAccount = require("./parcel-point-firebase-key.json");

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

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("parcelPoint");

    // all collections
    const parcelsCollection = db.collection("allParcels");
    const usersCollection = db.collection("allUsers");

    const paymentsCollection = db.collection("allPayments");


  admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    // custom middleware
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

    // add parcels to the db
    app.post("/parcels", async (req, res) => {
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
    app.delete("/parcels/:id", async (req, res) => {
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
    app.get("/parcels/:id", async (req, res) => {
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
    app.post("/create-payment-intent", async (req, res) => {
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
    });

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
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
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
