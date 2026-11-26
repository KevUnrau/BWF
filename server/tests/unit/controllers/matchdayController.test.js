import { describe, it, expect, beforeEach } from "vitest";
import betService from "../../mocks/services/betService.js";
import { res, next } from "../../mocks/modules/express.js";
import { mockCloseMatchdayBody } from "../../fixtures/requests/matchday.js";
import { httpStatus } from "../../../src/constants/httpStatus.js";
import * as matchdayController from "../../../src/controllers/matchdayController.js";

let req = {};

describe("closeMatchday", () => {
  const recalculate = false;

  beforeEach(() => {
    req = {};
    req.body = structuredClone(mockCloseMatchdayBody);
  });

  it("calls the error handler because the close matchday service fails.", async () => {
    betService.closeMatchday.mockRejectedValue(new Error());

    await matchdayController.closeMatchday(req, res, next);

    expect(betService.closeMatchday).toHaveBeenCalledWith(
      mockCloseMatchdayBody,
      recalculate,
    );

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("closes the matchday and sends success http status code.", async () => {
    betService.closeMatchday.mockResolvedValue();

    await matchdayController.closeMatchday(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.noContent);
  });
});

describe("recalculateMatchday", () => {
  const recalculate = true;

  beforeEach(() => {
    req = {};
    req.body = structuredClone(mockCloseMatchdayBody);
  });

  it("calls the error handler because the close matchday service fails.", async () => {
    betService.closeMatchday.mockRejectedValue(new Error());

    await matchdayController.recalculateMatchday(req, res, next);

    expect(betService.closeMatchday).toHaveBeenCalledWith(
      mockCloseMatchdayBody,
      recalculate,
    );

    expect(next).toHaveBeenCalledWith(new Error());
  });

  it("recalculates the bet points for matchday and sends success http status code.", async () => {
    betService.closeMatchday.mockResolvedValue();

    await matchdayController.recalculateMatchday(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.noContent);
  });
});
