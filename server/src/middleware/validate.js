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

const usernameValidationChain = (field, validator = body) => {
  return validator(field)
    .isLength({ min: 4, max: 30 })
    .withMessage("Plesae choose a username between 4 and 30 characters.")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers and underscores.");
};

const sessionValidationChain = (field, validator = body) => {
  return validator(field)
    .isLength({ min: 2, max: 30 })
    .withMessage("Please choose a session name between 2 and 30 characters.")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "Session name can only contain letters, numbers and underscores.",
    );
};

const goalValidationChain = (field) => {
  return body(field)
    .isInt({ min: 0, max: 50 })
    .withMessage("Goals must be a whole number between 0 and 50.");
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
  usernameValidationChain("name"),
];

export const betValidation = [
  goalValidationChain("bets.*.homeGoals"),
  goalValidationChain("bets.*.awayGoals"),
];

export const closeMatchdayValidation = [
  goalValidationChain("matches.*.homeGoals"),
  goalValidationChain("matches.*.awayGoals"),
];

export const invitationValidation = [usernameValidationChain("invited")];

export const groupValidation = [
  body("groupName")
    .isLength({ min: 4, max: 50 })
    .withMessage("Please choose a group name between 4 and 50 characters.")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "Group name can only contain letters, numbers and underscores.",
    ),
];

export const removeUserValidation = [usernameValidationChain("member", query)];

export const sessionValidation = [sessionValidationChain("name")];

export const removeSessionValidation = [
  sessionValidationChain("session", query),
];
