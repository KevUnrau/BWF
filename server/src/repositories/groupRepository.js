import prisma from "../prisma/client.js";

export function findGroupsByUser(userId) {
  return prisma.members.findMany({
    select: {
      group_id: true,
      groups: {
        select: {
          name: true,
        },
      },
      role_id: true,
      member_roles: {
        select: {
          name: true,
        },
      },
    },
    where: {
      user_id: userId,
    },
  });
}

export function findInvitationsByUser(userId) {
  return prisma.invitations.findMany({
    select: {
      id: true,
      group_id: true,
      groups: { select: { name: true } },
      invited_user_id: true,
      invited_by_user_id: true,
      users_invitations_invited_by_user_idTousers: {
        select: { username: true },
      },
      invitation_status: { select: { name: true } },
      created_at: true,
      expires_at: true,
      responded_at: true,
    },
    where: { invited_user_id: userId },
  });
}

export function updateInvitation(id, status) {
  if (status === "accept") {
    return prisma.invitations.update({
      data: { status_id: 2, responded_at: new Date().toISOString() },
      where: { id: id },
    });
  } else {
    return prisma.invitations.update({
      data: { status_id: 3, responded_at: new Date().toISOString() },
      where: { id: id },
    });
  }
}

export function createMember(groupId, userId) {
  return prisma.members.create({
    data: { group_id: groupId, user_id: userId },
  });
}
