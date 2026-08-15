import * as competitionService from "../services/competitionService.js";

export const getCompetitions = (req, res) => {
  res.send("NOT IMPLEMENTED YET.");
};

export const getMatchdays = async (req, res) => {
  const status = req.query.status;
  const competitionId = Number(req.params.competitionId);
  const seasonId = Number(req.params.seasonId);
  const matchdays = await competitionService.getRounds({
    competitionId,
    seasonId,
  });
  res.send(matchdays);
};

export const getCurrentMatchday = async (req, res) => {
  const competitionId = Number(req.params.competitionId);
  const currentMatchday =
    await competitionService.getCurrentRound(competitionId);
  res.send(currentMatchday);
};
