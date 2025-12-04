import { Router } from "express";
import { parcelsController } from "./parcel.controller";
import { verifyFireBaseToken } from "../middleware/verifyFirebaseToken";
import { verifyAdmin } from "../middleware/verifyAdmin";

const router = Router();

//! parcel routes
router.post("/", verifyFireBaseToken, parcelsController.createParcel);

router.get("/", verifyFireBaseToken, parcelsController.getParcels);

router.delete("/:id", verifyFireBaseToken, parcelsController.deleteParcel);

router.get(
  "/parcelData/:id",
  verifyFireBaseToken,
  parcelsController.getSingleParcel
);

router.patch(
  "/assign",
  verifyFireBaseToken,
  verifyAdmin,
  parcelsController.assignParcel
);

router.get(
  "/assignable",
  verifyFireBaseToken,
  verifyAdmin,
  parcelsController.assignableParcel
);

export const parcelRoutes = router;
