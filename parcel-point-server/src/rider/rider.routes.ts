import { Router } from "express";
import { verifyFireBaseToken } from "../middleware/verifyFirebaseToken";
import { riderController } from "./rider.controller";
import { verifyAdmin } from "../middleware/verifyAdmin";
import { parcelsController } from "../parcel/parcel.controller";
import { verifyRider } from "../middleware/verifyRider";

const router = Router();

//! Rider routes
router.post("/", verifyFireBaseToken, riderController.beARider);

router.get(
  "/pending",
  verifyFireBaseToken,
  verifyAdmin,
  riderController.pendingRiders
);
router.get(
  "/rider-parcels",
  verifyFireBaseToken,
  verifyRider,
  parcelsController.getParcelsByAssignedRiders
);

router.get(
  "/rider-completed-parcels",
  verifyFireBaseToken,
  verifyRider,
  parcelsController.completedParcelsByRider
);
router.get("/", verifyFireBaseToken, verifyAdmin, riderController.getRiders);

router.delete(
  "/:id",
  verifyFireBaseToken,
  verifyAdmin,
  riderController.deleteRider
);
router.patch(
  "/:id",
  verifyFireBaseToken,
  verifyAdmin,
  riderController.updateRider
);
router.patch(
  "/rider-parcels/:id/status",
  verifyFireBaseToken,
  verifyRider
  //!
);
router.get(
  "/rider/wallet",
  verifyFireBaseToken,
  verifyRider
  //!
);
router.get(
  "/rider/dashboard",
  verifyFireBaseToken,
  verifyRider
  //!
);
router.post(
  "/rider/cashout",
  verifyFireBaseToken,
  verifyRider
  //!
);

export const riderRoutes = router;
