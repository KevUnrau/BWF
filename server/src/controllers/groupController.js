import * as betRepository from "../repositories/betRepository.js";
import * as groupRepository from "../repositories/groupRepository.js";
import * as groupService from "../services/groupServices.js";

export const getGroupsByUser = async (req, res, next) => {
  try {
    const userId = Number(req.user);
    const groups = await groupRepository.findGroupsByUser(userId);

    res.send(groups);
  } catch (error) {
    next(error);
  }
};

export const getSessionsByGroup = async (req, res, next) => {
  try {
    const groupId = Number(req.params.groupId);
    const sessions = await betRepository.findSessions(groupId);
    res.send(sessions);
  } catch (error) {
    next(error);
  }
};

export const deleteMember = async (req, res, next) => {
  const groupId = Number(req.params.groupId);
  const memberName = req.query.member;
  try {
    await groupService.removeMember({ groupId: groupId, username: memberName });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const deleteGroup = async (req, res, next) => {
  const groupId = Number(req.query.id);
  try {
    await groupRepository.deleteGroup(groupId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const leaveGroup = async (req, res, next) => {
  const user = req.user;
  const groupId = Number(req.params.groupId);
  try {
    await groupService.removeMember({ groupId: groupId, userId: user });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const postGroup = async (req, res, next) => {
  const user = req.user;
  const { groupName } = req.body;
  try {
    const { group } = await groupService.createGroup(groupName, user);
    res.status(201).send(group);
  } catch (error) {
    next(error);
  }
};

export const getUserRole = async (req, res, next) => {
  const user = req.user;
  const group = Number(req.params.groupId);
  try {
    const { member_roles: role } = await groupRepository.findMember(
      user,
      group,
    );
    res.send(role);
  } catch (error) {
    next(error);
  }
};
