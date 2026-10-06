import { Router } from "express";
import * as competitionController from "../controllers/competitionController.js";

const router = Router();

router.get("/", competitionController.getCompetitions);

router.get("/:id/seasons", competitionController.getSeasons);

router.get(
  "/:competitionId/season/:seasonId/matchdays",
  competitionController.getMatchdays,
);

router.get(
  "/:competitionId/season/:seasonId/matches",
  competitionController.getMatches,
);

export default router;
