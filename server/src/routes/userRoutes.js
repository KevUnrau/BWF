import { Router } from "express";
import { auth } from "../middleware/auth.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.use(auth);

router.get("/:userId/invitations", userController.getInvitiationsByUser);

export default router;
