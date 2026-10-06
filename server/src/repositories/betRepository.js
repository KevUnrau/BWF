import prisma from "../prisma/client.js";

export function findBets({
  userId,
  sessionId,
  round,
  includeMatches,
  db = prisma,
}) {
  return db.bets.findMany({
    where: {
      user_id: userId,
      betting_session_id: sessionId,
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

export function findStandings(bettingSessionId, db = prisma) {
  return db.bets_standings.findMany({
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

export function upsertBets(body, db = prisma) {
  return db.$transaction(
    body.bets.map((bet) => {
      return prisma.bets.upsert({
        where: {
          match_id_user_id_betting_session_id: {
            betting_session_id: body.session,
            user_id: body.user,
            match_id: bet.id,
          },
        },
        create: {
          match_id: bet.id,
          home_goals: bet.homeGoals,
          away_goals: bet.awayGoals,
          betting_session_id: body.session,
          user_id: body.user,
        },
        update: {
          home_goals: bet.homeGoals,
          away_goals: bet.awayGoals,
        },
      });
    }),
  );
}

export function findSessions(groupId, db = prisma) {
  return db.betting_sessions.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      group_id: groupId,
    },
  });
}

export function findSessionById(sessionId, db = prisma) {
  return db.betting_sessions.findFirst({
    select: {
      competition_id: true,
      season_id: true,
    },
    where: {
      id: sessionId,
    },
  });
}

export function findSessionByName(groupId, name, db = prisma) {
  return db.betting_sessions.findFirst({
    select: { id: true },
    where: { group_id: groupId, name: name },
  });
}

export function createSession(body, db = prisma) {
  return db.betting_sessions.create({
    data: {
      group_id: body.groupId,
      competition_id: body.competition,
      season_id: body.season,
      name: body.name,
    },
  });
}

export function deleteSession(groupId, name, db = prisma) {
  return db.betting_sessions.delete({
    where: { group_id_name: { group_id: groupId, name: name } },
  });
}

export function createStandings(sessionId, users, db = prisma) {
  return db.bets_standings.createMany({
    data: users.map((user) => {
      return {
        betting_session_id: sessionId,
        points: 0,
        user_id: user.id,
      };
    }),
  });
}

export function deleteStanding(sessionId, userId, db = prisma) {
  return db.bets_standings.delete({
    where: {
      betting_session_id_user_id: {
        betting_session_id: sessionId,
        user_id: userId,
      },
    },
  });
}

export function deleteBets(sessionId, userId, db = prisma) {
  return db.bets.deleteMany({
    where: { betting_session_id: sessionId, user_id: userId },
  });
}

export function findBetsByMatch(matchId, db = prisma) {
  return db.bets.findMany({
    select: { id: true, home_goals: true, away_goals: true },
    where: { match_id: matchId },
  });
}

export function updateBet(betId, points, db = prisma) {
  return db.bets.update({ data: { points: points }, where: { id: betId } });
}

export function calcStandings(db = prisma) {
  return db.bets.groupBy({
    by: ["betting_session_id", "user_id"],
    _sum: { points: true },
  });
}

export function updateStanding(sessionId, userId, points, db = prisma) {
  return db.bets_standings.update({
    data: { points: points, updated_at: new Date().toISOString() },
    where: {
      betting_session_id_user_id: {
        betting_session_id: sessionId,
        user_id: userId,
      },
    },
  });
}
