import prisma from "../prisma/client.js";
import * as sportRepository from "../repositories/sportRepository.js";
import * as betRepository from "../repositories/betRepository.js";
import * as groupRepository from "../repositories/groupRepository.js";
import { ConflictError, NotFoundError } from "../errors/AppError.js";

export function calcBetPoints(
  matchHomeGoals,
  matchAwayGoals,
  betHomeGoals,
  betAwayGoals,
) {
  if (matchHomeGoals === betHomeGoals && matchAwayGoals === betAwayGoals) {
    return 3;
  }
  if (
    (matchHomeGoals > matchAwayGoals && betHomeGoals > betAwayGoals) ||
    (matchHomeGoals < matchAwayGoals && betHomeGoals < betAwayGoals) ||
    (matchHomeGoals === matchAwayGoals && betHomeGoals === betAwayGoals)
  ) {
    return 1;
  }
  return 0;
}

export async function closeMatchday(body, recalculate) {
  const status = await sportRepository.findMatchdayStatus(
    body.competition,
    body.season,
    body.matchday.round,
  );

  if (!status) {
    throw new NotFoundError("Matchday not found.");
  }

  if (!recalculate && status.match_status.name !== "in progress") {
    throw new ConflictError(
      "You can't close a matchday that is not in progress.",
    );
  }

  if (recalculate && status.match_status.name !== "closed") {
    throw new Error("You can't recalculate a matchday that is not closed.");
  }

  return prisma.$transaction(async (tx) => {
    for (const match of body.matches) {
      await sportRepository.updateMatch({
        matchId: match.id,
        homeGoals: match.homeGoals,
        awayGoals: match.awayGoals,
        db: tx,
      });
      const bets = await betRepository.findBetsByMatch(match.id, tx);
      for (const bet of bets) {
        const points = calcBetPoints(
          match.homeGoals,
          match.awayGoals,
          bet.home_goals,
          bet.away_goals,
        );
        await betRepository.updateBet(bet.id, points, tx);
      }
    }
    const standings = await betRepository.calcStandings(tx);

    // When calculating standings, users who only have bets for the
    // open matchdays may have a null sum because no points
    // have been awarded yet. Default to 0.
    const cleanedStandings = standings.map((standing) => ({
      ...standing,
      _sum: { points: standing._sum.points ?? 0 },
    }));

    for (const standing of cleanedStandings) {
      await betRepository.updateStanding(
        standing.betting_session_id,
        standing.user_id,
        standing._sum.points,
        tx,
      );
    }
    if (!recalculate) {
      await sportRepository.updateMatchdayStatus({
        status: 2,
        matchday: body.matchday.round,
        competitionId: body.competition,
        seasonId: body.season,
        db: tx,
      });
      await sportRepository.updateMatchdayStatus({
        status: 3,
        matchday: String(Number(body.matchday.round) + 1),
        competitionId: body.competition,
        seasonId: body.season,
        db: tx,
      });
    }
  });
}

export async function createSession(body) {
  const session = await betRepository.findSessionByName(
    body.groupId,
    body.name,
  );

  if (session) {
    throw new ConflictError(
      "Session name already in use. Please choose a different one.",
    );
  }

  return prisma.$transaction(async (tx) => {
    const session = await betRepository.createSession(body, tx);
    const members = await groupRepository.findMembersByGroup(body.groupId, tx);
    const users = members.map((member) => {
      return { id: member.user_id };
    });
    await betRepository.createStandings(session.id, users, tx);
  });
}

export async function deleteSession(groupId, sessionName) {
  const session = await betRepository.findSessionByName(groupId, sessionName);

  if (!session) {
    throw new NotFoundError("Session does not exist.");
  }

  return betRepository.deleteSession(groupId, sessionName);
}

export async function putBets(body) {
  const session = body.session;
  const { competition_id: competitionId, season_id: seasonId } =
    await betRepository.findSessionById(session);

  const { match_status: matchdayStatus } =
    await sportRepository.findMatchdayStatus(
      competitionId,
      seasonId,
      body.round,
    );

  if (matchdayStatus.name === "closed") {
    throw new ConflictError("Matchday is already closed.");
  }

  const matches = await sportRepository.findMatches({
    competitionId,
    seasonId,
    round: body.round,
  });

  const { kickoff_at: minKickOff } = matches.reduce((accumulator, current) => {
    if (accumulator.kickoff_at < current.kickoff_at) {
      return accumulator;
    }
    return current;
  });

  if (minKickOff < new Date()) {
    throw new ConflictError("Matchday has already started.");
  }

  return betRepository.upsertBets(body);
}
