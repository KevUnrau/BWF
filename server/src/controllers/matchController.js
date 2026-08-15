import * as competitionService from "../services/competitionService.js";

export const getMatches = async (req, res) => {
  const round = req.query.round;
  const competitionId = Number(req.query.competitionId);
  const seasonId = Number(req.query.seasonId);
  const matches = await competitionService.getMatches({
    competitionId,
    seasonId,
    round,
  });
  res.send(matches);
};

export const getMatchById = (req, res) => {
  const matchId = req.params.id;
  res.send("NOT IMPLEMENTED YET.");
};
