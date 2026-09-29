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

export function findBettingSessions(groupId, db = prisma) {
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

export function createBettingSession(body, db = prisma) {
  return db.betting_sessions.create({
    data: {
      group_id: body.groupId,
      competition_id: body.competition,
      season_id: body.season,
      name: body.name,
    },
  });
}

export function deleteBettingSession(groupId, name, db = prisma) {
  return db.betting_sessions.delete({
    where: { group_id_name: { group_id: groupId, name: name } },
  });
}

export function createStandings(sessionId, groupId, users, db = prisma) {
  return db.bets_standings.createMany({
    data: users.map((user) => {
      return {
        betting_session_id: sessionId,
        group_id: groupId,
        points: 0,
        user_id: user.id,
      };
    }),
  });
}
