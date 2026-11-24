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
  { betting_session_id: 1, user_id: 2, _sum: { points: null } },
];

export const mockBets = [
  { id: 1, home_goals: 2, away_goals: 3 },
  { id: 2, home_goals: 3, away_goals: 4 },
];

export const mockFindBets = [
  { match_id: 100, home_goals: 0, away_goals: 1, points: null },
  { match_id: 101, home_goals: 1, away_goals: 2, points: null },
  { match_id: 102, home_goals: 2, away_goals: 1, points: null },
  { match_id: 103, home_goals: 1, away_goals: 1, points: null },
  { match_id: 104, home_goals: 3, away_goals: 1, points: null },
  { match_id: 105, home_goals: 1, away_goals: 2, points: null },
  { match_id: 106, home_goals: 5, away_goals: 0, points: null },
  { match_id: 107, home_goals: 3, away_goals: 1, points: null },
  { match_id: 108, home_goals: 2, away_goals: 1, points: null },
];

export const mockFindBetsWithMatches = [
  {
    match_id: 97,
    home_goals: 2,
    away_goals: 2,
    points: 1,
    matches: {
      clubs_matches_home_idToclubs: {
        name: "FC Schalke 04",
        logo_filename: "/images/clubs/germany_schalke-04.football-logos.cc.svg",
      },
      clubs_matches_away_idToclubs: {
        name: "VfB Stuttgart",
        logo_filename:
          "/images/clubs/germany_vfb-stuttgart.football-logos.cc.svg",
      },
      home_goals: 0,
      away_goals: 0,
    },
  },
  {
    match_id: 91,
    home_goals: 1,
    away_goals: 2,
    points: 0,
    matches: {
      clubs_matches_home_idToclubs: {
        name: "Bayern Munich",
        logo_filename:
          "/images/clubs/germany_bayern-munchen.football-logos.cc.svg",
      },
      clubs_matches_away_idToclubs: {
        name: "1.FC Köln",
        logo_filename: "/images/clubs/germany_koln.football-logos.cc.svg",
      },
      home_goals: 1,
      away_goals: 1,
    },
  },
  {
    match_id: 92,
    home_goals: 2,
    away_goals: 1,
    points: 1,
    matches: {
      clubs_matches_home_idToclubs: {
        name: "Bayer 04 Leverkusen",
        logo_filename:
          "/images/clubs/germany_bayer-leverkusen.football-logos.cc.svg",
      },
      clubs_matches_away_idToclubs: {
        name: "SC Paderborn 07",
        logo_filename: "/images/clubs/germany_paderborn.football-logos.cc.svg",
      },
      home_goals: 4,
      away_goals: 0,
    },
  },
  {
    match_id: 93,
    home_goals: 2,
    away_goals: 1,
    points: 1,
    matches: {
      clubs_matches_home_idToclubs: {
        name: "Eintracht Frankfurt",
        logo_filename:
          "/images/clubs/germany_eintracht-frankfurt.football-logos.cc.svg",
      },
      clubs_matches_away_idToclubs: {
        name: "TSG 1899 Hoffenheim",
        logo_filename: "/images/clubs/germany_hoffenheim.football-logos.cc.svg",
      },
      home_goals: 1,
      away_goals: 0,
    },
  },
  {
    match_id: 94,
    home_goals: 2,
    away_goals: 0,
    points: 0,
    matches: {
      clubs_matches_home_idToclubs: {
        name: "1.FC Union Berlin",
        logo_filename:
          "/images/clubs/germany_union-berlin.football-logos.cc.svg",
      },
      clubs_matches_away_idToclubs: {
        name: "RB Leipzig",
        logo_filename: "/images/clubs/germany_rb-leipzig.football-logos.cc.svg",
      },
      home_goals: 1,
      away_goals: 5,
    },
  },
  {
    match_id: 95,
    home_goals: 3,
    away_goals: 1,
    points: 0,
    matches: {
      clubs_matches_home_idToclubs: {
        name: "Borussia Mönchengladbach",
        logo_filename:
          "/images/clubs/germany_borussia-monchengladbach.football-logos.cc.svg",
      },
      clubs_matches_away_idToclubs: {
        name: "Borussia Dortmund",
        logo_filename:
          "/images/clubs/germany_borussia-dortmund.football-logos.cc.svg",
      },
      home_goals: 0,
      away_goals: 1,
    },
  },
  {
    match_id: 96,
    home_goals: 2,
    away_goals: 1,
    points: 0,
    matches: {
      clubs_matches_home_idToclubs: {
        name: "SV 07 Eleversberg",
        logo_filename:
          "/images/clubs/germany_sv-elversberg.football-logos.cc.svg",
      },
      clubs_matches_away_idToclubs: {
        name: "SC Freiburg",
        logo_filename: "/images/clubs/germany_freiburg.football-logos.cc.svg",
      },
      home_goals: 0,
      away_goals: 1,
    },
  },
  {
    match_id: 98,
    home_goals: 3,
    away_goals: 1,
    points: 3,
    matches: {
      clubs_matches_home_idToclubs: {
        name: "FC Augsburg",
        logo_filename: "/images/clubs/germany_augsburg.football-logos.cc.svg",
      },
      clubs_matches_away_idToclubs: {
        name: "1.FSV Mainz 05",
        logo_filename: "/images/clubs/germany_mainz-05.football-logos.cc.svg",
      },
      home_goals: 3,
      away_goals: 1,
    },
  },
  {
    match_id: 99,
    home_goals: 1,
    away_goals: 1,
    points: 0,
    matches: {
      clubs_matches_home_idToclubs: {
        name: "SV Werder Bremen",
        logo_filename:
          "/images/clubs/germany_werder-bremen.football-logos.cc.svg",
      },
      clubs_matches_away_idToclubs: {
        name: "Hamburger SV",
        logo_filename:
          "/images/clubs/germany_hamburger-sv.football-logos.cc.svg",
      },
      home_goals: 4,
      away_goals: 0,
    },
  },
];
