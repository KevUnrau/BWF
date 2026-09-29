import * as sportRepository from "../repositories/sportRepository.js";

export const getCompetitions = async (req, res, next) => {
  try {
    const competitions = await sportRepository.findCompetitions();
    res.send(competitions);
  } catch (error) {
    next(error);
  }
};

export const getSeasons = async (req, res, next) => {
  try {
    const competitionId = Number(req.params.id);
    const seasons =
      await sportRepository.findSeasonsByCompetition(competitionId);
    res.send(seasons);
  } catch (error) {
    next(error);
  }
};
