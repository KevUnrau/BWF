import * as groupRepository from "../repositories/groupRepository.js";
import { ConflictError } from "../errors/AppError.js";

export function getGroupsByUser(userId) {
  return groupRepository.findGroupsByUser(userId);
}

export async function joinGroup(invitationId, groupId, userId) {
  await groupRepository.updateInvitation(invitationId, "accept");
  const userGroups = await groupRepository.findGroupsByUser(userId);
  if (
    userGroups.find((group) => {
      return group.group_id === groupId;
    })
  ) {
    throw new ConflictError("member");
  }
  await groupRepository.createMember(groupId, userId);
  return;
}
