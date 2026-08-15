import prisma from "../prisma/client.js";

export function findCurrentRound(competitionId) {
  return prisma.matches.findFirst({
    where: {
      competition_id: competitionId,
      status_id: 3,
    },
    select: {
      round: true,
    },
  });
}

export function findRounds({ competitionId, seasonId }) {
  return prisma.matches.findMany({
    where: { competition_id: competitionId, season_id: seasonId },
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

export function findMatches({ competitionId, seasonId, round }) {
  return prisma.matches.findMany({
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
    },
  });
}
