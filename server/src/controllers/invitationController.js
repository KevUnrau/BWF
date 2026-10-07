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
    res.status(200).send(unreadInvitations);
  } catch (error) {
    next(error);
  }
};

export const putInvitationsResponse = async (req, res, next) => {
  const body = req.body;
  if (body.status === "accept") {
    try {
      await groupService.joinGroup(
        body.invitationId,
        body.groupId,
        body.userId,
      );
      res.status(201).send({
        message: "Member created.",
      });
    } catch (error) {
      next(error);
    }
  } else {
    try {
      await groupRepository.updateInvitationStatus(
        body.invitationId,
        "decline",
      );
      res.status(200).send({
        message: "OK",
      });
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
    res.send({ message: "OK" });
  } catch (error) {
    next(error);
  }
};
