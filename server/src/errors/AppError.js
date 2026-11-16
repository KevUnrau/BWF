import { httpStatus } from "../constants/httpStatus.js";

export const errorMessages = {
  app: "An error has occured.",
  invalidCredentials: "Invalid credentials.",
  forbidden: "Forbidden.",
  tokenExpired: "Access token expired.",
  notFound: "Not found.",
  conflict: "Conflict.",
  inputValidation: "Input validation failed.",
  unexpected: "Something went wrong on our end.",
};

export class AppError extends Error {
  constructor(
    message = "An error has occured.",
    statusCode = httpStatus.internalServerError,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message = "Invalid credentials.") {
    super(message, httpStatus.unauthorized);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden.") {
    super(message, httpStatus.forbidden);
  }
}

export class TokenExpiredError extends InvalidCredentialsError {
  constructor(message = "Access token expired.") {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found.") {
    super(message, httpStatus.notFound);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict.") {
    super(message, httpStatus.conflict);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Input validation failed.") {
    super(message, httpStatus.badRequest);
  }
}
