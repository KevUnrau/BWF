import { Router } from "express";
import * as sessionController from "../controllers/sessionController.js";
import { auth, groupAdminAuth, groupMemberAuth } from "../middleware/auth.js";
import {
  validate,
  sessionValidation,
  removeSessionValidation,
} from "../middleware/validate.js";

const router = Router();

router.use(auth);

router.get("/:id/matchdays", groupMemberAuth, sessionController.getMatchdays);

router.get("/:id/bets", groupMemberAuth, sessionController.getBets);

router.get("/:id/matches", groupMemberAuth, sessionController.getMatches);

router.get("/:id/standings", groupMemberAuth, sessionController.getStandings);

router.post(
  "/",
  groupAdminAuth,
  validate(sessionValidation),
  sessionController.postSession,
);

router.delete(
  "/",
  groupAdminAuth,
  validate(removeSessionValidation),
  sessionController.deleteSession,
);

export default router;
