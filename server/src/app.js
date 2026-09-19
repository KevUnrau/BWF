import express from "express";
import morgan from "morgan";
import env from "./config/env.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import betRoutes from "./routes/betRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import invitationRoutes from "./routes/invitationRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { NotFoundError } from "./errors/AppError.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));
app.use(cookieParser());
app.use(express.json());

app.use("/bets", betRoutes);
app.use("/groups", groupRoutes);
app.use("/auth", authRoutes);
app.use("/invitations", invitationRoutes);
app.use("/sessions", sessionRoutes);

// Fallback for Unmatched Routes
app.all("{*path}", (req, res, next) => {
  next(new NotFoundError(req.originalUrl));
});

//global error handler
app.use(errorHandler);

export default app;
