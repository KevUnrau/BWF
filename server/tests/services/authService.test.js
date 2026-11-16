import { vi, describe, it, expect, beforeEach } from "vitest";
import authRepository from "../mocks/repositories/authRepository.js";
import argon2 from "../mocks/modules/argon2.js";
import { mockUser } from "../fixtures/auth.js";
import * as authService from "../../src/services/authService.js";

describe("hashSHA256", () => {
  it("returns a SHA-256-hash.", () => {
    const token = "test-token";
    expect(authService.hashSHA256(token)).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe("createUser", () => {
  it("creates a new user.", async () => {
    const user = {
      mail: mockUser.mail,
      name: mockUser.username,
      password: "password",
    };

    const passwordHash = "password-hash";

    argon2.hash.mockResolvedValue(passwordHash);
    authRepository.createUser.mockResolvedValue();

    await authService.createUser(user);

    expect(argon2.hash).toHaveBeenCalledWith(user.password);
    expect(authRepository.createUser).toHaveBeenCalledWith({
      username: user.name,
      mail: user.mail,
      password_hash: passwordHash,
    });
  });
});

describe("createSession", () => {
  it("creates a new user session.", async () => {
    authRepository.createSession.mockResolvedValue();

    await expect(authService.createSession(mockUser.id)).resolves.toStrictEqual(
      { token: expect.any(String), refreshToken: expect.any(String) },
    );

    expect(authRepository.createSession).toHaveBeenCalledWith(
      mockUser.id,
      expect.any(String),
      expect.objectContaining({
        sub: expect.any(Number),
        iat: expect.any(Number),
        exp: expect.any(Number),
      }),
    );
  });
});

describe("signIn", () => {
  const user = { mail: mockUser.mail, password: "password" };

  beforeEach(() => {
    authRepository.findUserByMail.mockResolvedValue(mockUser);
  });

  it("throws an invalid credentials error because the entered mail could not be found in database.", async () => {
    authRepository.findUserByMail.mockResolvedValue(null);
    await expect(authService.signIn(user)).rejects.toThrow(
      "Invalid credentials.",
    );
  });

  it("throws an invalid credentials error because the entered password is not correct.", async () => {
    argon2.verify.mockResolvedValue(false);

    await expect(authService.signIn(user)).rejects.toThrow(
      "Invalid credentials.",
    );

    expect(argon2.verify).toHaveBeenCalledWith(
      mockUser.password_hash,
      user.password,
    );
  });

  it("logs in a user and creates the corresponding session.", async () => {
    argon2.verify.mockResolvedValue(true);

    await expect(authService.signIn(user)).resolves.toStrictEqual({
      user: {
        id: mockUser.id,
        username: mockUser.username,
        mail: mockUser.mail,
        role_id: mockUser.role_id,
      },
      tokens: { token: expect.any(String), refreshToken: expect.any(String) },
    });
  });
});

describe("revokeSession", () => {
  it("revokes a users session.", async () => {
    const refreshToken = "refreshToken";
    authRepository.revokeSession.mockResolvedValue();

    await authService.revokeSession(refreshToken);

    expect(authRepository.revokeSession).toHaveBeenCalledWith(
      expect.any(String),
    );
  });
});

describe("refresh", () => {
  vi.setSystemTime(new Date("2026-11-12T19:30:00Z"));

  const refreshToken = "refreshToken";

  it("throws an invalid credentials error because no refresh token was provided.", async () => {
    await expect(authService.refresh()).rejects.toThrow("Invalid credentials.");
  });

  it("throws an invalid credentials error because the provided refresh token was not found in the database.", async () => {
    authRepository.findToken.mockResolvedValue(null);

    await expect(authService.refresh(refreshToken)).rejects.toThrow(
      "Invalid credentials.",
    );
  });

  it("throws an invalid credentials error because the provided refresh token has expired.", async () => {
    const expiredToken = {
      expires_at: new Date("2026-11-12T19:29:00Z"),
      revoked_at: null,
      users: {
        username: mockUser.username,
        id: mockUser.id,
        mail: mockUser.mail,
        role_id: mockUser.role_id,
      },
    };

    authRepository.findToken.mockResolvedValue(expiredToken);

    await expect(authService.refresh(refreshToken)).rejects.toThrow(
      "Invalid credentials.",
    );
  });

  it("throws an invalid credentials error because the provided refresh token has been revoked.", async () => {
    const revokedToken = {
      expires_at: new Date("2026-11-12T19:31:00Z"),
      revoked_at: new Date("2026-11-12T19:00:00Z"),
      users: {
        username: mockUser.username,
        id: mockUser.id,
        mail: mockUser.mail,
        role_id: mockUser.role_id,
      },
    };

    authRepository.findToken.mockResolvedValue(revokedToken);

    await expect(authService.refresh(refreshToken)).rejects.toThrow(
      "Invalid credentials.",
    );
  });

  it("refreshes the users access token because the provided refresh token is still valid.", async () => {
    const validToken = {
      expires_at: new Date("2026-11-12T19:31:00Z"),
      revoked_at: null,
      users: {
        username: mockUser.username,
        id: mockUser.id,
        mail: mockUser.mail,
        role_id: mockUser.role_id,
      },
    };

    authRepository.findToken.mockResolvedValue(validToken);

    await expect(authService.refresh(refreshToken)).resolves.toStrictEqual({
      user: validToken.users,
      token: expect.any(String),
    });

    expect(authRepository.findToken).toHaveBeenCalledWith(expect.any(String));
  });
});

describe("verifyToken", () => {
  it("verifies a valid access token.", async () => {
    const { token } = await authService.createSession(mockUser.id);
    const result = await authService.verifyToken(token);

    expect(result.payload.sub).toBe(mockUser.id);
  });

  it("rejects an invalid access token.", async () => {
    const invalidToken = "token";

    await expect(authService.verifyToken(invalidToken)).rejects.toThrow();
  });
});
