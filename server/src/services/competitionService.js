import * as competitionRepository from "../repositories/competitionRepository.js";

export function getCurrentRound(competitionId) {
  return competitionRepository.findCurrentRound(competitionId);
}

export function getRounds({ competitionId, seasonId, status }) {
  return competitionRepository.findRounds({ competitionId, seasonId, status });
}

export function getMatches({ competitionId, seasonId, round }) {
  return competitionRepository.findMatches({ competitionId, seasonId, round });
}
