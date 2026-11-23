import { describe, it, expect, beforeEach } from "vitest";
import {
  mockCreateUserBody,
  mockSignInBody,
} from "../../fixtures/requests/auth.js";
import { mockUser } from "../../fixtures/repositories/auth.js";
import { mockTokens } from "../../fixtures/services/auth.js";
import { httpStatus } from "../../../src/constants/httpStatus.js";
import {
  ConflictError,
  InvalidCredentialsError,
} from "../../../src/errors/AppError.js";
import authService from "../../mocks/services/authService.js";
import { res, next } from "../../mocks/modules/express.js";
import * as authController from "../../../src/controllers/authController.js";

const req = {};

describe("signUp", () => {
  beforeEach(() => {
    req.body = { ...mockCreateUserBody };
    authService.createUser.mockResolvedValue(mockUser);
  });

  it("calls the error handler because the user creation failed due to already existing mail.", async () => {
    authService.createUser.mockRejectedValue(
      new ConflictError("This mail is already in use."),
    );

    await authController.signUp(req, res, next);

    expect(authService.createUser).toHaveBeenCalledWith(mockCreateUserBody);
    expect(next).toHaveBeenCalledWith(
      new ConflictError("This mail is already in use."),
    );
  });

  it("creates a user, fails to create a session and sends http success status and response body.", async () => {
    authService.createSession.mockRejectedValue(new Error());

    await authController.signUp(req, res, next);

    expect(authService.createSession).toHaveBeenCalledWith(mockUser.id);

    expect(res.status).toHaveBeenCalledWith(httpStatus.created);
    expect(res.send).toHaveBeenCalledWith({
      message: "User created. Please log in.",
    });
  });

  it("creates a user, creates a session, sets refresh token cookie and sends http success status and response body containing the access token.", async () => {
    authService.createSession.mockResolvedValue(mockTokens);

    await authController.signUp(req, res, next);

    expect(res.cookie).toHaveBeenCalledWith(
      "refreshToken",
      mockTokens.refreshToken,
      authController.cookieProps,
    );
    expect(res.status).toHaveBeenCalledWith(httpStatus.created);
    expect(res.send).toHaveBeenCalledWith({
      message: "User created.",
      token: mockTokens.token,
      user: mockUser,
      refreshToken: mockTokens.refreshToken,
    });
  });
});

describe("signIn", () => {
  beforeEach(() => {
    req.body = { ...mockSignInBody };
  });

  it("calls the error handler because of invalid credentials.", async () => {
    authService.signIn.mockRejectedValue(new InvalidCredentialsError());

    await authController.signIn(req, res, next);

    expect(authService.signIn).toHaveBeenCalledWith(mockSignInBody);

    expect(next).toHaveBeenCalledWith(new InvalidCredentialsError());
  });

  it("logs in the user, sets refresh token cookie and sends http success status and response body containing the access token.", async () => {
    authService.signIn.mockResolvedValue({
      user: mockUser,
      tokens: mockTokens,
    });

    await authController.signIn(req, res, next);

    expect(res.cookie).toHaveBeenCalledWith(
      "refreshToken",
      mockTokens.refreshToken,
      authController.cookieProps,
    );
    expect(res.status).toHaveBeenCalledWith(httpStatus.ok);
    expect(res.send).toHaveBeenCalledWith({
      message: "Login successful.",
      token: mockTokens.token,
      user: mockUser,
      refreshToken: mockTokens.refreshToken,
    });
  });
});

describe("signOut", () => {
  it("revokes the users session, clears refresh token cookie and returns success code.", async () => {
    req.cookies = { refreshToken: "refreshToken" };

    authService.revokeSession.mockResolvedValue();

    await authController.signOut(req, res, next);

    expect(authService.revokeSession).toHaveBeenCalledWith(
      req.cookies.refreshToken,
    );
    expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", {
      httpOnly: authController.cookieProps.httpOnly,
      secure: authController.cookieProps.secure,
      sameSite: authController.cookieProps.sameSite,
      path: authController.cookieProps.path,
    });
    expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.noContent);
  });
});

describe("refresh", () => {
  beforeEach(() => {
    req.cookies = { refreshToken: "refreshToken" };
  });

  it("calls the error handler because the service failed to refresh the access token.", async () => {
    authService.refresh.mockRejectedValue(new Error());

    await authController.refresh(req, res, next);

    expect(authService.refresh).toHaveBeenCalledWith(req.cookies.refreshToken);
    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("refreshes the access token, sends http success status and response body containing the new access token.", async () => {
    const user = {
      id: mockUser.id,
      username: mockUser.username,
      mail: mockUser.mail,
      role_id: mockUser.role_id,
    };
    const newToken = "newToken";

    authService.refresh.mockResolvedValue({ user, token: newToken });

    await authController.refresh(req, res, next);

    expect(res.status).toHaveBeenCalledWith(httpStatus.ok);
    expect(res.json).toHaveBeenCalledWith({
      message: "refresh successful",
      token: newToken,
      user,
    });
  });
});
