import { vi } from "vitest";
import * as sportRepository from "../../../src/repositories/sportRepository.js";

vi.mock("../../../src/repositories/sportRepository.js", () => ({
  updateMatch: vi.fn(),
  updateMatchdayStatus: vi.fn(),
  findMatches: vi.fn(),
  findMatchdayStatus: vi.fn(),
  findRounds: vi.fn(),
}));

export default sportRepository;
