import * as sportService from "../services/sportService.js";
import * as betRepository from "../repositories/betRepository.js";

export const getMatchdays = async (req, res, next) => {
  const sessionId = Number(req.params.id);
  let status;
  if (req.query.status === "open") {
    status = [1, 3];
  } else {
    status = [2];
  }
  try {
    const matchdays = await sportService.getRoundsBySession({
      sessionId,
      status,
    });
    res.send(matchdays);
  } catch (error) {
    next(error);
  }
};

export const getMatches = async (req, res, next) => {
  const sessionId = Number(req.params.id);
  const round = req.query.round;
  try {
    const matches = await sportService.getMatchesBySession({
      sessionId,
      round,
    });
    res.send(matches);
  } catch (error) {
    next(error);
  }
};

export const getBets = async (req, res, next) => {
  const sessionId = Number(req.params.id);
  const round = req.query.round;
  const userId = req.user;
  const includeMatches = false;
  try {
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

export const getStandings = async (req, res) => {
  const bettingSessionId = Number(req.params.id);
  const standings = await betRepository.findStandings(bettingSessionId);
  res.send(standings);
};
