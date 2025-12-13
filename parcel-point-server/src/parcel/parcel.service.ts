import { Abortable, Document, Filter, FindOptions, ObjectId } from "mongodb";
import { parcelsCollection, ridersCollection } from "../config/db";
import { client } from "../server";

const createParcel = async (payload: Record<string, unknown>) => {
  const newOrder = payload;
  const result = await parcelsCollection.insertOne(newOrder);
  return result;
};

const getParcels = async (
  query: Record<string, any>,
  options: FindOptions = {}
) => {
  const result = await parcelsCollection.find(query, options).toArray();
  return result;
};

const deleteParcel = async (parcelId: string) => {
  const result = await parcelsCollection.deleteOne({
    _id: new ObjectId(parcelId),
  });
  return result;
};

const getSingleParcel = async (parcelId: string) => {
  const result = await parcelsCollection.findOne({
    _id: new ObjectId(parcelId),
  });
  return result;
};

export const assignRider = async (
  parcelId: string,
  assignedRiderId: string,
  assignedRiderEmail: string,
  assignedRiderContact: string,
  assignedRiderNid: string
) => {
  // Start a MongoDB session for transaction
  const session = client.startSession();

  try {
    let parcelUpdate: any = null;
    let riderUpdate: any = null;

    await session.withTransaction(async () => {
      // 1. Update the parcel
      parcelUpdate = await parcelsCollection.updateOne(
        { _id: new ObjectId(parcelId) },
        {
          $set: {
            deliveryStatus: "rider_assigned",
            assignedRiderId,
            assignedRiderEmail,
            assignedRiderContact,
            assignedRiderNid,
          },
        },
        { session }
      );

      if (parcelUpdate.modifiedCount === 0) {
        throw new Error("Parcel not found or not updated");
      }

      // 2. Update the rider
      riderUpdate = await ridersCollection.updateOne(
        { _id: new ObjectId(assignedRiderId) },
        { $set: { status: "in-delivery" } },
        { session }
      );

      if (riderUpdate.modifiedCount === 0) {
        throw new Error("Rider not found or not updated");
      }
    });

    return { parcelUpdate, riderUpdate };
  } finally {
    await session.endSession();
  }
};

const assignableParcels = async () => {
  const result = await parcelsCollection
    .find({
      deliveryStatus: "not_collected",
      paymentStatus: "paid",
    })
    .toArray();
  return result;
};

const getParcelsByAssignedRiders = async (email: string) => {
  const riderParcels = await parcelsCollection
    .find({
      assignedRiderEmail: email,
      deliveryStatus: { $in: ["rider_assigned", "in_transit"] },
    })
    .sort({ createdAt: -1 }) // Newest first
    .toArray();
  return riderParcels;
};

const completedParcelsByRiders = async (query: Filter<Document>, options: (FindOptions<Document> & Abortable) | undefined) => {
  const completedParcels = await parcelsCollection
    .find(query, options)
    .toArray();
  return completedParcels;
};

export const parcelServices = {
  createParcel,
  getParcels,
  deleteParcel,
  getSingleParcel,
  assignRider,
  assignableParcels,
  getParcelsByAssignedRiders,
  completedParcelsByRiders,
};
