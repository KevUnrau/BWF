import { vi, describe, it, expect, beforeEach } from "vitest";
//important to import mock modules before the service, else the service uses the original modules
import prisma, { tx } from "../mocks/modules/prisma.js";
import groupRepository from "../mocks/repositories/groupRepository.js";
import betRepository from "../mocks/repositories/betRepository.js";
import sportRepository from "../mocks/repositories/sportRepository.js";
import { mockGroup, mockMembers } from "../fixtures/repositories/group.js";
import { mockMatches } from "../fixtures/repositories/sport.js";
import {
  mockCalcStandings,
  mockBets,
  mockSession,
} from "../fixtures/repositories/bet.js";
import * as betService from "../../src/services/betService.js";

describe("calcBetPoints", () => {
  it("returns 3 for an exact prediction", () => {
    const prediction = { homeGoals: 3, awayGoals: 1 };
    const result = { homeGoals: 3, awayGoals: 1 };

    expect(
      betService.calcBetPoints(
        result.homeGoals,
        result.awayGoals,
        prediction.homeGoals,
        prediction.awayGoals,
      ),
    ).toBe(3);
  });

  it("returns 1 for predicting the correct match result but not the exact score", () => {
    const prediction_draw = { homeGoals: 1, awayGoals: 1 };
    const result_draw = { homeGoals: 4, awayGoals: 4 };

    const prediction_home_win = { homeGoals: 2, awayGoals: 1 };
    const result_home_win = { homeGoals: 3, awayGoals: 1 };

    const prediction_home_lose = { homeGoals: 2, awayGoals: 3 };
    const result_home_lose = { homeGoals: 2, awayGoals: 5 };

    expect(
      betService.calcBetPoints(
        result_draw.homeGoals,
        result_draw.awayGoals,
        prediction_draw.homeGoals,
        prediction_draw.awayGoals,
      ),
    ).toBe(1);
    expect(
      betService.calcBetPoints(
        result_home_win.homeGoals,
        result_home_win.awayGoals,
        prediction_home_win.homeGoals,
        prediction_home_win.awayGoals,
      ),
    ).toBe(1);
    expect(
      betService.calcBetPoints(
        result_home_lose.homeGoals,
        result_home_lose.awayGoals,
        prediction_home_lose.homeGoals,
        prediction_home_lose.awayGoals,
      ),
    ).toBe(1);
  });

  it("returns 0 for not predicting the correct match result", () => {
    const prediction_home_win = { homeGoals: 3, awayGoals: 1 };
    const result_draw = { homeGoals: 1, awayGoals: 1 };
    const result_away_win = { homeGoals: 1, awayGoals: 3 };

    expect(
      betService.calcBetPoints(
        result_draw.homeGoals,
        result_draw.awayGoals,
        prediction_home_win.homeGoals,
        prediction_home_win.awayGoals,
      ),
    ).toBe(0);

    expect(
      betService.calcBetPoints(
        result_away_win.homeGoals,
        result_away_win.awayGoals,
        prediction_home_win.homeGoals,
        prediction_home_win.awayGoals,
      ),
    ).toBe(0);
  });
});

describe("closeMatchday", () => {
  const body = {
    competition: 1,
    season: 1,
    matchday: {
      match_status: { name: "in progress" },
      round: "1",
      status_id: 3,
    },
    matches: [
      { id: 1, homeGoals: 1, awayGoals: 2 },
      { id: 2, homeGoals: 3, awayGoals: 3 },
    ],
  };

  const recalculate = false;

  beforeEach(() => {
    betRepository.findBetsByMatch.mockResolvedValue(mockBets);
    betRepository.calcStandings.mockResolvedValue(mockCalcStandings);
  });

  it("throws a not found error because the matchday does not exist.", async () => {
    sportRepository.findMatchdayStatus.mockResolvedValue(null);

    await expect(betService.closeMatchday(body, recalculate)).rejects.toThrow(
      "Matchday not found.",
    );

    expect(sportRepository.findMatchdayStatus).toHaveBeenCalledWith(
      body.competition,
      body.season,
      body.matchday.round,
    );
  });

  it("throws a conflict error because the matchday is not in progress.", async () => {
    sportRepository.findMatchdayStatus.mockResolvedValue({
      match_status: { name: "closed" },
    });

    await expect(betService.closeMatchday(body, recalculate)).rejects.toThrow(
      "You can't close a matchday that is not in progress.",
    );
  });

  it("it throws a conflict error because the matchday is not closed.", async () => {
    const recalculate = true;

    sportRepository.findMatchdayStatus.mockResolvedValue({
      match_status: { name: "in progress" },
    });

    await expect(betService.closeMatchday(body, recalculate)).rejects.toThrow(
      "You can't recalculate a matchday that is not closed.",
    );
  });

  it("closes a matchday", async () => {
    sportRepository.findMatchdayStatus.mockResolvedValue({
      match_status: { name: "in progress" },
    });

    await betService.closeMatchday(body, recalculate);

    expect(sportRepository.findMatchdayStatus).toHaveBeenCalledWith(
      body.competition,
      body.season,
      body.matchday.round,
    );

    expect(sportRepository.updateMatch).toHaveBeenCalledTimes(2);
    expect(sportRepository.updateMatch).toHaveBeenCalledWith({
      matchId: body.matches[0].id,
      homeGoals: body.matches[0].homeGoals,
      awayGoals: body.matches[0].awayGoals,
      db: tx,
    });

    expect(betRepository.findBetsByMatch).toHaveBeenCalledTimes(2);
    expect(betRepository.findBetsByMatch).toHaveBeenCalledWith(
      body.matches[0].id,
      tx,
    );

    expect(betRepository.updateBet).toHaveBeenCalledTimes(4);
    expect(betRepository.updateBet).toHaveBeenCalledWith(mockBets[0].id, 1, tx);

    expect(betRepository.calcStandings).toHaveBeenCalledTimes(1);

    expect(betRepository.updateStanding).toHaveBeenCalledTimes(2);
    expect(betRepository.updateStanding).toHaveBeenCalledWith(
      mockCalcStandings[0].betting_session_id,
      mockCalcStandings[0].user_id,
      mockCalcStandings[0]._sum.points,
      tx,
    );

    //checks if null value for points has been transformed to 0
    expect(betRepository.updateStanding).toHaveBeenCalledWith(
      mockCalcStandings[1].betting_session_id,
      mockCalcStandings[1].user_id,
      0,
      tx,
    );

    expect(sportRepository.updateMatchdayStatus).toHaveBeenCalledWith({
      status: 2,
      matchday: "1",
      competitionId: 1,
      seasonId: 1,
      db: tx,
    });

    expect(sportRepository.updateMatchdayStatus).toHaveBeenCalledWith({
      status: 3,
      matchday: "2",
      competitionId: 1,
      seasonId: 1,
      db: tx,
    });
  });

  it("recalculates an already closed matchday", async () => {
    const recalculate = true;

    sportRepository.findMatchdayStatus.mockResolvedValue({
      match_status: { name: "closed" },
    });

    await betService.closeMatchday(body, recalculate);

    expect(sportRepository.updateMatchdayStatus).not.toHaveBeenCalled();
  });
});

describe("createSession", () => {
  const body = {
    groupId: 1,
    competition: 1,
    season: 1,
    name: "testSession",
  };

  it("throws a conflict error because the session name is already in use.", async () => {
    betRepository.findSessionByName.mockResolvedValue({ id: 1 });

    await expect(betService.createSession(body)).rejects.toThrow(
      "Session name already in use. Please choose a different one.",
    );

    expect(betRepository.findSessionByName).toHaveBeenCalledWith(
      body.groupId,
      body.name,
    );
  });

  it("creates a betting session", async () => {
    const mockSession = {
      id: 10,
      group_id: body.groupId,
      competition_id: body.competition,
      season_id: body.season,
      name: body.name,
    };

    betRepository.findSessionByName.mockResolvedValue(null);

    betRepository.createSession.mockResolvedValue(mockSession);

    groupRepository.findMembersByGroup.mockResolvedValue(mockMembers);

    await betService.createSession(body);

    expect(betRepository.createSession).toHaveBeenCalledWith(body, tx);

    expect(groupRepository.findMembersByGroup).toHaveBeenCalledWith(
      body.groupId,
      tx,
    );

    expect(betRepository.createStandings).toHaveBeenCalledWith(
      mockSession.id,
      [{ id: mockMembers[0].user_id }, { id: mockMembers[1].user_id }],
      tx,
    );
  });
});

describe("deleteSession", () => {
  const sessionName = "session";

  it("throws a not found error because the session does not exist.", async () => {
    betRepository.findSessionByName.mockResolvedValue(null);

    await expect(
      betService.deleteSession(mockGroup.id, sessionName),
    ).rejects.toThrow("Session does not exist.");

    expect(betRepository.findSessionByName).toHaveBeenCalledWith(
      mockGroup.id,
      sessionName,
    );
  });

  it("deletes a session.", async () => {
    betRepository.findSessionByName.mockResolvedValue({ id: 1 });
    betRepository.deleteSession(mockGroup.id, sessionName);

    betService.deleteSession(mockGroup.id, sessionName);

    expect(betRepository.deleteSession).toHaveBeenCalledWith(
      mockGroup.id,
      sessionName,
    );
  });
});

describe("putBets", async () => {
  const body = {
    groupId: 2,
    session: 1,
    round: "10",
    user: 1,
    bets: [
      { id: 91, homeGoals: 1, awayGoals: 2 },
      { id: 92, homeGoals: 2, awayGoals: 1 },
      { id: 93, homeGoals: 2, awayGoals: 1 },
      { id: 94, homeGoals: 2, awayGoals: 0 },
      { id: 95, homeGoals: 3, awayGoals: 1 },
      { id: 96, homeGoals: 2, awayGoals: 1 },
      { id: 97, homeGoals: 2, awayGoals: 2 },
      { id: 98, homeGoals: 3, awayGoals: 1 },
      { id: 99, homeGoals: 1, awayGoals: 1 },
    ],
  };

  beforeEach(() => {
    betRepository.findSessionById.mockResolvedValue(mockSession);

    sportRepository.findMatchdayStatus.mockResolvedValue({
      match_status: { name: "in progress" },
    });
  });

  sportRepository.findMatches.mockResolvedValue(mockMatches);

  it("throws a conflict error because the matchday is closed.", async () => {
    sportRepository.findMatchdayStatus.mockResolvedValue({
      match_status: { name: "closed" },
    });

    await expect(betService.putBets(body)).rejects.toThrow(
      "Matchday is already closed.",
    );
  });

  it("throws a conflict error because the matchday has already started.", async () => {
    vi.setSystemTime(new Date("2026-11-20T19:31:00Z"));

    await expect(betService.putBets(body)).rejects.toThrow(
      "Matchday has already started.",
    );
  });

  it("upserts a users bet.", async () => {
    vi.setSystemTime(new Date("2026-11-20T19:30:00Z"));

    betRepository.upsertBets.mockResolvedValue();

    await betService.putBets(body);

    expect(betRepository.upsertBets).toHaveBeenCalledOnce();
  });
});
