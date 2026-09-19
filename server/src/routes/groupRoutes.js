import { Router } from "express";
import * as groupController from "../controllers/groupController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.use(auth);

router.get("/", groupController.getGroupsByUser);

router.get("/:groupId/sessions", groupController.getSessionsByGroup);

export default router;
