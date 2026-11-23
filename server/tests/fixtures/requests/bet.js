export const mockBetBody = {
  groupId: 2,
  session: 1,
  round: "11",
  bets: [
    { id: 100, homeGoals: 0, awayGoals: 1 },
    { id: 101, homeGoals: 1, awayGoals: 2 },
    { id: 102, homeGoals: 2, awayGoals: 1 },
    { id: 103, homeGoals: 1, awayGoals: 1 },
    { id: 104, homeGoals: 3, awayGoals: 1 },
    { id: 105, homeGoals: 1, awayGoals: 2 },
    { id: 106, homeGoals: 5, awayGoals: 0 },
    { id: 107, homeGoals: 3, awayGoals: 1 },
    { id: 108, homeGoals: 2, awayGoals: 1 },
  ],
};

export const mockCloseMatchdayBody = {
  competition: 2,
  season: 1,
  matchday: { round: "1", status_id: 2, match_status: { name: "in progress" } },
  matches: [
    { id: 345, homeGoals: 1, awayGoals: 2 },
    { id: 346, homeGoals: 1, awayGoals: 2 },
    { id: 347, homeGoals: 1, awayGoals: 2 },
    { id: 348, homeGoals: 1, awayGoals: 2 },
    { id: 349, homeGoals: 1, awayGoals: 2 },
    { id: 350, homeGoals: 1, awayGoals: 2 },
    { id: 351, homeGoals: 1, awayGoals: 2 },
    { id: 352, homeGoals: 1, awayGoals: 2 },
    { id: 353, homeGoals: 1, awayGoals: 2 },
  ],
};
