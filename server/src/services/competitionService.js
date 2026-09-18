import * as competitionRepository from "../repositories/competitionRepository.js";
import * as sessionRepository from "../repositories/sessionRepository.js";

export function getCurrentRound(competitionId) {
  return competitionRepository.findCurrentRound(competitionId);
}

export async function getRoundsBySession({ sessionId, status }) {
  const { competition_id: competitionId, season_id: seasonId } =
    await sessionRepository.findSession(sessionId);
  return competitionRepository.findRounds({ competitionId, seasonId, status });
}

export async function getMatchesBySession({ sessionId, round }) {
  const { competition_id: competitionId, season_id: seasonId } =
    await sessionRepository.findSession(sessionId);
  return competitionRepository.findMatches({ competitionId, seasonId, round });
}
