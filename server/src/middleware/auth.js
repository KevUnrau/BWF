import {
  InvalidCredentialsError,
  TokenExpiredError,
  ForbiddenError,
} from "../errors/AppError.js";
import { verifyToken } from "../services/authService.js";
import * as authRepository from "../repositories/authRepository.js";
import * as groupRepository from "../repositories/groupRepository.js";

export function extractGroup(req) {
  return Number(req.params.groupId ?? req.query.groupId ?? req.body.groupId);
}

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

    const { payload } = await verifyToken(token);
    //add user id to request for the following middlewares
    req.user = payload.sub;
  } catch (error) {
    if ((error.code = "ERR_JWT_EXPIRED")) {
      error = new TokenExpiredError();
    }
    return next(error);
  }
  return next();
}

export async function adminAuth(req, res, next) {
  try {
    const userId = req.user;
    const user = await authRepository.findUserById(userId);
    if (user.user_roles.name !== "admin") {
      throw new ForbiddenError();
    }
  } catch (error) {
    return next(error);
  }
  return next();
}

export async function groupMemberAuth(req, res, next) {
  try {
    const user = req.user;
    const group = extractGroup(req);
    const member = await groupRepository.findMember(user, group);
    if (!member) {
      throw new ForbiddenError();
    }
  } catch (error) {
    return next(error);
  }
  return next();
}

export async function groupAdminAuth(req, res, next) {
  try {
    const user = req.user;
    const group = extractGroup(req);
    const member = await groupRepository.findMember(user, group);
    if (!member || member.member_roles.name !== "admin") {
      throw new ForbiddenError();
    }
  } catch (error) {
    return next(error);
  }
  return next();
}
