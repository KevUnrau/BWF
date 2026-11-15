import { AppError } from "../errors/AppError.js";
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ status: "fail", message: err.message, error: err.name });
  }

  console.error("UNHANDLED ERROR:", err);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong on our end.",
  });
}

export default errorHandler;
