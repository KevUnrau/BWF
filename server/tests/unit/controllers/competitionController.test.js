import { describe, it, expect, beforeEach } from "vitest";
import sportRepository from "../../mocks/repositories/sportRepository.js";
import { res, next } from "../../mocks/modules/express.js";
import {
  mockCompetitions,
  mockSeasons,
  mockFindRounds,
  mockMatches,
} from "../../fixtures/repositories/sport.js";
import {
  mockGetSeasonsParams,
  mockGetMatchdaysParams,
  mockGetMatchesParams,
  mockGetMatchesQuery,
} from "../../fixtures/requests/competition.js";
import * as competitionController from "../../../src/controllers/competitionController.js";

const req = {};

describe("getCompetitions", () => {
  it("calls the error handler because the find competitions query failed.", async () => {
    sportRepository.findCompetitions.mockRejectedValue(new Error());

    await competitionController.getCompetitions(req, res, next);

    expect(sportRepository.findCompetitions).toHaveBeenCalledWith();
    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("finds all available competitions and sends them in the response body.", async () => {
    sportRepository.findCompetitions.mockResolvedValue(mockCompetitions);

    await competitionController.getCompetitions(req, res, next);

    expect(res.send).toHaveBeenCalledWith(mockCompetitions);
  });
});

describe("getSeasons", () => {
  beforeEach(() => {
    req.params = { ...mockGetSeasonsParams };
  });

  it("calls the error handler because the find seasons query failed.", async () => {
    sportRepository.findSeasonsByCompetition.mockRejectedValue(new Error());

    await competitionController.getSeasons(req, res, next);

    expect(sportRepository.findSeasonsByCompetition).toHaveBeenCalledWith(
      Number(mockGetSeasonsParams.id),
    );
    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("finds all the competitions seasons and sends them in the response body.", async () => {
    sportRepository.findSeasonsByCompetition.mockResolvedValue(mockSeasons);

    await competitionController.getSeasons(req, res, next);

    expect(res.send).toHaveBeenCalledWith(mockSeasons);
  });
});

describe("getMatchdays", () => {
  beforeEach(() => {
    req.params = { ...mockGetMatchdaysParams };
  });

  it("calls the error handler because the find rounds query failed.", async () => {
    sportRepository.findRounds.mockRejectedValue(new Error());

    await competitionController.getMatchdays(req, res, next);

    expect(sportRepository.findRounds).toHaveBeenCalledWith({
      competitionId: Number(mockGetMatchdaysParams.competitionId),
      seasonId: Number(mockGetMatchdaysParams.seasonId),
      status: [1, 2, 3],
    });

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("finds all the rounds belonging to a competition/season and sends them in the response body.", async () => {
    sportRepository.findRounds.mockResolvedValue(mockFindRounds);

    await competitionController.getMatchdays(req, res, next);

    expect(res.send).toHaveBeenCalledWith(mockFindRounds);
  });
});

describe("getMatches", () => {
  beforeEach(() => {
    req.params = { ...mockGetMatchesParams };
    req.query = { ...mockGetMatchesQuery };
  });

  it("calls the error handler because the find matches query failed.", async () => {
    sportRepository.findMatches.mockRejectedValue(new Error());

    await competitionController.getMatches(req, res, next);

    expect(sportRepository.findMatches).toHaveBeenCalledWith({
      competition: Number(mockGetMatchesParams.competitionId),
      season: Number(mockGetMatchesParams.seasonId),
      round: mockGetMatchesQuery.matchday,
    });

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("finds all the matches belonging to a competition/season/matchday and sends them in the response body.", async () => {
    sportRepository.findMatches.mockResolvedValue(mockMatches);

    await competitionController.getMatches(req, res, next);

    expect(res.send).toHaveBeenCalledWith(mockMatches);
  });
});
