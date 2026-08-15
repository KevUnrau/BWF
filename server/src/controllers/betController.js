import * as betService from "../services/betService.js";

export const getBets = async (req, res) => {
  const userId = Number(req.query.userId);
  const bettingSessionId = Number(req.query.bettingSessionId);
  const round = req.query.round;
  const includeMatches = req.query.include?.includes("matches");
  const bets = await betService.getBets({
    userId,
    bettingSessionId,
    round,
    includeMatches,
  });
  res.send(bets);
};

export const getStandings = async (req, res) => {
  const bettingSessionId = Number(req.query.bettingSessionId);
  const standings = await betService.getStandings(bettingSessionId);
  res.send(standings);
};

export const getBetById = (req, res) => {
  res.send("NOT IMPLEMENTED YET.");
};

export const putBets = async (req, res) => {
  const body = req.body;
  await betService.putBets(body);
  res.send(body);
};
