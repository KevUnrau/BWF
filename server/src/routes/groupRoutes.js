import { Router } from "express";
import * as groupController from "../controllers/groupController.js";
import { auth } from "../middleware/auth.js";
import { validate, invitationValidation } from "../middleware/validate.js";

const router = Router();

router.use(auth);

router.get("/", groupController.getGroupsByUser);

router.get("/:groupId/sessions", groupController.getSessions);

router.post(
  "/:groupId/invitation",
  validate(invitationValidation),
  groupController.postInvitation,
);

router.put("/invitations/response", groupController.putInvitationsResponse);

export default router;
