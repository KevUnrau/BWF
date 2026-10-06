import { body, query } from "express-validator";
import { ValidationError } from "../errors/AppError.js";
import * as authRepository from "../repositories/authRepository.js";
import * as groupRepository from "../repositories/groupRepository.js";
import * as betRepository from "../repositories/betRepository.js";

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
    .withMessage("Email is too long.")
    .custom(async (value, { req }) => {
      const user = await authRepository.findUserByMail(value);
      if (user) {
        throw new Error("This mail is already in use.");
      }
    }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password needs at least 8 characters.")
    .matches("[0-9]")
    .withMessage("Password needs to contain at least one number.")
    .matches("[A-Z]")
    .withMessage("Password needs to contain at least one capital letter."),
  usernameValidationChain("name").custom(async (value, { req }) => {
    const user = await authRepository.findUserByName(value);
    if (user) {
      throw new Error(
        "This name is already in use. Please choose another one.",
      );
    }
  }),
];

export const betValidation = [
  goalValidationChain("bets.*.homeGoals"),
  goalValidationChain("bets.*.awayGoals"),
];

export const invitationValidation = [
  usernameValidationChain("invited").custom(async (value, { req }) => {
    const user = await authRepository.findUserByName(value);
    if (!user) {
      throw new Error("User does not exist.");
    }
    if (user.id === req.user) {
      throw new Error("You can't invite yourself.");
    }
    const groups = await groupRepository.findGroupsByUser(user.id);
    const isMember = groups.find((group) => {
      return group.group_id === req.body.groupId;
    });
    if (isMember) {
      throw new Error(`${value} is already a member of this group.`);
    }
    const activeInvitations = await groupRepository.findInvitationsByUser(
      user.id,
      1,
      new Date().toISOString(),
    );
    if (activeInvitations.length > 0) {
      throw new Error(
        `${value} already has an active invitation for this group.`,
      );
    }
  }),
];

export const groupValidation = [
  body("groupName")
    .isLength({ min: 4, max: 50 })
    .withMessage("Please choose a group name between 4 and 50 characters.")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "Group name can only contain letters, numbers and underscores.",
    )
    .custom(async (value, { req }) => {
      const group = await groupRepository.findGroupByName(value);
      if (group) {
        throw new Error(
          "Please choose a different name. This Group already exists.",
        );
      }
    }),
];

export const removeUserValidation = [
  usernameValidationChain("member", query).custom(async (value, { req }) => {
    const user = await authRepository.findUserByName(value);
    if (!user) {
      throw new Error("User does not exist.");
    }
    if (user.id === req.user) {
      throw new Error("You can't remove yourself.");
    }
    const groups = await groupRepository.findGroupsByUser(user.id);
    const isMember = groups.find((group) => {
      return group.group_id === Number(req.params.groupId);
    });
    if (!isMember) {
      throw new Error(`${value} is not a member of this group.`);
    }
  }),
];

export const sessionValidation = [
  sessionValidationChain("name").custom(async (value, { req }) => {
    const session = await betRepository.findSessionByName(
      req.body.groupId,
      value,
    );
    if (session) {
      throw new Error(
        "Session name already in use. Please choose a different one.",
      );
    }
  }),
];

export const removeSessionValidation = [
  sessionValidationChain("session", query).custom(async (value, { req }) => {
    const session = await betRepository.findSessionByName(
      Number(req.query.groupId),
      value,
    );
    if (!session) {
      throw new Error("Session does not exist.");
    }
  }),
];
