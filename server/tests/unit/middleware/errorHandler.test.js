import { vi, describe, it, expect } from "vitest";
import { httpStatus } from "../../../src/constants/httpStatus.js";
import { next, res } from "../../mocks/modules/express.js";
import { errorMessages } from "../../../src/errors/AppError.js";
import * as errors from "../../../src/errors/AppError.js";
import { errorHandler } from "../../../src/middleware/errorHandler.js";

describe("errorHandler", () => {
  const req = {};

  it.each([
    {
      error: new errors.AppError(),
      expected: {
        status: httpStatus.internalServerError,
        body: {
          status: "fail",
          message: errorMessages.app,
          error: "AppError",
        },
      },
    },
    {
      error: new errors.ConflictError(),
      expected: {
        status: httpStatus.conflict,
        body: {
          status: "fail",
          message: errorMessages.conflict,
          error: "ConflictError",
        },
      },
    },
    {
      error: new errors.ForbiddenError(),
      expected: {
        status: httpStatus.forbidden,
        body: {
          status: "fail",
          message: errorMessages.forbidden,
          error: "ForbiddenError",
        },
      },
    },
    {
      error: new errors.InvalidCredentialsError(),
      expected: {
        status: httpStatus.unauthorized,
        body: {
          status: "fail",
          message: errorMessages.invalidCredentials,
          error: "InvalidCredentialsError",
        },
      },
    },
    {
      error: new errors.NotFoundError(),
      expected: {
        status: httpStatus.notFound,
        body: {
          status: "fail",
          message: errorMessages.notFound,
          error: "NotFoundError",
        },
      },
    },
    {
      error: new errors.TokenExpiredError(),
      expected: {
        status: httpStatus.unauthorized,
        body: {
          status: "fail",
          message: errorMessages.tokenExpired,
          error: "TokenExpiredError",
        },
      },
    },
    {
      error: new errors.ValidationError(),
      expected: {
        status: httpStatus.badRequest,
        body: {
          status: "fail",
          message: errorMessages.inputValidation,
          error: "ValidationError",
        },
      },
    },
  ])(
    "receives an instance of AppError and sends http error status and response body containing the default error message.",
    ({ error, expected }) => {
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(expected.status);
      expect(res.json).toHaveBeenCalledWith(expected.body);
    },
  );

  it("receives an AppError with a custom message and sends the response body containing the custom error message.", () => {
    const customMessage = "custom";
    const error = new errors.AppError(customMessage);

    errorHandler(error, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: customMessage,
      error: "AppError",
    });
  });

  it("receives an unexpected Error, logs it and sends http error status and response body.", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const unexpectedError = new Error("unexpected");

    errorHandler(unexpectedError, req, res, next);

    expect(console.error).toHaveBeenCalledWith(
      "UNHANDLED ERROR:",
      unexpectedError,
    );

    expect(res.status).toHaveBeenCalledWith(httpStatus.internalServerError);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: errorMessages.unexpected,
    });
  });
});
