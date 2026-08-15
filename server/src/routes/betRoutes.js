import { Router } from "express";
import * as betController from "../controllers/betController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", betController.getBets);
router.get("/standings", betController.getStandings);
router.get("/:id", betController.getBetById);

router.use(auth);
router.put("/", betController.putBets);

export default router;
