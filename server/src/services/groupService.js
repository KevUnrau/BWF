import * as groupRepository from "../repositories/groupRepository.js";
import * as authRepository from "../repositories/authRepository.js";
import * as betRepository from "../repositories/betRepository.js";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../errors/AppError.js";
import prisma from "../prisma/client.js";

export async function joinGroup(invitationId, groupId, userId) {
  const memberCount = await groupRepository.countMembers(groupId);
  if (memberCount >= 25) {
    throw new ConflictError(
      "Group is full. A member must leave before you can join the group.",
    );
  }

  const invitation = await groupRepository.findInvitation(invitationId);
  if (invitation.expires_at < new Date()) {
    throw new ConflictError("Invitation already expired.");
  }

  if (invitation.invitation_status.name !== "open") {
    throw new ConflictError(
      `Invitation has already been ${invitation.invitation_status.name}.`,
    );
  }

  return prisma.$transaction(async (tx) => {
    await groupRepository.updateInvitationStatus(invitationId, "accept", tx);
    await groupRepository.createMember(groupId, userId, 2, tx);
    const bettingSessions = await betRepository.findSessions(groupId, tx);
    for (const session of bettingSessions) {
      await betRepository.createStandings(session.id, [{ id: userId }], tx);
    }
    return;
  });
}

export async function removeMember({ groupId, userId }) {
  const groups = await groupRepository.findGroupsByUser(userId);
  const isMember = groups.find((group) => {
    return group.group_id === groupId;
  });

  if (!isMember) {
    throw new NotFoundError("User is not a member of this group.");
  }

  return prisma.$transaction(async (tx) => {
    const bettingSessions = await betRepository.findSessions(groupId, tx);
    for (const session of bettingSessions) {
      await betRepository.deleteStanding(session.id, userId, tx);
      await betRepository.deleteBets(session.id, userId, tx);
    }
    await groupRepository.deleteMember(groupId, userId, tx);
    const members = await groupRepository.findMembersByGroup(groupId, tx);
    if (members.length === 0) {
      await groupRepository.deleteGroup(groupId, tx);
      return;
    }
    const adminsLeft = await groupRepository.countAdmins(groupId, tx);
    if (adminsLeft === 0) {
      const oldestMember = members.reduce((accumulator, current) => {
        if (accumulator.joined_at <= current.joined_at) {
          return accumulator;
        }
        return current;
      });
      await groupRepository.updateMemberRole(
        groupId,
        oldestMember.user_id,
        1,
        tx,
      );
    }
    return;
  });
}

export function leaveGroup({ groupId, userId }) {
  return removeMember({ groupId, userId });
}

export async function kickMember({ groupId, username, kickedBy }) {
  const user = await authRepository.findUserByName(username);

  if (!user) {
    throw new NotFoundError("User does not exist.");
  }

  if (user.id === kickedBy) {
    throw new ForbiddenError("You can't remove yourself.");
  }

  return removeMember({ groupId, userId: user.id });
}

export async function createGroup(name, userId) {
  const group = await groupRepository.findGroupByName(name);

  if (group) {
    throw new ConflictError(
      "Please choose a different name. This Group already exists.",
    );
  }

  return prisma.$transaction(async (tx) => {
    const group = await groupRepository.createGroup(name, tx);
    const member = await groupRepository.createMember(group.id, userId, 1, tx);
    return { group, member };
  });
}

export async function createInvitation(
  groupId,
  invitedUsername,
  invitedByUser,
) {
  const memberCount = await groupRepository.countMembers(groupId);
  if (memberCount >= 25) {
    throw new ConflictError(
      "Group is full. Please remove a member before inviting a new user.",
    );
  }

  const invitedUser = await authRepository.findUserByName(invitedUsername);

  if (!invitedUser) {
    throw new NotFoundError("User does not exist.");
  }

  if (invitedUser.id === invitedByUser) {
    throw new ConflictError("You can't invite yourself.");
  }

  const groups = await groupRepository.findGroupsByUser(invitedUser.id);
  const isMember = groups.find((group) => {
    return group.group_id === groupId;
  });

  if (isMember) {
    throw new ConflictError("User is already a member of this group.");
  }

  const activeInvitations = await groupRepository.findInvitationsByUser(
    invitedUser.id,
    1,
    new Date().toISOString(),
  );
  if (activeInvitations.length > 0) {
    throw new ConflictError(
      "User already has an active invitation for this group.",
    );
  }

  return groupRepository.createInvitation(
    groupId,
    invitedUser.id,
    invitedByUser,
  );
}

export async function readInvitations(userId) {
  const invitations = await groupRepository.findInvitationsByUser(userId);
  await groupRepository.updateInvitationsReadStatus(userId);
  return invitations;
}

export async function deleteInvitation(userId, invitationId) {
  const invitation = await groupRepository.findInvitation(invitationId);
  if (invitation.invited_user_id !== userId) {
    throw new ForbiddenError("You can only delete your own invitations.");
  }
  return groupRepository.deleteInvitation(invitationId);
}
