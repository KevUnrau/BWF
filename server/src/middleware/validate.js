import { body, query } from "express-validator";
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
      return next(error);
    }
    return next();
  };
};

const nameValidationChain = (field, minLength, maxLength, validator = body) => {
  return validator(field)
    .trim()
    .isLength({ min: minLength, max: maxLength })
    .withMessage(
      `Name must be between ${minLength} and ${maxLength} characters.`,
    )
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Name can only contain letters, numbers and underscores.");
};

const goalValidationChain = (field) => {
  return body(field)
    .isInt({ min: 0, max: 50 })
    .withMessage("Goals must be a whole number between 0 and 50.")
    .toInt();
};

export const userValidation = [
  body("mail").trim().isEmail().withMessage("This is not a valid mail."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password needs at least 8 characters.")
    .matches("[0-9]")
    .withMessage("Password needs to contain at least one number.")
    .matches("[A-Z]")
    .withMessage("Password needs to contain at least one capital letter."),
  nameValidationChain("name", 4, 30),
];

export const betValidation = [
  goalValidationChain("bets.*.homeGoals"),
  goalValidationChain("bets.*.awayGoals"),
];

export const closeMatchdayValidation = [
  goalValidationChain("matches.*.homeGoals"),
  goalValidationChain("matches.*.awayGoals"),
];

export const invitationValidation = [nameValidationChain("invited", 4, 30)];

export const groupValidation = [nameValidationChain("groupName", 4, 30)];

export const removeUserValidation = [
  nameValidationChain("member", 4, 30, query),
];

export const sessionValidation = [nameValidationChain("name", 2, 30)];

export const removeSessionValidation = [
  nameValidationChain("session", 2, 30, query),
];
