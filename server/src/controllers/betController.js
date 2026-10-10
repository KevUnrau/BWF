import * as betRepository from "../repositories/betRepository.js";
import * as betService from "../services/betService.js";

export const getBets = async (req, res) => {
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
};

export const putBets = async (req, res) => {
  const user = req.user;
  const body = { ...req.body, user };
  await betService.putBets(body);
  res.send(body);
};
