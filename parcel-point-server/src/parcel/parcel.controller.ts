import { Request, Response } from "express";
import { assignRider, parcelServices } from "./parcel.service";
import { FindOptions } from "mongodb";

// create parcel
const createParcel = async (req: Request, res: Response) => {
  try {
    const result = await parcelServices.createParcel(req.body);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "error happend" });
  }
};

// get parcels from db
const getParcels = async (req: Request, res: Response) => {
  try {
    const userEmail = req.query?.email as string;
    const query = userEmail ? { created_by: userEmail } : {};
    const options: FindOptions = {
      sort: { createdAt: -1 },
    };
    const result = await parcelServices.getParcels(query, options);
    res.send(result);
  } catch (error) {
    console.error("error fetching parceels: ", error);
    res.status(500).send({ message: "failed to get parcels" });
  }
};

// delete parcel
const deleteParcel = async (req: Request, res: Response) => {
  const parcelId = req.params?.id;

  try {
    const result = await parcelServices.deleteParcel(parcelId as string);
    if (result.deletedCount > 0) {
      res.send(result);
    } else {
      res.status(404).send({ message: "failed to delete parcel" });
    }
  } catch (error) {
    console.error("Error deleting parcel:", error);
    res.status(500).send({ message: "failed to delete parcel" });
  }
};

// Get single parcel by id
const getSingleParcel = async (req: Request, res: Response) => {
  const parcelId = req.params?.id;

  try {
    const result = await parcelServices.getSingleParcel(parcelId as string);
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "Parcel not found" });
    }
  } catch (error) {
    console.error("Error fetching parcel:", error);
    res.status(500).send({ message: "Failed to fetch parcel" });
  }
};

const assignParcel = async (req: Request, res: Response) => {
  const {
    parcelId,
    assignedRiderId,
    assignedRiderEmail,
    assignedRiderContact,
    assignedRiderNid,
  } = req.body;

  // Validate required fields
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
    const { parcelUpdate, riderUpdate } = await assignRider(
      parcelId,
      assignedRiderId,
      assignedRiderEmail,
      assignedRiderContact,
      assignedRiderNid
    );

    res.send({
      message: "Rider assigned to parcel successfully",
      parcelUpdate,
      riderUpdate,
    });
  } catch (err: any) {
    console.error("Assignment failed:", err.message || err);
    res.status(500).send({ message: "Assignment failed", error: err.message });
  }
};

// GET /parcels?status=assignable paid but not collected
const assignableParcel = async (req: Request, res: Response) => {
  try {
    const parcels = await parcelServices.assignableParcels();
    res.send(parcels);
  } catch (error) {
    console.error("Error fetching assignable parcels:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getParcelsByAssignedRiders = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).send({ message: "Rider email is required." });
    }

    const riderParcels = await parcelServices.getParcelsByAssignedRiders(
      email as string
    );
    res.send(riderParcels);
  } catch (error) {
    console.error("Failed to fetch rider parcels:", error);
    res.status(500).send({ message: "Server error while fetching parcels." });
  }
};


 const completedParcelsByRider =
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

          const completedParcels = await parcelServices.completedParcelsByRiders(query, options)
          res.send(completedParcels);
        } catch (error) {
          console.error("Error loading completed parcels:", error);
          res
            .status(500)
            .send({ message: "Failed to load completed deliveries" });
        }
      }

export const parcelsController = {
  createParcel,
  getParcels,
  deleteParcel,
  getSingleParcel,
  assignParcel,
  assignableParcel,
  getParcelsByAssignedRiders,completedParcelsByRider
};
