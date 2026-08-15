import * as authRepository from "../repositories/authRepository.js";
import { SignJWT, jwtVerify, decodeJwt } from "jose";
import * as argon2 from "argon2";
import env from "../config/env.js";
import { InvalidCredentialsError, NotFoundError } from "../errors/AppError.js";
import crypto from "node:crypto";
import console from "node:console";

const accessSecret = new TextEncoder().encode(env.jwtAccessSecret);
const refreshSecret = new TextEncoder().encode(env.jwtRefreshSecret);

function hashSHA256(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createUser(body) {
  const user = {
    username: body.name,
    mail: body.mail,
    password_hash: await argon2.hash(body.password),
  };
  return authRepository.createUser(user);
}

export async function createSession(userId) {
  const [token, refreshToken] = await Promise.all([
    new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(userId)
      .setExpirationTime("15m")
      .sign(accessSecret),
    new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(userId)
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(refreshSecret),
  ]);

  const claims = await decodeJwt(refreshToken);
  const refreshTokenHash = hashSHA256(refreshToken);

  await authRepository.createSession(userId, refreshTokenHash, claims);

  return { token: token, refreshToken: refreshToken };
}

export async function signIn(body) {
  const user = await authRepository.findUserByMail(body.mail);
  if (!user) {
    throw new InvalidCredentialsError();
  } else {
    const passwordValid = await argon2.verify(
      user.password_hash,
      body.password,
    );
    if (passwordValid) {
      const tokens = await createSession(user.id);
      delete user.password_hash;
      return { user, tokens };
    } else {
      throw new InvalidCredentialsError();
    }
  }
}

export function revokeSession(refreshToken) {
  const refreshTokenHash = hashSHA256(refreshToken);
  return authRepository.revokeSession(refreshTokenHash);
}

export async function refresh(refreshToken) {
  if (!refreshToken) {
    throw new InvalidCredentialsError();
  }
  const refreshTokenHash = hashSHA256(refreshToken);
  const tokenClaims = await authRepository.findToken(refreshTokenHash);
  if (!tokenClaims) {
    throw new InvalidCredentialsError();
  }
  if (tokenClaims.expires_at > new Date() && !tokenClaims.revoked_at) {
    const [token, refreshToken] = await Promise.all([
      new SignJWT({})
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(tokenClaims.userId)
        .setExpirationTime("15m")
        .sign(accessSecret),
      new SignJWT({})
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(tokenClaims.userId)
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(refreshSecret),
    ]);

    const newTokenClaims = await decodeJwt(refreshToken);
    const newRefreshTokenHash = hashSHA256(refreshToken);

    /*
    await authRepository.updateToken(
      refreshTokenHash,
      newRefreshTokenHash,
      newTokenClaims,
    );
    */
    return {
      user: tokenClaims.users,
      token: token,
      refreshToken: refreshToken,
    };
  } else {
    throw new InvalidCredentialsError();
  }
}

export async function verifyToken(accessToken) {
  const tokenValid = await jwtVerify(accessToken, accessSecret);
  console.log(tokenValid);
  return tokenValid;
}
