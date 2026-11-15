import { vi } from "vitest";
import * as authService from "../../../src/services/authService.js";

vi.mock("../../../src/services/authService.js", () => ({
  verifyToken: vi.fn(),
}));

export default authService;
