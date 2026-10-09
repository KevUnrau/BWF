import { Router } from "express";
import * as betController from "../controllers/betController.js";
import { auth, groupMemberAuth } from "../middleware/auth.js";
import { validate, betValidation } from "../middleware/validate.js";

const router = Router();

router.use(auth);

router.get("/", groupMemberAuth, betController.getBets);
router.put(
  "/",
  groupMemberAuth,
  validate(betValidation),
  betController.putBets,
);

export default router;
