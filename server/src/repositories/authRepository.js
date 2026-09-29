import prisma from "../prisma/client.js";

export function createUser(body, db = prisma) {
  return db.users.create({
    data: {
      username: body.username,
      password_hash: body.password_hash,
      mail: body.mail,
    },
    select: {
      id: true,
      username: true,
      mail: true,
      role_id: true,
    },
  });
}

export function createSession(userId, refreshTokenHash, claims, db = prisma) {
  return db.sessions.create({
    data: {
      user_id: userId,
      refresh_token_hash: refreshTokenHash,
      created_at: new Date(claims.iat * 1000),
      expires_at: new Date(claims.exp * 1000),
    },
  });
}

export function findUserByMail(mail, db = prisma) {
  return db.users.findFirst({
    select: {
      id: true,
      username: true,
      password_hash: true,
      mail: true,
      role_id: true,
    },
    where: {
      mail: mail,
    },
  });
}

export function findUserByName(username, db = prisma) {
  return db.users.findFirst({
    select: {
      id: true,
      username: true,
      password_hash: true,
      mail: true,
      role_id: true,
    },
    where: {
      username: username,
    },
  });
}

export function revokeSession(refreshTokenHash, db = prisma) {
  return db.sessions.update({
    where: {
      refresh_token_hash: refreshTokenHash,
    },
    data: {
      revoked_at: new Date().toISOString(),
    },
  });
}

export function findToken(refreshTokenHash, db = prisma) {
  return db.sessions.findFirst({
    select: {
      expires_at: true,
      revoked_at: true,
      users: {
        select: {
          id: true,
          mail: true,
          username: true,
          role_id: true,
        },
      },
    },
    where: {
      refresh_token_hash: refreshTokenHash,
    },
  });
}

export function updateToken(
  oldRefreshTokenHash,
  newRefreshTokenHash,
  claims,
  db = prisma,
) {
  return db.sessions.update({
    where: { refresh_token_hash: oldRefreshTokenHash },
    data: {
      refresh_token_hash: newRefreshTokenHash,
      created_at: new Date(claims.iat * 1000),
      expires_at: new Date(claims.exp * 1000),
    },
  });
}
