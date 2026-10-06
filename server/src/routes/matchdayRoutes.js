import { Router } from "express";
import { auth, adminAuth } from "../middleware/auth.js";
import * as matchdayController from "../controllers/matchdayController.js";
import {
  validate,
  closeMatchdayValidation,
  recalculateMatchdayValidation,
} from "../middleware/validate.js";

const router = Router();

router.use(auth);
router.use(adminAuth);

router.post(
  "/close",
  validate(closeMatchdayValidation),
  matchdayController.closeMatchday,
);

router.post(
  "/recalculate",
  validate(recalculateMatchdayValidation),
  matchdayController.recalculateMatchday,
);

export default router;
