import { Router } from "express";
import * as matchController from "../controllers/matchController.js";

const router = Router();

router.get("/", matchController.getMatches);

router.get("/:id", matchController.getMatchById);

export default router;
