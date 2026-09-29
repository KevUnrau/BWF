import prisma from "../prisma/client.js";

export function findGroupsByUser(userId, db = prisma) {
  return db.members.findMany({
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

export function findGroupByName(name, db = prisma) {
  return db.groups.findFirst({ select: { id: true }, where: { name: name } });
}

export function findInvitationsByUser(userId, status, expiresAt, db = prisma) {
  return db.invitations.findMany({
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
    where: {
      invited_user_id: userId,
      ...(status && { status_id: status }),
      ...(expiresAt && { expires_at: { gt: expiresAt } }),
    },
  });
}

export function createInvitation(
  groupId,
  invitedUser,
  invitedByUser,
  db = prisma,
) {
  return db.invitations.create({
    data: {
      group_id: groupId,
      invited_user_id: invitedUser,
      invited_by_user_id: invitedByUser,
      status_id: 1,
    },
  });
}

export function updateInvitation(id, status, db = prisma) {
  if (status === "accept") {
    return db.invitations.update({
      data: { status_id: 2, responded_at: new Date().toISOString() },
      where: { id: id },
    });
  } else {
    return db.invitations.update({
      data: { status_id: 3, responded_at: new Date().toISOString() },
      where: { id: id },
    });
  }
}

export function createMember(groupId, userId, db = prisma) {
  return db.members.create({
    data: { group_id: groupId, user_id: userId },
  });
}

export function deleteMember(groupId, userId, db = prisma) {
  return db.members.delete({
    where: { group_id_user_id: { group_id: groupId, user_id: userId } },
  });
}

export function deleteGroup(groupId, db = prisma) {
  return db.groups.delete({ where: { id: groupId } });
}

export function createGroup(name, db = prisma) {
  return db.groups.create({ data: { name: name } });
}

export function findMembersByGroup(groupId, db = prisma) {
  return db.members.findMany({
    select: { id: true },
    where: { group_id: groupId },
  });
}
