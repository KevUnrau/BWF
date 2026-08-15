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
