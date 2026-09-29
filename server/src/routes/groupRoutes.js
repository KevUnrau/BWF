import { Router } from "express";
import * as groupController from "../controllers/groupController.js";
import {
  validate,
  groupValidation,
  removeUserValidation,
} from "../middleware/validate.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.use(auth);

router.get("/", groupController.getGroupsByUser);

router.post("/", validate(groupValidation), groupController.postGroup);

router.get("/:groupId/sessions", groupController.getSessionsByGroup);

router.delete(
  "/:groupId/members",
  validate(removeUserValidation),
  groupController.deleteMember,
);

router.delete("/:groupId/leave", groupController.leaveGroup);

router.delete("/", groupController.deleteGroup);

export default router;
