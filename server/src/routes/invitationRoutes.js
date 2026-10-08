import { Router } from "express";
import { auth, groupAdminAuth } from "../middleware/auth.js";
import * as invitationController from "../controllers/invitationController.js";
import { validate, invitationValidation } from "../middleware/validate.js";

const router = Router();

router.use(auth);

router.get("/", invitationController.getInvitiationsByUser);

router.get("/unread/count", invitationController.getUnreadInvitationsCount);

router.put("/response", invitationController.putInvitationsResponse);

router.use(groupAdminAuth);

router.post(
  "/",
  validate(invitationValidation),
  invitationController.postInvitation,
);

export default router;
