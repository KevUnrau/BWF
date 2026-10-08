import { Router } from "express";
import * as sessionController from "../controllers/sessionController.js";
import { auth, groupAdminAuth } from "../middleware/auth.js";
import {
  validate,
  sessionValidation,
  removeSessionValidation,
} from "../middleware/validate.js";

const router = Router();

router.use(auth);

router.get("/:id/matchdays", sessionController.getMatchdays);

router.get("/:id/bets", sessionController.getBets);

router.get("/:id/matches", sessionController.getMatches);

router.get("/:id/standings", sessionController.getStandings);

router.use(groupAdminAuth);

router.post("/", validate(sessionValidation), sessionController.postSession);

router.delete(
  "/",
  validate(removeSessionValidation),
  sessionController.deleteSession,
);

export default router;
