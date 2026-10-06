import { Router } from "express";
import { auth, adminAuth } from "../middleware/auth.js";
import * as matchdayController from "../controllers/matchdayController.js";

const router = Router();

router.use(auth);
router.use(adminAuth);

router.post("/close", matchdayController.closeMatchday);

router.post("/recalculate", matchdayController.recalculateMatchday);

export default router;
