import * as betRepository from "../repositories/betRepository.js";

export function getBets({ userId, sessionId, round, includeMatches }) {
  return betRepository.findBets({
    userId,
    sessionId,
    round,
    includeMatches,
  });
}

export function getStandings(bettingSessionId) {
  return betRepository.findStandings(bettingSessionId);
}

export function putBets(body) {
  return betRepository.upsertBets(body);
}

export function getBettingSessions(groupId) {
  return betRepository.findBettingSessions(groupId);
}
