import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { validate, userValidation } from "../middleware/validate.js";

const router = Router();

router.post("/signup", validate(userValidation), authController.signUp);

router.post("/signin", authController.signIn);

router.post("/refresh", authController.refresh);

router.post("/signout", authController.signOut);

export default router;
