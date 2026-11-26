import { vi, describe, it, expect, beforeEach } from "vitest";
import { res, next } from "../../mocks/modules/express.js";
import { mockCreateUserBody } from "../../fixtures/requests/auth.js";
import { mockBetBody } from "../../fixtures/requests/bet.js";
import { mockCloseMatchdayBody } from "../../fixtures/requests/matchday.js";
import {
  mockPostGroupBody,
  mockDeleteMemberQuery,
  mockCreateSessionBody,
  mockRemoveSessionQuery,
} from "../../fixtures/requests/group.js";
import { mockInvitationBody } from "../../fixtures/requests/invitation.js";
import { ValidationError } from "../../../src/errors/AppError";
import * as validate from "../../../src/middleware/validate.js";

const req = {};

describe("validate", () => {
  const mockValidations = [{ run: vi.fn() }];

  it("calls the error handler with a validation Error because the validation failed.", async () => {
    const mockValidationResult = {
      errors: [{ msg: "error message" }],
      isEmpty: vi.fn().mockReturnValue(false),
    };

    mockValidations[0].run.mockResolvedValue(mockValidationResult);

    await validate.validate(mockValidations)(req, res, next);

    expect(mockValidations[0].run).toHaveBeenCalledWith(req);
    expect(mockValidationResult.isEmpty).toHaveBeenCalledWith();

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it("validates the input and calls the next middleware because the validation succeeded.", async () => {
    const mockValidationResult = {
      isEmpty: vi.fn().mockReturnValue(true),
    };

    mockValidations[0].run.mockResolvedValue(mockValidationResult);

    await validate.validate(mockValidations)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });
});

describe("userValidation", () => {
  beforeEach(() => {
    req.body = { ...mockCreateUserBody };
  });

  it.each([
    {
      description: "the mail is not valid.",
      mail: "invalidMail",
      expected: "This is not a valid mail.",
    },
    {
      description: "Password is too short.",
      password: "short",
      expected: "Password needs at least 8 characters.",
    },
    {
      description: "Password needs to contain at least one number.",
      password: "PasswordWithoutNumber",
      expected: "Password needs to contain at least one number.",
    },
    {
      description: "Password needs to contain at least one capital letter.",
      password: "!withoutcapitalletter1",
      expected: "Password needs to contain at least one capital letter.",
    },
    {
      description: "username is too long.",
      username: "thisNameIsTooLongBecauseItHasMoreThan30Characters",
      expected: "Name must be between 4 and 30 characters.",
    },
    {
      description: "username is too short.",
      username: "nam",
      expected: "Name must be between 4 and 30 characters.",
    },
    {
      description: "username contains an invalid character.",
      username: "user-name",
      expected: "Name can only contain letters, numbers and underscores.",
    },
  ])(
    "calls the error handler with a validation error because $description",
    async ({
      mail = mockCreateUserBody.mail,
      username = mockCreateUserBody.name,
      password = mockCreateUserBody.password,
      expected,
    }) => {
      req.body.password = password;
      req.body.mail = mail;
      req.body.name = username;

      await validate.validate(validate.userValidation)(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(next).toHaveBeenCalledWith(new ValidationError(expected));
    },
  );

  it("validates a user, trims the mail and username and calls the next middleware.", async () => {
    req.body.mail = " " + mockCreateUserBody.mail + " ";
    req.body.name = " " + mockCreateUserBody.name + " ";

    await validate.validate(validate.userValidation)(req, res, next);

    expect(req.body).toStrictEqual(mockCreateUserBody);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });

  it("validates a user and calls the next middleware.", async () => {
    await validate.validate(validate.userValidation)(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});

describe("betValidation", () => {
  beforeEach(() => {
    req.body = structuredClone(mockBetBody);
  });

  it.each([
    { description: "goals is negative.", goals: -1 },
    { description: "goals is bigger than 50.", goals: 51 },
    { description: "goals is not a whole number.", goals: 3.1 },
    { description: "goals contains a character.", goals: "3c" },
  ])(
    "calls the error handler with a validation error because $description",
    async ({ goals }) => {
      req.body.bets[0].homeGoals = goals;

      await validate.validate(validate.betValidation)(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(next).toHaveBeenCalledWith(
        new ValidationError("Goals must be a whole number between 0 and 50."),
      );
    },
  );

  it("validates the goal inputs, converts number Strings to Numbers and calls the next middleware.", async () => {
    req.body.bets[0].homeGoals = "3";

    await validate.validate(validate.betValidation)(req, res, next);

    expect(req.body.bets[0].homeGoals).toBe(3);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });
});

describe("closeMatchdayValidation", () => {
  beforeEach(() => {
    req.body = structuredClone(mockCloseMatchdayBody);
  });

  it("calls the error handler with a validation error because goals is negative.", async () => {
    req.body.matches[0].homeGoals = -1;

    await validate.validate(validate.closeMatchdayValidation)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(
      new ValidationError("Goals must be a whole number between 0 and 50."),
    );
  });

  it("validates the goal inputs and calls the next middleware.", async () => {
    await validate.validate(validate.closeMatchdayValidation)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });
});

describe("invitationValidation", () => {
  beforeEach(() => {
    req.body = { ...mockInvitationBody };
  });

  it("calls the error handler with a validation error because the invited username is too short.", async () => {
    req.body.invited = "abc";

    await validate.validate(validate.invitationValidation)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(
      new ValidationError("Name must be between 4 and 30 characters."),
    );
  });

  it("validates the invited username and calls the next middleware.", async () => {
    await validate.validate(validate.invitationValidation)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });
});

describe("groupValidation", () => {
  beforeEach(() => {
    req.body = { ...mockPostGroupBody };
  });

  it("calls the error handler with a validation error because the group name is too short.", async () => {
    req.body.groupName = "abc";

    await validate.validate(validate.groupValidation)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(
      new ValidationError("Name must be between 4 and 30 characters."),
    );
  });

  it("validates the group name and calls the next middleware.", async () => {
    await validate.validate(validate.groupValidation)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });
});

describe("removeUserValidation", () => {
  beforeEach(() => {
    req.query = { ...mockDeleteMemberQuery };
  });

  it("calls the error handler with a validation error because the username is too short.", async () => {
    req.query.member = "abc";

    await validate.validate(validate.removeUserValidation)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(
      new ValidationError("Name must be between 4 and 30 characters."),
    );
  });

  it("validates the username and calls the next middleware.", async () => {
    await validate.validate(validate.removeUserValidation)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });
});

describe("sessionValidation", () => {
  beforeEach(() => {
    req.body = { ...mockCreateSessionBody };
  });

  it("calls the error handler with a validation error because the session name is too short.", async () => {
    req.body.name = "a";

    await validate.validate(validate.sessionValidation)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(
      new ValidationError("Name must be between 2 and 30 characters."),
    );
  });

  it("validates the session name and calls the next middleware.", async () => {
    await validate.validate(validate.sessionValidation)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });
});

describe("removeSessionValidation", () => {
  beforeEach(() => {
    req.query = { ...mockRemoveSessionQuery };
  });

  it("calls the error handler with a validation error because the session name is too short.", async () => {
    req.query.session = "a";

    await validate.validate(validate.removeSessionValidation)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(
      new ValidationError("Name must be between 2 and 30 characters."),
    );
  });

  it("validates the session name and calls the next middleware.", async () => {
    await validate.validate(validate.removeSessionValidation)(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });
});
