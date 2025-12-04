import { MongoClient, Db } from "mongodb";
import config from ".";

export const client = new MongoClient(config.mongoDB_uri!);

export const connectDB = async () => {
  await client.connect();
  console.log("MongoDB Connected!");
};

export const db = client.db("parcelPoint");

export const parcelsCollection = db.collection("allParcels");
export const usersCollection = db.collection("allUsers");
export const paymentsCollection = db.collection("allPayments");
export const ridersCollection = db.collection("allRiders");
export const trackingsCollection = db.collection("allTrackings");
export const roleRequestsCollection = db.collection("allRoleRequests");
