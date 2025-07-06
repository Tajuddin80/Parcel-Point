require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true,
  serverSelectionTimeoutMS: 3000,
  autoSelectFamily: false,
});
app.use(cors());
app.use(express.json());

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // all collections
    const parcelsCollection = client.db("parcelPoint").collection("allParcels");

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
    app.get("/parcels", async (req, res) => {
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
