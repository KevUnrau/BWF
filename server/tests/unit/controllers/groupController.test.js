import { describe, it, expect, beforeEach } from "vitest";
import betRepository from "../../mocks/repositories/betRepository.js";
import groupRepository from "../../mocks/repositories/groupRepository.js";
import groupService from "../../mocks/services/groupService.js";
import { res, next } from "../../mocks/modules/express.js";
import { mockUser } from "../../fixtures/repositories/auth.js";
import { mockCreateGroup } from "../../fixtures/services/group.js";
import {
  mockGroupMemberships,
  mockMemberRole,
} from "../../fixtures/repositories/group.js";
import { mockSessions } from "../../fixtures/repositories/bet.js";
import {
  mockGetSessionsByGroupParams,
  mockDeleteMemberQuery,
  mockDeleteMemberParams,
  mockDeleteGroupParams,
  mockLeaveGroupParams,
  mockPostGroupBody,
  mockGetUserRoleParams,
} from "../../fixtures/requests/group.js";
import { httpStatus } from "../../../src/constants/httpStatus.js";
import * as groupController from "../../../src/controllers/groupController.js";

let req = {};

describe("getGroupsByUser", () => {
  beforeEach(() => {
    req = {};
    req.user = mockUser.id;
  });

  it("calls the error handler because the find groups query failed.", async () => {
    groupRepository.findGroupsByUser.mockRejectedValue(new Error());

    await groupController.getGroupsByUser(req, res, next);

    expect(groupRepository.findGroupsByUser).toHaveBeenCalledWith(mockUser.id);

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("finds users groups and sends them in the response body.", async () => {
    groupRepository.findGroupsByUser.mockResolvedValue(mockGroupMemberships);

    await groupController.getGroupsByUser(req, res, next);

    expect(res.send).toHaveBeenCalledWith(mockGroupMemberships);
  });
});

describe("getSessionsByGroup", async () => {
  beforeEach(() => {
    req = {};
    req.params = { ...mockGetSessionsByGroupParams };
  });

  it("calls the error handler because the find sessions query failed.", async () => {
    betRepository.findSessions.mockRejectedValue(new Error());

    await groupController.getSessionsByGroup(req, res, next);

    expect(betRepository.findSessions).toHaveBeenCalledWith(
      Number(mockGetSessionsByGroupParams.groupId),
    );

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("finds groups sessions and sends them in the response body.", async () => {
    betRepository.findSessions.mockResolvedValue(mockSessions);

    await groupController.getSessionsByGroup(req, res, next);

    expect(res.send).toHaveBeenCalledWith(mockSessions);
  });
});

describe("deleteMember", () => {
  beforeEach(() => {
    req = { user: mockUser.id };
    req.params = { ...mockDeleteMemberParams };
    req.query = { ...mockDeleteMemberQuery };
  });

  it("calls the error handler because the kick member service failed.", async () => {
    groupService.kickMember.mockRejectedValue(new Error());

    await groupController.deleteMember(req, res, next);

    expect(groupService.kickMember).toHaveBeenCalledWith({
      groupId: Number(mockDeleteMemberParams.groupId),
      username: mockDeleteMemberQuery.member,
      kickedBy: mockUser.id,
    });

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("kicks member from the group and sends success http status code.", async () => {
    groupService.kickMember.mockResolvedValue();

    await groupController.deleteMember(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.noContent);
  });
});

describe("deleteGroup", () => {
  beforeEach(() => {
    req = {};
    req.params = { ...mockDeleteGroupParams };
  });

  it("calls the error handler because the delete group query failed.", async () => {
    groupRepository.deleteGroup.mockRejectedValue(new Error());

    await groupController.deleteGroup(req, res, next);

    expect(groupRepository.deleteGroup).toHaveBeenCalledWith(
      Number(mockDeleteGroupParams.groupId),
    );

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("deletes the group and sends success http status code.", async () => {
    groupRepository.deleteGroup.mockResolvedValue();

    await groupController.deleteGroup(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.noContent);
  });
});

describe("leaveGroup", () => {
  beforeEach(() => {
    req = { user: mockUser.id };
    req.params = { ...mockLeaveGroupParams };
  });

  it("calls the error handler because the leave group service failed.", async () => {
    groupService.leaveGroup.mockRejectedValue(new Error());

    await groupController.leaveGroup(req, res, next);

    expect(groupService.leaveGroup).toHaveBeenCalledWith({
      groupId: Number(mockLeaveGroupParams.groupId),
      userId: mockUser.id,
    });

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("removes the requesting user from the group and sends success http status code.", async () => {
    groupService.leaveGroup.mockResolvedValue();

    await groupController.leaveGroup(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.noContent);
  });
});

describe("postGroup", () => {
  beforeEach(() => {
    req = { user: mockUser.id };
    req.body = { ...mockPostGroupBody };
  });

  it("calls the error handler because the create group service failed.", async () => {
    groupService.createGroup.mockRejectedValue(new Error());

    await groupController.postGroup(req, res, next);

    expect(groupService.createGroup).toHaveBeenCalledWith(
      mockPostGroupBody.groupName,
      mockUser.id,
    );

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("creates a new group, returns success http status code and sends the created group in the response body.", async () => {
    groupService.createGroup.mockResolvedValue(mockCreateGroup);

    await groupController.postGroup(req, res, next);

    expect(res.status).toHaveBeenCalledWith(httpStatus.created);
    expect(res.send).toHaveBeenCalledWith(mockCreateGroup.group);
  });
});

describe("getUserRole", () => {
  beforeEach(() => {
    req = { user: mockUser.id };
    req.params = { ...mockGetUserRoleParams };
  });

  it("calls the error handler because the find member query failed.", async () => {
    groupRepository.findMember.mockRejectedValue(new Error());

    await groupController.getUserRole(req, res, next);

    expect(groupRepository.findMember).toHaveBeenCalledWith(
      mockUser.id,
      Number(mockGetUserRoleParams.groupId),
    );

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("finds the users group member role and sends it in the response body.", async () => {
    groupRepository.findMember.mockResolvedValue(mockMemberRole);

    await groupController.getUserRole(req, res, next);

    expect(res.send).toHaveBeenCalledWith(mockMemberRole.member_roles);
  });
});
