export const mockSessions = [
  {
    id: 1,
    name: "session_1",
    competitions: {
      name: "Bundesliga",
      logo_filename:
        "/images/competitions/germany_bundesliga.football-logos.cc.svg",
    },
  },
  {
    id: 2,
    name: "session_2",
    competitions: {
      name: "Bundesliga",
      logo_filename:
        "/images/competitions/germany_bundesliga.football-logos.cc.svg",
    },
  },
];

export const mockSession = {
  competition_id: 1,
  season_id: 3,
};

export const mockCalcStandings = [
  { betting_session_id: 1, user_id: 1, _sum: { points: 4 } },
  { betting_session_id: 1, user_id: 2, _sum: { points: 8 } },
];

export const mockBets = [
  { id: 1, home_goals: 2, away_goals: 3 },
  { id: 2, home_goals: 3, away_goals: 4 },
];
