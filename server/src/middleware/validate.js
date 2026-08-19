import { body, validationResult } from "express-validator";
import { ValidationError } from "../errors/AppError.js";

export const validate = (validations) => {
  return async (req, res, next) => {
    try {
      for (const validation of validations) {
        const result = await validation.run(req);
        if (!result.isEmpty()) {
          throw new ValidationError(result.errors[0].msg);
        }
      }
    } catch (error) {
      next(error);
    }
    return next();
  };
};

export const userValidation = [
  body("mail")
    .trim()
    .isEmail()
    .withMessage("This is not a valid mail.")
    .isLength({ max: 254 })
    .withMessage("Email is too long."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password needs at least 8 characters.")
    .matches("[0-9]")
    .withMessage("Password needs to contain at least one number.")
    .matches("[A-Z]")
    .withMessage("Password needs to contain at least one capital letter."),
  body("name")
    .isLength({ min: 4, max: 30 })
    .withMessage("Plesae choose a username between 4 and 30 characters.")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers and underscores."),
];

const goalValidationChain = (field) => {
  return body(field)
    .isInt({ min: 0, max: 50 })
    .withMessage("Goals must be a whole number between 0 and 50.");
};

export const betValidation = [
  goalValidationChain("bets.*.home_goals"),
  goalValidationChain("bets.*.away_goals"),
];
