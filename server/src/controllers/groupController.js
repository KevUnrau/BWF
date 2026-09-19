import * as betRepository from "../repositories/betRepository.js";
import * as groupRepository from "../repositories/groupRepository.js";

export const getGroupsByUser = async (req, res) => {
  const userId = Number(req.user);
  const groups = await groupRepository.findGroupsByUser(userId);

  res.send(groups);
};

export const getSessionsByGroup = async (req, res) => {
  const groupId = Number(req.params.groupId);
  const sessions = await betRepository.findBettingSessions(groupId);
  res.send(sessions);
};
