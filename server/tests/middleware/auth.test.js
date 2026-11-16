import { vi, describe, it, expect } from "vitest";
import authService from "../mocks/services/authService.js";
import authRepository from "../mocks/repositories/authRepository.js";
import groupRepository from "../mocks/repositories/groupRepository.js";
import { next, res } from "../mocks/modules/express.js";
import { mockGroup, mockMemberRole, mockAdminRole } from "../fixtures/group.js";
import { mockUser, mockAdminUser, mockNonAdminUser } from "../fixtures/auth.js";
import {
  InvalidCredentialsError,
  TokenExpiredError,
  ForbiddenError,
} from "../../src/errors/AppError.js";
import * as auth from "../../src/middleware/auth.js";

describe("extractGroup", () => {
  it.each([
    {
      description: "url params",
      req: { params: { groupId: String(mockGroup.id) } },
    },
    {
      description: "query params",
      req: {
        params: Object.create(null),
        query: { groupId: String(mockGroup.id) },
      },
    },
    {
      description: "body",
      req: {
        params: Object.create(null),
        query: Object.create(null),
        body: { groupId: mockGroup.id },
      },
    },
  ])("it extracts the groupId from the requests $description", ({ req }) => {
    expect(auth.extractGroup(req)).toBe(mockGroup.id);
  });
});

describe("auth", () => {
  const token = "token";

  const req = {
    headers: {
      authorization: `bearer ${token}`,
    },
  };

  it("calls error handler with an invalid credentials error because no auth header has been provided.", async () => {
    const req = { headers: {} };

    await auth.auth(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(expect.any(InvalidCredentialsError));
  });

  it("calls error handler with an invalid credentials error because the auth header has not the expected format.", async () => {
    const req = {
      headers: {
        authorization: token,
      },
    };

    await auth.auth(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(InvalidCredentialsError));
  });

  it("calls error handler with a token expired error.", async () => {
    const error = new Error();
    error.code = "ERR_JWT_EXPIRED";

    authService.verifyToken.mockRejectedValue(error);

    await auth.auth(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(TokenExpiredError));
  });

  it("authenticates the user and calls the next middleware because the provided token is valid.", async () => {
    authService.verifyToken.mockResolvedValue({
      payload: { sub: mockUser.id },
    });

    await auth.auth(req, res, next);

    expect(authService.verifyToken).toHaveBeenCalledWith(token);
    expect(next).toHaveBeenCalledWith();
  });
});

describe("adminAuth", () => {
  it("calls error handler with a forbidden error because the user in not an admin.", async () => {
    const req = { user: mockNonAdminUser.id };

    authRepository.findUserById.mockResolvedValue(mockNonAdminUser);

    await auth.adminAuth(req, res, next);

    expect(authRepository.findUserById).toHaveBeenCalledWith(
      mockNonAdminUser.id,
    );

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
  });

  it("authenticates user as an admin and calls the next middleware.", async () => {
    const req = { user: mockAdminUser.id };

    authRepository.findUserById.mockResolvedValue(mockAdminUser);

    await auth.adminAuth(req, res, next);

    expect(authRepository.findUserById).toHaveBeenCalledWith(mockAdminUser.id);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });
});

describe("groupMemberAuth", () => {
  const req = { user: mockUser.id, params: { groupId: String(mockGroup.id) } };

  it("throws a forbidden error because the user is not a member of the group.", async () => {
    groupRepository.findMember.mockResolvedValue(null);

    await auth.groupMemberAuth(req, res, next);

    expect(groupRepository.findMember).toHaveBeenCalledWith(
      mockUser.id,
      mockGroup.id,
    );

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
  });

  it("authenticates user as a group member and calls the next middleware.", async () => {
    groupRepository.findMember.mockResolvedValue(mockMemberRole);

    await auth.groupMemberAuth(req, res, next);

    expect(groupRepository.findMember).toHaveBeenCalledWith(
      mockUser.id,
      mockGroup.id,
    );

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });
});

describe("groupAdminAuth", () => {
  const req = { user: mockUser.id, params: { groupId: String(mockGroup.id) } };

  it("throws a forbidden error because the user is not a member of the group.", async () => {
    groupRepository.findMember.mockResolvedValue(null);

    await auth.groupAdminAuth(req, res, next);

    expect(groupRepository.findMember).toHaveBeenCalledWith(
      mockUser.id,
      mockGroup.id,
    );

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
  });

  it("throws a forbidden error because the user is a member but not an admin of the group.", async () => {
    groupRepository.findMember.mockResolvedValue(mockMemberRole);

    await auth.groupAdminAuth(req, res, next);

    expect(groupRepository.findMember).toHaveBeenCalledWith(
      mockUser.id,
      mockGroup.id,
    );

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
  });

  it("authenticates user as a group admin and calls the next middleware.", async () => {
    groupRepository.findMember.mockResolvedValue(mockAdminRole);

    await auth.groupAdminAuth(req, res, next);

    expect(groupRepository.findMember).toHaveBeenCalledWith(
      mockUser.id,
      mockGroup.id,
    );

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });
});
