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

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden.") {
    super(message, 403);
  }
}

export class TokenExpiredError extends InvalidCredentialsError {
  constructor(message = "Access token expired.") {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found.") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Input validation failed.") {
    super(message, 400);
  }
}
