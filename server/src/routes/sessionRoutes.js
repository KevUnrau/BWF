import { Router } from "express";
import * as sessionController from "../controllers/sessionController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.use(auth);

router.get("/:id/matchdays", sessionController.getMatchdays);

router.get("/:id/bets", sessionController.getBets);

router.get("/:id/matches", sessionController.getMatches);

router.get("/:id/standings", sessionController.getStandings);

export default router;
