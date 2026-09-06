import * as groupRepository from "../repositories/groupRepository.js";

export const getInvitiationsByUser = async (req, res, next) => {
  const user = Number(req.params.userId);
  try {
    const invitations = await groupRepository.findInvitationsByUser(user);
    res.send(invitations);
  } catch (error) {
    next(error);
  }
};
