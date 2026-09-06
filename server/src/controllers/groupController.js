import * as groupService from "../services/groupServices.js";
import * as betService from "../services/betService.js";
import * as groupRepository from "../repositories/groupRepository.js";

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
      await groupRepository.updateInvitation(body.invitationId, "decline");
      res.send(body);
    } catch (error) {
      next(error);
    }
  }
};
