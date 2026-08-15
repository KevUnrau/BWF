import { token } from "morgan";
import * as authService from "../services/authService.js";
import env from "../config/env.js";

const refreshProps = {
  httpOnly: true, // Prevents client-side JS from reading the cookie (XSS protection)
  secure: env.nodeEnv === "production", // Only send over HTTPS in production
  sameSite: "lax", // Protects against CSRF attacks ('strict' or 'lax')
  maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration in milliseconds (e.g., 7 days)
  path: "/auth", // Optional: Restrict cookie transmission strictly to auth endpoints
};

export const signUp = async (req, res, next) => {
  const body = req.body;
  try {
    const user = await authService.createUser(body);
    try {
      const tokens = await authService.createSession(user.id);
      res.cookie("refreshToken", tokens.refreshToken, refreshProps);
      return res.status(201).send({
        message: "User created.",
        token: tokens.token,
        user: user,
        refreshToken: tokens.refreshToken,
      });
    } catch (error) {
      return res.status(201).send({ message: "User created. Please log in." });
    }
  } catch (error) {
    return next(error);
  }
};

export const signIn = async (req, res, next) => {
  const body = req.body;
  try {
    const { user, tokens } = await authService.signIn(body);
    res.cookie("refreshToken", tokens.refreshToken, refreshProps);
    return res.status(200).send({
      message: "Login successful.",
      token: tokens.token,
      user: user,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    return next(error);
  }
};

export const signOut = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    try {
      await authService.revokeSession(refreshToken);
    } catch (error) {
      console.error(error);
    }
  }
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    path: "/auth",
  });
  return res.status(200).json({ message: "Logged out successfully." });
};

export const refresh = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    const refresh = await authService.refresh(refreshToken);
    //res.cookie("refreshToken", refresh.refreshToken, refreshProps);
    return res.status(200).json({
      message: "refresh successful",
      token: refresh.token,
      user: refresh.user,
    });
  } catch (error) {
    return next(error);
  }
};
