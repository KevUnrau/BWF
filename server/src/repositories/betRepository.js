import prisma from "../prisma/client.js";

export function findBets({ userId, bettingSessionId, round, includeMatches }) {
  return prisma.bets.findMany({
    where: {
      user_id: userId,
      betting_session_id: bettingSessionId,
      matches: {
        round: round,
      },
    },
    select: {
      match_id: true,
      home_goals: true,
      away_goals: true,
      points: true,
      ...(includeMatches && {
        matches: {
          select: {
            clubs_matches_home_idToclubs: { select: { name: true } },
            clubs_matches_away_idToclubs: { select: { name: true } },
            home_goals: true,
            away_goals: true,
          },
        },
      }),
    },
  });
}

export function findStandings(bettingSessionId) {
  return prisma.bets_standings.findMany({
    where: {
      betting_session_id: bettingSessionId,
    },
    select: {
      users: {
        select: {
          username: true,
        },
      },
      points: true,
      updated_at: true,
    },
  });
}

export function upsertBets(body) {
  return prisma.$transaction(
    body.bets.map((bet) => {
      return prisma.bets.upsert({
        where: {
          match_id_user_id_betting_session_id: {
            betting_session_id: body.bettingSessionId,
            user_id: body.userId,
            match_id: bet.match_id,
          },
        },
        create: {
          ...bet,
          betting_session_id: body.bettingSessionId,
          user_id: body.userId,
        },
        update: {
          home_goals: bet.home_goals,
          away_goals: bet.away_goals,
        },
      });
    }),
  );
}

export function findBettingSessions(groupId) {
  return prisma.betting_sessions.findMany({
    select: {
      id: true,
      group_id: true,
      name: true,
      competition_id: true,
      season_id: true,
    },
    where: {
      group_id: groupId,
    },
  });
}
