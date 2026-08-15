import * as groupService from "../services/groupServices.js";
import * as betService from "../services/betService.js";

export const getGroupsByUser = async (req, res) => {
  const userId = Number(req.query.userId);
  const groups = await groupService.getGroupsByUser(userId);

  res.send(groups);
};

export const getSessions = async (req, res) => {
  const groupId = Number(req.params.groupId);
  const sessions = await betService.getBettingSessions(groupId);
  res.send(sessions);
};
