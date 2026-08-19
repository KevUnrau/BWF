import { Router } from "express";
import * as betController from "../controllers/betController.js";
import { auth } from "../middleware/auth.js";
import { validate, betValidation } from "../middleware/validate.js";

const router = Router();

router.get("/", betController.getBets);
router.get("/standings", betController.getStandings);
router.get("/:id", betController.getBetById);

router.use(auth);
router.put("/", validate(betValidation), betController.putBets);

export default router;
