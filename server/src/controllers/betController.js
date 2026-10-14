import * as betRepository from "../repositories/betRepository.js";
import * as betService from "../services/betService.js";

export const getBets = async (req, res, next) => {
  try {
    const userId = req.user;
    const sessionId = Number(req.query.bettingSessionId);
    const round = req.query.round;
    const includeMatches = req.query.include?.includes("matches");
    const bets = await betRepository.findBets({
      userId,
      sessionId,
      round,
      includeMatches,
    });
    res.send(bets);
  } catch (error) {
    next(error);
  }
};

export const putBets = async (req, res, next) => {
  try {
    const user = req.user;
    const body = { ...req.body, user };
    await betService.putBets(body);
    res.status(200).send(body);
  } catch (error) {
    next(error);
  }
};
