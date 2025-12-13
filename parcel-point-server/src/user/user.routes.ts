import { Router } from "express";
import { verifyFireBaseToken } from "../middleware/verifyFirebaseToken";
import { verifyAdmin } from "../middleware/verifyAdmin";
import { userController } from "./user.controller";

const router = Router();

//! User routes
router.post("/", verifyFireBaseToken, userController.createUser);

router.get("/search", verifyFireBaseToken, userController.getUser);

router.get("/:email/role", verifyFireBaseToken, userController.getRoleByEmail);

router.patch("/:id/role", verifyFireBaseToken, verifyAdmin, userController.updateUserRole);

export const userRoutes = router;
