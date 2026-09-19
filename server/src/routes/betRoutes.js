import { Router } from "express";
import * as betController from "../controllers/betController.js";
import { auth } from "../middleware/auth.js";
import { validate, betValidation } from "../middleware/validate.js";

const router = Router();

router.use(auth);

router.get("/", betController.getBets);
router.put("/", validate(betValidation), betController.putBets);

export default router;
