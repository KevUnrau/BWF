import { Router } from "express";
import * as competitionController from "../controllers/competitionController.js";

const router = Router();

router.get("/", competitionController.getCompetitions);

router.get(
  "/:competitionId/matchdays/current",
  competitionController.getCurrentMatchday,
);

router.get(
  "/:competitionId/seasons/:seasonId/matchdays",
  competitionController.getMatchdays,
);

export default router;
