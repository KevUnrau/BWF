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

export const getMatchdays = async (req, res, next) => {
  try {
    const competition = Number(req.params.competitionId);
    const season = Number(req.params.seasonId);
    const matchdays = await sportRepository.findRounds({
      competitionId: competition,
      seasonId: season,
      status: [1, 2, 3],
    });
    res.send(matchdays);
  } catch (error) {
    next(error);
  }
};

export const getMatches = async (req, res, next) => {
  try {
    const competition = Number(req.params.competitionId);
    const season = Number(req.params.seasonId);
    const matchday = req.query.matchday;
    const matches = await sportRepository.findMatches({
      competition,
      season,
      round: matchday,
    });
    res.send(matches);
  } catch (error) {
    next(error);
  }
};
