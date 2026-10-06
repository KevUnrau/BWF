import * as betService from "../services/betService.js";

export const closeMatchday = async (req, res, next) => {
  try {
    const body = req.body;
    await betService.closeMatchday(body, false);
    res.send({ message: "OK" });
  } catch (error) {
    next(error);
  }
};

export const recalculateMatchday = async (req, res, next) => {
  try {
    const body = req.body;
    await betService.closeMatchday(body, true);
    res.send({ message: "OK" });
  } catch (error) {
    next(error);
  }
};
