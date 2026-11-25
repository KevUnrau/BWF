import { describe, it, expect, beforeEach } from "vitest";
import betRepository from "../../mocks/repositories/betRepository.js";
import betService from "../../mocks/services/betService.js";
import { res, next } from "../../mocks/modules/express.js";
import { mockUser } from "../../fixtures/repositories/auth.js";
import { mockFindBetsWithMatches } from "../../fixtures/repositories/bet.js";
import { mockGetBetsQuery, mockBetBody } from "../../fixtures/requests/bet.js";
import * as betController from "../../../src/controllers/betController.js";
import { httpStatus } from "../../../src/constants/httpStatus.js";

let req = {};

describe("getBets", () => {
  beforeEach(() => {
    req = { user: mockUser.id };
    req.query = { ...mockGetBetsQuery };
  });

  it("calls the error handler because find bets query failed.", async () => {
    betRepository.findBets.mockRejectedValue(new Error());

    await betController.getBets(req, res, next);

    expect(betRepository.findBets).toHaveBeenCalledWith({
      userId: mockUser.id,
      sessionId: Number(mockGetBetsQuery.bettingSessionId),
      round: mockGetBetsQuery.round,
      includeMatches: undefined,
    });

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("finds the bets including the matches and sends them in the response body.", async () => {
    req.query.include = "matches";

    betRepository.findBets.mockResolvedValue(mockFindBetsWithMatches);

    await betController.getBets(req, res, next);

    expect(betRepository.findBets).toHaveBeenCalledWith({
      userId: mockUser.id,
      sessionId: Number(mockGetBetsQuery.bettingSessionId),
      round: mockGetBetsQuery.round,
      includeMatches: true,
    });

    expect(res.send).toHaveBeenCalledWith(mockFindBetsWithMatches);
  });
});

describe("putBets", () => {
  beforeEach(() => {
    req = { user: mockUser.id };
    req.body = structuredClone(mockBetBody);
  });

  it("calls the error handler because the service failed to upsert bets.", async () => {
    betService.putBets.mockRejectedValue(new Error());

    await betController.putBets(req, res, next);

    expect(betService.putBets).toHaveBeenCalledWith({
      ...mockBetBody,
      user: mockUser.id,
    });

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("upserts the bets, returns success http status code and sends bet in response body.", async () => {
    betService.putBets.mockResolvedValue();

    await betController.putBets(req, res, next);

    expect(res.status).toHaveBeenCalledWith(httpStatus.ok);
    expect(res.send).toHaveBeenCalledWith({
      ...mockBetBody,
      user: mockUser.id,
    });
  });
});
