import { Request, Response } from "express";
import { riderServices } from "./rider.service";
import { userServices } from "../user/user.service";

const beARider = async (req: Request, res: Response) => {
  const riderEmail = req.body?.email;
  const newRider = req.body;

  try {
    type RiderStatus = "pending" | "active" | "rejected";
    const existingRider = await riderServices.existingRider(riderEmail);

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

    const result = await riderServices.beARider(newRider);
    res.send(result);
  } catch (error) {
    console.error("Error inserting rider:", error);
    res
      .status(500)
      .send({ message: "Server error while submitting application." });
  }
};

const pendingRiders = async (req: Request, res: Response) => {
  try {
    const pendingRiders = await riderServices.getPendingRiders();

    res.send(pendingRiders);
  } catch (error: any) {
    console.error("Error fetching pending riders:", error);
    res.status(500).send({ message: "Failed to load pending riders" });
  }
};

const deleteRider = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await riderServices.deleteRider(id as string);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete rider" });
  }
};

const updateRider = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, email } = req.body;

  const allowedStatuses = ["active", "rejected", "pending", "in-delivery"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).send({ message: "Invalid status value" });
  }

  try {
    // Update rider status
    const result = await riderServices.updateRiderStatus(id as string, status);

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
    interface IUserUpdateDoc {
      $set: {
        role: string;
      };
    }
    interface IUserQuery {
      email: string;
    }

    if (userUpdateDoc) {
      const roleResult = await userServices.updateRoleToRider(
        userQuery as IUserQuery,
        userUpdateDoc as IUserUpdateDoc
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
};

const getRiders = async (req: Request, res: Response) => {
  const { status } = req.query as { status?: string };
  const query: Record<string, any> = {};
  if (status) {
    query.status = status;
  }
  try {
    const riders = await riderServices.getRiders(query);
    res.send(riders);
  } catch (err) {
    console.error("Error fetching riders", err);
    res.status(500).send({ message: "Failed to load riders" });
  }
};



export const riderController = {
  beARider,
  pendingRiders,
  deleteRider,
  updateRider,
  getRiders
};
