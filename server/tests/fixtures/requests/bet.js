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

export const mockGetBetsQuery = {
  bettingSessionId: "7",
  round: "9",
  groupId: "1",
};
