import { vi } from "vitest";
import * as betRepository from "../../../src/repositories/betRepository.js";

vi.mock("../../../src/repositories/betRepository.js", () => ({
  findBetsByMatch: vi.fn(),
  calcStandings: vi.fn(),
  updateStanding: vi.fn(),
  updateBet: vi.fn(),
  createSession: vi.fn(),
  createStandings: vi.fn(),
  findSessionById: vi.fn(),
  upsertBets: vi.fn(),
  findSessions: vi.fn(),
  deleteStanding: vi.fn(),
  deleteBets: vi.fn(),
}));

export default betRepository;
