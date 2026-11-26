import { describe, it, expect, beforeEach } from "vitest";
import groupRepository from "../../mocks/repositories/groupRepository.js";
import groupService from "../../mocks/services/groupService.js";
import { mockUser } from "../../fixtures/repositories/auth.js";
import { mockInvitations } from "../../fixtures/repositories/group.js";
import {
  mockPutInvitationResponseBody,
  mockInvitationBody,
  mockDeleteInvitationQuery,
} from "../../fixtures/requests/invitation.js";
import { res, next } from "../../mocks/modules/express.js";
import { httpStatus } from "../../../src/constants/httpStatus.js";
import * as invitationController from "../../../src/controllers/invitationController.js";

let req = {};

describe("getInvitationsByUser", () => {
  beforeEach(() => {
    req = { user: mockUser.id };
  });

  it("calls the error handler because the read invitations service fails.", async () => {
    groupService.readInvitations.mockRejectedValue(new Error());

    await invitationController.getInvitiationsByUser(req, res, next);

    expect(groupService.readInvitations).toHaveBeenCalledWith(mockUser.id);

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("finds the users invitations and sends them in the response body.", async () => {
    groupService.readInvitations.mockResolvedValue(mockInvitations);

    await invitationController.getInvitiationsByUser(req, res, next);

    expect(res.send).toHaveBeenCalledWith(mockInvitations);
  });
});

describe("getUnreadInvitationsByUser", () => {
  beforeEach(() => {
    req = { user: mockUser.id };
  });

  it("calls the error handler because the count unread invitations query fails.", async () => {
    groupRepository.countUnreadInvitationsByUser.mockRejectedValue(new Error());

    await invitationController.getUnreadInvitationsCount(req, res, next);

    expect(groupRepository.countUnreadInvitationsByUser).toHaveBeenCalledWith(
      mockUser.id,
    );

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("counts the requesting users unread invitations and sends the count in the response body.", async () => {
    const mockUnreadInvitationsCount = { _count: 0 };

    groupRepository.countUnreadInvitationsByUser.mockResolvedValue(
      mockUnreadInvitationsCount,
    );

    await invitationController.getUnreadInvitationsCount(req, res, next);

    expect(res.send).toHaveBeenCalledWith(mockUnreadInvitationsCount);
  });
});

describe("putInvitationResponse", () => {
  beforeEach(() => {
    req = { user: mockUser.id };
    req.body = { ...mockPutInvitationResponseBody };
  });

  const accepctStatus = "accepted";
  const declineStatus = "declined";

  it("tries to add the user to the group but calls the error handler because the join group service failed.", async () => {
    req.body.status = accepctStatus;

    groupService.joinGroup.mockRejectedValue(new Error());

    await invitationController.putInvitationResponse(req, res, next);

    expect(groupService.joinGroup).toHaveBeenCalledWith(
      mockPutInvitationResponseBody.invitationId,
      mockPutInvitationResponseBody.groupId,
      mockUser.id,
    );

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("adds the user to the group and sends success http status code.", async () => {
    req.body.status = accepctStatus;

    groupService.joinGroup.mockResolvedValue();

    await invitationController.putInvitationResponse(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.noContent);
  });

  it("tries to decline the invitation but calls the error handler because the update invitation status query failed.", async () => {
    req.body.status = declineStatus;

    groupRepository.updateInvitationStatus.mockRejectedValue(new Error());

    await invitationController.putInvitationResponse(req, res, next);

    expect(groupRepository.updateInvitationStatus).toHaveBeenCalledWith(
      mockPutInvitationResponseBody.invitationId,
      declineStatus,
    );

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("declines the invitation and sends success http status code.", async () => {
    req.body.status = declineStatus;

    groupRepository.updateInvitationStatus.mockResolvedValue();

    await invitationController.putInvitationResponse(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.noContent);
  });
});

describe("postInvitation", () => {
  beforeEach(() => {
    req = { user: mockUser.id };
    req.body = { ...mockInvitationBody };
  });

  it("calls the error handler because the create invitation query failed.", async () => {
    groupService.createInvitation.mockRejectedValue(new Error());

    await invitationController.postInvitation(req, res, next);

    expect(groupService.createInvitation).toHaveBeenCalledWith(
      mockInvitationBody.groupId,
      mockInvitationBody.invited,
      mockUser.id,
    );

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("creates the invitation, returns a success http status code and sends the invitation in the response body.", async () => {
    groupService.createInvitation.mockResolvedValue();

    await invitationController.postInvitation(req, res, next);

    expect(res.status).toHaveBeenCalledWith(httpStatus.created);
    expect(res.send).toHaveBeenCalledWith(mockInvitationBody);
  });
});

describe("deleteInvitation", () => {
  beforeEach(() => {
    req = { user: mockUser.id };
    req.query = { ...mockDeleteInvitationQuery };
  });

  it("calls the error handler because the delete invitation service failed.", async () => {
    groupService.deleteInvitation.mockRejectedValue(new Error());

    await invitationController.deleteInvitation(req, res, next);

    expect(groupService.deleteInvitation).toHaveBeenCalledWith(
      mockUser.id,
      Number(mockDeleteInvitationQuery.id),
    );

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("deletes the invitation and sends success http status code.", async () => {
    groupService.deleteInvitation.mockResolvedValue();

    await invitationController.deleteInvitation(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.noContent);
  });
});
