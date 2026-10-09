import { Router } from "express";
import * as groupController from "../controllers/groupController.js";
import {
  validate,
  groupValidation,
  removeUserValidation,
} from "../middleware/validate.js";
import { auth, groupAdminAuth, groupMemberAuth } from "../middleware/auth.js";

const router = Router({ mergeParams: true });

router.use(auth);

router.get("/", groupController.getGroupsByUser);

router.post("/", validate(groupValidation), groupController.postGroup);

router.get(
  "/:groupId/sessions",
  groupMemberAuth,
  groupController.getSessionsByGroup,
);
router.delete("/:groupId/leave", groupMemberAuth, groupController.leaveGroup);

router.get("/:groupId/userrole", groupMemberAuth, groupController.getUserRole);

router.delete(
  "/:groupId/members",
  groupAdminAuth,
  validate(removeUserValidation),
  groupController.deleteMember,
);

router.delete("/:groupId", groupAdminAuth, groupController.deleteGroup);

export default router;
