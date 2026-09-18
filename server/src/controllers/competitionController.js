import * as competitionService from "../services/competitionService.js";

export const getCompetitions = (req, res) => {
  res.send("NOT IMPLEMENTED YET.");
};

export const getCurrentMatchday = async (req, res) => {
  const competitionId = Number(req.params.competitionId);
  const currentMatchday =
    await competitionService.getCurrentRound(competitionId);
  res.send(currentMatchday);
};
