import { Router } from "express";
import * as competitionController from "../controllers/competitionController.js";

const router = Router();

router.get("/", competitionController.getCompetitions);

router.get("/:id/seasons", competitionController.getSeasons);

export default router;
