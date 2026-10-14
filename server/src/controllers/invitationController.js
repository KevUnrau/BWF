import * as groupRepository from "../repositories/groupRepository.js";
import * as groupService from "../services/groupServices.js";

export const getInvitiationsByUser = async (req, res, next) => {
  const userId = Number(req.user);
  try {
    const invitations = await groupService.readInvitations(userId);
    res.send(invitations);
  } catch (error) {
    next(error);
  }
};

export const getUnreadInvitationsCount = async (req, res, next) => {
  const user = Number(req.user);
  try {
    const unreadInvitations =
      await groupRepository.countUnreadInvitationsByUser(user);
    res.send(unreadInvitations);
  } catch (error) {
    next(error);
  }
};

export const putInvitationsResponse = async (req, res, next) => {
  const body = req.body;
  if (body.status === "accept") {
    try {
      await groupService.joinGroup(body.invitationId, body.groupId, req.user);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  } else {
    try {
      await groupRepository.updateInvitationStatus(
        body.invitationId,
        "decline",
      );
      res.sendStatus(204);
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
    res.status(201).send(req.body);
  } catch (error) {
    next(error);
  }
};

export const deleteInvitation = async (req, res, next) => {
  const user = req.user;
  const invitationId = Number(req.query.id);
  try {
    await groupService.deleteInvitation(user, invitationId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
