import { Router } from "express";
import { auth } from "../middleware/auth.js";
import * as invitationController from "../controllers/invitationController.js";
import { validate, invitationValidation } from "../middleware/validate.js";

const router = Router();

router.use(auth);

router.get("/", invitationController.getInvitiationsByUser);

router.post(
  "/",
  validate(invitationValidation),
  invitationController.postInvitation,
);

router.put("/response", invitationController.putInvitationsResponse);

export default router;
