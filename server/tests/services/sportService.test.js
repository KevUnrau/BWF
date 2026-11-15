import { describe, it, expect } from "vitest";
import sportRepository from "../mocks/repositories/sportRepository.js";
import betRepository from "../mocks/repositories/betRepository.js";
import { mockSession } from "../fixtures/bet.js";
import * as sportService from "../../src/services/sportService.js";

describe("getRoundsBySession", () => {
  it("selects the rounds/matchdays for a betting session which is always connected to a competition and season.", async () => {
    const sessionId = 1;
    const status = [2];

    betRepository.findSessionById.mockResolvedValue(mockSession);
    sportRepository.findRounds.mockResolvedValue();

    await sportService.getRoundsBySession({
      sessionId: sessionId,
      status: status,
    });

    expect(betRepository.findSessionById).toHaveBeenCalledWith(sessionId);
    expect(sportRepository.findRounds).toHaveBeenCalledWith({
      competitionId: mockSession.competition_id,
      seasonId: mockSession.season_id,
      status: status,
    });
  });
});

describe("getMatchesBySession", () => {
  it("selects the matches for a betting session which is always connected to a competition and season.", async () => {
    const sessionId = 1;
    const round = "9";

    betRepository.findSessionById.mockResolvedValue(mockSession);
    sportRepository.findMatches.mockResolvedValue();

    await sportService.getMatchesBySession({
      sessionId,
      round,
    });

    expect(betRepository.findSessionById).toHaveBeenCalledWith(sessionId);
    expect(sportRepository.findMatches).toHaveBeenCalledWith({
      competitionId: mockSession.competition_id,
      seasonId: mockSession.season_id,
      round,
    });
  });
});
