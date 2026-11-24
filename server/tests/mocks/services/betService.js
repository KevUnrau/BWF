import { vi } from "vitest";
import * as betService from "../../../src/services/betService.js";

vi.mock("../../../src/services/betService.js", () => ({
  putBets: vi.fn(),
}));

export default betService;
