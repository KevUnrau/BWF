import * as betService from "../services/betService.js";
import { httpStatus } from "../constants/httpStatus.js";

export const closeMatchday = async (req, res, next) => {
  try {
    const body = req.body;
    await betService.closeMatchday(body, false);
    res.sendStatus(httpStatus.noContent);
  } catch (error) {
    next(error);
  }
};

export const recalculateMatchday = async (req, res, next) => {
  try {
    const body = req.body;
    await betService.closeMatchday(body, true);
    res.sendStatus(httpStatus.noContent);
  } catch (error) {
    next(error);
  }
};
