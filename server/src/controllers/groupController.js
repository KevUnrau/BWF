import * as betRepository from "../repositories/betRepository.js";
import * as groupRepository from "../repositories/groupRepository.js";
import * as groupService from "../services/groupServices.js";

export const getGroupsByUser = async (req, res) => {
  const userId = Number(req.user);
  const groups = await groupRepository.findGroupsByUser(userId);

  res.send(groups);
};

export const getSessionsByGroup = async (req, res) => {
  const groupId = Number(req.params.groupId);
  const sessions = await betRepository.findSessions(groupId);
  res.send(sessions);
};

export const deleteMember = async (req, res, next) => {
  const groupId = Number(req.params.groupId);
  const memberName = req.query.member;
  try {
    await groupService.removeMember(groupId, memberName);
    res.send({ message: "OK" });
  } catch (error) {
    next(error);
  }
};

export const deleteGroup = async (req, res, next) => {
  const groupId = Number(req.query.id);
  try {
    await groupRepository.deleteGroup(groupId);
    res.send({ message: "OK" });
  } catch (error) {
    next(error);
  }
};

export const leaveGroup = async (req, res, next) => {
  const user = req.user;
  const groupId = Number(req.params.groupId);
  try {
    await groupService.removeMember({ groupId: groupId, userId: user });
    res.send({ message: "OK" });
  } catch (error) {
    next(error);
  }
};

export const postGroup = async (req, res, next) => {
  const user = req.user;
  const { groupName } = req.body;
  try {
    const { group } = await groupService.createGroup(groupName, user);
    res.send(group);
  } catch (error) {
    next(error);
  }
};
