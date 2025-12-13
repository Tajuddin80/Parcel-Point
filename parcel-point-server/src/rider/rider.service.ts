import { Document, Filter, ObjectId } from "mongodb";
import { ridersCollection } from "../config/db";

const existingRider = async (riderEmail: string) => {
  const result = await ridersCollection.findOne({
    email: riderEmail,
  });

  return result;
};

const beARider = async (newRider: Record<string, any>) => {
  const result = await ridersCollection.insertOne(newRider);

  return result;
};

const getPendingRiders = async () => {
  const result = await ridersCollection
    .find({
      status: "pending",
    })
    .toArray();

  return result;
};

const deleteRider = async (id: string) => {
  const result = await ridersCollection.deleteOne({
    _id: new ObjectId(id),
  });
  return result;
};

const updateRiderStatus = async (id: string, status: string) => {
  // Update rider status
  const result = await ridersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );
  return result;
};

const getRiders = async (query: Filter<Document>) => {
  const riders = await ridersCollection.find(query).toArray();

  return riders;
};

export const riderServices = {
  existingRider,
  beARider,
  deleteRider,
  getPendingRiders,
  updateRiderStatus,
  getRiders,
};
