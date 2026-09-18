import * as competitionService from "../services/competitionService.js";
import * as betService from "../services/betService.js";

export const getMatchdays = async (req, res, next) => {
  const sessionId = Number(req.params.id);
  let status;
  if (req.query.status === "open") {
    status = [1, 3];
  } else {
    status = [2];
  }
  try {
    const matchdays = await competitionService.getRoundsBySession({
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
    const matches = await competitionService.getMatchesBySession({
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
    const bets = await betService.getBets({
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
