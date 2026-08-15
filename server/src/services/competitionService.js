import * as competitionRepository from "../repositories/competitionRepository.js";

export function getCurrentRound(competitionId) {
  return competitionRepository.findCurrentRound(competitionId);
}

export function getRounds({ competitionId, seasonId }) {
  return competitionRepository.findRounds({ competitionId, seasonId });
}

export function getMatches({ competitionId, seasonId, round }) {
  return competitionRepository.findMatches({ competitionId, seasonId, round });
}
