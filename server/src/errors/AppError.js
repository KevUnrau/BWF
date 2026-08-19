export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message = "Invalid credentials.") {
    super(message, 401);
  }
}

export class TokenExpiredError extends InvalidCredentialsError {
  constructor(message = "Access token expired.") {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found.`, 404);
  }
}

export class ConflictError extends AppError {
  constructor(resource) {
    super(`${resource} already exists.`, 409);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Input validation failed.") {
    super(message, 400);
  }
}
