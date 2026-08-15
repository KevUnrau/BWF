import * as groupRepository from "../repositories/groupRepository.js";

export function getGroupsByUser(userId) {
  return groupRepository.findGroupsByUser(userId);
}
