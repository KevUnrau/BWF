import { AppError } from "../errors/AppError.js";
import { httpStatus } from "../constants/httpStatus.js";
import { errorMessages } from "../errors/AppError.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ status: "fail", message: err.message, error: err.name });
  }

  console.error("UNHANDLED ERROR:", err);
  return res.status(httpStatus.internalServerError).json({
    status: "error",
    message: errorMessages.unexpected,
  });
}

export default errorHandler;
