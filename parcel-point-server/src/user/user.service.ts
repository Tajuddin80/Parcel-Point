import { Collection, ObjectId } from "mongodb";
import { usersCollection } from "../config/db";

export const userService = {
  async findUserByEmail(usersCollection: Collection, email: string) {
    return await usersCollection.findOne({ email });
  },

  async updateLastLogin(
    usersCollection: Collection,
    email: string,
    last_log_in: string
  ) {
    return await usersCollection.updateOne(
      { email },
      { $set: { last_log_in } }
    );
  },

  async createUser(usersCollection: Collection, payload: any) {
    return await usersCollection.insertOne(payload);
  },
};

const getUser = async (query: Record<string, any>) => {
  const result = await usersCollection
    .find(query)
    .project({ email: 1, created_at: 1, role: 1 })
    .limit(10)
    .toArray();

  return result;
};

const getRoleByEmail = async (email: string) => {
  const user = await usersCollection.findOne({ email });
  return user;
};

const updateUserRole = async (id: string, role: string) => {
  const result = await usersCollection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: { role },
    }
  );
  return result;
};

export const userServices = {
  getUser,
  getRoleByEmail,
  updateUserRole,
};
