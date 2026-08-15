import { Prisma } from "@prisma/client";
import {
  AppError,
  ConflictError,
  NotFoundError,
  InvalidCredentialsError,
} from "../errors/AppError.js";
function errorHandler(err, req, res, next) {
  let error = err;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        error = new ConflictError(error.meta?.target?.[0] || "field");
        break;
      }
      case "P2025": {
        error = new NotFoundError("field");
        break;
      }
      default: {
        error = new AppError(`Database operation failed: ${error.code}`);
        break;
      }
    }
  }

  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json({ status: "fail", message: error.message, error: error.name });
  }

  console.error("UNHANDLED ERROR:", error);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong on our end.",
  });
}

export default errorHandler;
