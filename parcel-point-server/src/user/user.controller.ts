import { Request, Response } from "express";
import { userService, userServices } from "./user.service";
import { usersCollection } from "../config/db";

// post an user to db
const createUser = async (req: Request, res: Response) => {
  try {
    const { email, role, last_log_in, created_at } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }

    // Check if user exists
    const userExists = await userService.findUserByEmail(
      usersCollection,
      email
    );

    if (userExists) {
      const updateResult = await userService.updateLastLogin(
        usersCollection,
        email,
        last_log_in
      );

      return res.status(200).send({
        message: "User already exists, last_log_in updated",
        inserted: false,
        updated: updateResult.modifiedCount > 0,
      });
    }

    // Create new user
    const newUser = {
      email,
      role: role || "user",
      last_log_in,
      created_at,
    };

    const insertResult = await userService.createUser(usersCollection, newUser);

    return res.status(201).send({
      message: "New user created",
      inserted: true,
      result: insertResult,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const getUser = async (req: Request, res: Response) => {
  const { email = "", role = "" } = req.query as {
    email?: string;
    role?: string;
  };

  // If neither email nor role is provided
  if (!email && !role) {
    return res.status(400).send({ message: "Missing email or role query" });
  }

  const query: Record<string, any> = {};

  if (email) {
    const regex = new RegExp(email, "i"); // case-insensitive partial match
    query.email = { $regex: regex };
  }

  if (role) {
    query.role = role;
  }
  try {
    const users = await userServices.getUser(query);
    res.send(users);
  } catch (err: any) {
    console.error("Error searching users", err);
    res.status(500).send({ message: "Error searching users" });
  }
};

// Get role by email
const getRoleByEmail = async (req: Request, res: Response) => {
  try {
    const email = req.params?.email;
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    const user = await userServices.getRoleByEmail(email);

    if (!user) {
      return res.status(400).send({ message: "user not found" });
    }
    res.send({ role: user.role || "user" });
  } catch (error) {
    console.error("Error getting the role: ", error);
    res.status(500).send({ message: "Failed to get role" });
  }
};

const updateUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["admin", "user"].includes(role)) {
    return res.status(400).send({ message: "invalid role" });
  }

  try {
    const result = await userServices.updateUserRole(id as string, role);
    if (result.acknowledged) {
      res.send({ message: `User role updated to ${role}`, result });
    } else {
      res.status(500).send({ message: "Failed to update user role" });
    }
  } catch (error) {
    res.status(500).send({ message: "Failed to update user role" });
  }
};

export const userController = {
  createUser,
  getUser,
  getRoleByEmail,
  updateUserRole,
};
