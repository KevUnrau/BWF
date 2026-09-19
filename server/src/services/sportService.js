import * as sportRepository from "../repositories/sportRepository.js";
import * as betRepository from "../repositories/betRepository.js";

export async function getRoundsBySession({ sessionId, status }) {
  const { competition_id: competitionId, season_id: seasonId } =
    await betRepository.findSessionById(sessionId);
  return sportRepository.findRounds({ competitionId, seasonId, status });
}

export async function getMatchesBySession({ sessionId, round }) {
  const { competition_id: competitionId, season_id: seasonId } =
    await betRepository.findSessionById(sessionId);
  return sportRepository.findMatches({ competitionId, seasonId, round });
}
