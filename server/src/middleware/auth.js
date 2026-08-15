import {
  InvalidCredentialsError,
  TokenExpiredError,
} from "../errors/AppError.js";
import { verifyToken } from "../services/authService.js";

export async function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  try {
    if (!authHeader) {
      throw new InvalidCredentialsError();
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new InvalidCredentialsError();
    }

    await verifyToken(token);
  } catch (error) {
    if ((error.code = "ERR_JWT_EXPIRED")) {
      error = new TokenExpiredError();
    }
    next(error);
  }
  return next();
}
