import * as groupRepository from "../repositories/groupRepository.js";
import * as groupService from "../services/groupService.js";
import { httpStatus } from "../constants/httpStatus.js";

export const getInvitiationsByUser = async (req, res, next) => {
  const userId = req.user;
  try {
    const invitations = await groupService.readInvitations(userId);
    res.send(invitations);
  } catch (error) {
    next(error);
  }
};

export const getUnreadInvitationsCount = async (req, res, next) => {
  const user = req.user;
  try {
    const unreadInvitations =
      await groupRepository.countUnreadInvitationsByUser(user);
    res.send(unreadInvitations);
  } catch (error) {
    next(error);
  }
};

export const putInvitationResponse = async (req, res, next) => {
  const body = req.body;
  if (body.status === "accepted") {
    try {
      await groupService.joinGroup(body.invitationId, body.groupId, req.user);
      res.sendStatus(httpStatus.noContent);
    } catch (error) {
      next(error);
    }
  } else {
    try {
      await groupRepository.updateInvitationStatus(
        body.invitationId,
        "declined",
      );
      res.sendStatus(httpStatus.noContent);
    } catch (error) {
      next(error);
    }
  }
};

export const postInvitation = async (req, res, next) => {
  const { invited, groupId } = req.body;
  const invitedBy = req.user;
  try {
    await groupService.createInvitation(groupId, invited, invitedBy);
    res.status(httpStatus.created).send(req.body);
  } catch (error) {
    next(error);
  }
};

export const deleteInvitation = async (req, res, next) => {
  const user = req.user;
  const invitationId = Number(req.query.id);
  try {
    await groupService.deleteInvitation(user, invitationId);
    res.sendStatus(httpStatus.noContent);
  } catch (error) {
    next(error);
  }
};
