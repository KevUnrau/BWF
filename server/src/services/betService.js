import prisma from "../prisma/client.js";
import * as sportRepository from "../repositories/sportRepository.js";
import * as betRepository from "../repositories/betRepository.js";

function calcBetPoints(
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

export function closeMatchday(body, recalculate) {
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
    for (const standing of standings) {
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
        matchday: body.matchday,
        competitionId: body.competition,
        seasonId: body.season,
        db: tx,
      });
      await sportRepository.updateMatchdayStatus({
        status: 3,
        matchday: String(Number(body.matchday) + 1),
        competitionId: body.competition,
        seasonId: body.season,
        db: tx,
      });
    }
  });
}
