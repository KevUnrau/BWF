import * as betService from "../services/betService.js";

export const closeMatchday = async (req, res, next) => {
  try {
    const body = req.body;
    await betService.closeMatchday(body, false);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const recalculateMatchday = async (req, res, next) => {
  try {
    const body = req.body;
    await betService.closeMatchday(body, true);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
