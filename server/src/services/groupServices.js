import * as groupRepository from "../repositories/groupRepository.js";
import * as authRepository from "../repositories/authRepository.js";
import * as betRepository from "../repositories/betRepository.js";
import { ConflictError } from "../errors/AppError.js";
import prisma from "../prisma/client.js";

export async function joinGroup(invitationId, groupId, userId) {
  const memberCount = await groupRepository.countMembers(groupId);
  if (memberCount >= 25) {
    throw new ConflictError(
      "Group is full. A member must leave before you can join the group.",
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

export async function removeMember({ groupId, username, userId }) {
  const { id: memberId } = userId
    ? { id: userId }
    : await authRepository.findUserByName(username);
  return prisma.$transaction(async (tx) => {
    const bettingSessions = await betRepository.findSessions(groupId, tx);
    for (const session of bettingSessions) {
      await betRepository.deleteStanding(session.id, memberId, tx);
      await betRepository.deleteBets(session.id, memberId, tx);
    }
    await groupRepository.deleteMember(groupId, memberId, tx);
    const membersLeft = await groupRepository.findMembersByGroup(groupId, tx);
    if (membersLeft.length === 0) {
      await groupRepository.deleteGroup(groupId, tx);
      return;
    }
    const adminsLeft = await groupRepository.countAdmins(groupId, tx);
    if (adminsLeft === 0) {
      const members = await groupRepository.findMembersByGroup(groupId, tx);
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

export function createGroup(name, userId) {
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
