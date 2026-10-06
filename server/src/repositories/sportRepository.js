import prisma from "../prisma/client.js";

export function findCurrentRound(competitionId, db = prisma) {
  return db.matches.findFirst({
    where: {
      competition_id: competitionId,
      status_id: 3,
    },
    select: {
      round: true,
    },
  });
}

export function findRounds({ competitionId, seasonId, status, db = prisma }) {
  return db.matches.findMany({
    where: {
      AND: [{ competition_id: competitionId }, { season_id: seasonId }],
      OR: status.map((status) => {
        return { status_id: status };
      }),
    },
    distinct: ["round"],
    select: {
      round: true,
      status_id: true,
      match_status: {
        select: {
          name: true,
        },
      },
    },
  });
}

export function findMatches({ competitionId, seasonId, round, db = prisma }) {
  return db.matches.findMany({
    where: {
      competition_id: competitionId,
      season_id: seasonId,
      round,
    },
    select: {
      id: true,
      clubs_matches_home_idToclubs: {
        select: {
          name: true,
        },
      },
      clubs_matches_away_idToclubs: {
        select: {
          name: true,
        },
      },
      kickoff_at: true,
      home_goals: true,
      away_goals: true,
    },
  });
}

export function updateMatch({ matchId, homeGoals, awayGoals, db = prisma }) {
  return db.matches.update({
    data: { home_goals: homeGoals, away_goals: awayGoals },
    where: { id: matchId },
  });
}

export function updateMatchdayStatus({
  status,
  matchday,
  competitionId,
  seasonId,
  db = prisma,
}) {
  return db.matches.updateMany({
    data: { status_id: status },
    where: {
      competition_id: competitionId,
      round: matchday,
      season_id: seasonId,
    },
  });
}

export function findCompetitions(db = prisma) {
  return db.competitions.findMany({
    select: { id: true, name: true },
  });
}

export function findSeasonsByCompetition(competitionId, db = prisma) {
  return db.seasons.findMany({
    select: { id: true, name: true },
    where: { competition_id: competitionId },
  });
}
