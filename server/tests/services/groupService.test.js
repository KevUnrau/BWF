import { vi, describe, it, expect, beforeEach } from "vitest";
import prisma, { tx } from "../mocks/repositories/prisma.js";
import groupRepository from "../mocks/repositories/groupRepository.js";
import betRepository from "../mocks/repositories/betRepository.js";
import authRepository from "../mocks/repositories/authRepository.js";
import { mockSessions } from "../fixtures/bet.js";
import {
  mockMembers,
  mockGroup,
  groupRoles,
  mockInvitations,
} from "../fixtures/group.js";
import { mockUser } from "../fixtures/auth.js";
import * as groupService from "../../src/services/groupService.js";

describe("joinGroup", () => {
  vi.setSystemTime(new Date("2026-11-20T19:30:00Z"));

  const invitationId = 3;
  const groupId = 5;
  const userId = 42;

  beforeEach(() => {
    groupRepository.countMembers.mockResolvedValue(24);
  });

  it("throws a conflict error because the group is already full at 25 members.", async () => {
    groupRepository.countMembers.mockResolvedValue(25);
    await expect(
      groupService.joinGroup(invitationId, groupId, userId),
    ).rejects.toThrow(
      "Group is full. A member must leave before you can join the group.",
    );
  });

  it("throws a conflict error because the invitation has already expired.", async () => {
    groupRepository.findInvitation.mockResolvedValue({
      invited_user_id: userId,
      invitation_status: { name: "open" },
      expires_at: new Date("2026-11-20T19:29:00Z"),
    });
    await expect(
      groupService.joinGroup(invitationId, groupId, userId),
    ).rejects.toThrow("Invitation already expired.");
  });

  it("throws a conflict error because the invitation has already been accepted.", async () => {
    groupRepository.findInvitation.mockResolvedValue({
      invited_user_id: userId,
      invitation_status: { name: "accepted" },
      expires_at: new Date("2026-11-20T19:31:00Z"),
    });

    await expect(
      groupService.joinGroup(invitationId, groupId, userId),
    ).rejects.toThrow("Invitation has already been accepted.");
  });

  it("adds a user to a group.", async () => {
    groupRepository.findInvitation.mockResolvedValue({
      invited_user_id: userId,
      invitation_status: { name: "open" },
      expires_at: new Date("2026-11-20T19:31:00Z"),
    });

    groupRepository.updateInvitationStatus.mockResolvedValue();

    groupRepository.createMember.mockResolvedValue();

    betRepository.findSessions.mockResolvedValue(mockSessions);

    betRepository.createStandings.mockResolvedValue();

    await groupService.joinGroup(invitationId, groupId, userId);

    expect(groupRepository.updateInvitationStatus).toHaveBeenCalledWith(
      invitationId,
      "accept",
      tx,
    );

    expect(groupRepository.createMember).toHaveBeenCalledWith(
      groupId,
      userId,
      groupRoles.member,
      tx,
    );

    expect(betRepository.findSessions).toHaveBeenCalledWith(groupId, tx);

    expect(betRepository.createStandings).toHaveBeenCalledTimes(2);
    expect(betRepository.createStandings).toHaveBeenCalledWith(
      mockSessions[0].id,
      [{ id: userId }],
      tx,
    );
  });
});

describe("removeMember", () => {
  const groupId = 13;

  beforeEach(() => {
    betRepository.findSessions.mockResolvedValue(mockSessions);
    authRepository.findUserByName.mockResolvedValue(mockUser);
    betRepository.deleteStanding.mockResolvedValue();
    betRepository.deleteBets.mockResolvedValue();
    groupRepository.deleteMember.mockResolvedValue();
    groupRepository.findMembersByGroup.mockResolvedValue(mockMembers);
    groupRepository.countAdmins.mockResolvedValue(1);
  });

  it("removes a member using their username.", async () => {
    await groupService.removeMember({
      groupId: groupId,
      username: mockUser.username,
    });

    expect(authRepository.findUserByName).toHaveBeenCalledWith(
      mockUser.username,
    );

    expect(betRepository.findSessions).toHaveBeenCalledWith(groupId, tx);

    expect(betRepository.deleteStanding).toHaveBeenCalledTimes(
      mockSessions.length,
    );
    expect(betRepository.deleteStanding).toHaveBeenCalledWith(
      mockSessions[1].id,
      mockUser.id,
      tx,
    );

    expect(betRepository.deleteBets).toHaveBeenCalledTimes(mockSessions.length);
    expect(betRepository.deleteBets).toHaveBeenCalledWith(
      mockSessions[1].id,
      mockUser.id,
      tx,
    );

    expect(groupRepository.deleteMember).toHaveBeenCalledWith(
      groupId,
      mockUser.id,
      tx,
    );

    expect(groupRepository.findMembersByGroup).toHaveBeenCalledWith(
      groupId,
      tx,
    );

    expect(groupRepository.deleteGroup).not.toHaveBeenCalled();

    expect(groupRepository.countAdmins).toHaveBeenCalledWith(groupId, tx);

    expect(groupRepository.updateMemberRole).not.toHaveBeenCalled();
  });

  it("removes a member using their user id.", async () => {
    await groupService.removeMember({
      groupId: groupId,
      userId: mockUser.id,
    });

    expect(authRepository.findUserByName).not.toHaveBeenCalled();
    expect(groupRepository.deleteMember).toHaveBeenCalledWith(
      groupId,
      mockUser.id,
      tx,
    );
  });

  it("removes the last member which results in group deletion.", async () => {
    groupRepository.deleteGroup.mockResolvedValue();
    groupRepository.findMembersByGroup.mockResolvedValue([]);

    await groupService.removeMember({
      groupId: groupId,
      userId: mockUser.id,
    });

    expect(groupRepository.deleteGroup).toHaveBeenCalledWith(groupId, tx);
  });

  it("removes the last admin and assings the admin role to the oldest group member.", async () => {
    groupRepository.countAdmins.mockResolvedValue(0);

    await groupService.removeMember({
      groupId: groupId,
      userId: mockUser.id,
    });

    expect(groupRepository.updateMemberRole).toHaveBeenCalledWith(
      groupId,
      mockMembers[1].user_id,
      groupRoles.admin,
      tx,
    );
  });
});

describe("createGroup", () => {
  it("creates a group and adds the group creator as admin to the group.", async () => {
    groupRepository.createGroup.mockResolvedValue(mockGroup);

    const mockMember = {
      id: 13,
      group_id: mockGroup.id,
      user_id: mockUser.id,
      role_id: groupRoles.admin,
      joined_at: new Date(),
    };
    groupRepository.createMember.mockResolvedValue(mockMember);

    await expect(
      groupService.createGroup(mockGroup.name, mockUser.id),
    ).resolves.toStrictEqual({ group: mockGroup, member: mockMember });

    expect(groupRepository.createGroup).toHaveBeenCalledWith(
      mockGroup.name,
      tx,
    );
    expect(groupRepository.createMember).toHaveBeenCalledWith(
      mockGroup.id,
      mockUser.id,
      groupRoles.admin,
      tx,
    );
  });
});

describe("createInvitation", () => {
  const invitedByUserId = 14;
  it("throws a conflict error because the group is already full at 25 members.", async () => {
    groupRepository.countMembers.mockResolvedValue(25);
    await expect(
      groupService.createInvitation(
        mockGroup.id,
        mockUser.username,
        invitedByUserId,
      ),
    ).rejects.toThrow(
      "Group is full. Please remove a member before inviting a new user.",
    );
  });

  it("creates a group invitation.", async () => {
    groupRepository.countMembers.mockResolvedValue(24);
    authRepository.findUserByName.mockResolvedValue(mockUser);
    groupRepository.createInvitation.mockResolvedValue();
    await groupService.createInvitation(
      mockGroup.id,
      mockUser.username,
      invitedByUserId,
    );
    expect(groupRepository.createInvitation).toHaveBeenCalledWith(
      mockGroup.id,
      mockUser.id,
      invitedByUserId,
    );
  });
});

describe("readInvitations", () => {
  it("selects users invitations and updates read status to read.", async () => {
    groupRepository.findInvitationsByUser.mockResolvedValue(mockInvitations);
    groupRepository.updateInvitationsReadStatus.mockResolvedValue();

    await expect(
      groupService.readInvitations(mockUser.id),
    ).resolves.toStrictEqual(mockInvitations);

    expect(groupRepository.findInvitationsByUser).toHaveBeenCalledWith(
      mockUser.id,
    );
    expect(groupRepository.updateInvitationsReadStatus).toHaveBeenCalledWith(
      mockUser.id,
    );
  });
});

describe("deleteInvitation", () => {
  const invitationId = 13;
  const mockInvitation = {
    invited_user_id: 1,
    invitation_status: { name: "declined" },
    expires_at: new Date("2026-11-20T19:31:00Z"),
  };

  beforeEach(() => {
    groupRepository.findInvitation.mockResolvedValue(mockInvitation);
  });

  it("throws a forbidden error because a user tried to delete another users invitation.", async () => {
    const userId = 2;
    await expect(
      groupService.deleteInvitation(userId, invitationId),
    ).rejects.toThrow("You can only delete your own invitations.");
  });

  it("deletes an invitation.", async () => {
    const userId = 1;
    groupRepository.deleteInvitation.mockResolvedValue();

    await groupService.deleteInvitation(userId, invitationId);

    expect(groupRepository.findInvitation).toHaveBeenCalledWith(invitationId);

    expect(groupRepository.deleteInvitation).toHaveBeenCalledWith(invitationId);
  });
});
