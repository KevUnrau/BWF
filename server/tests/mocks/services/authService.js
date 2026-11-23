import { vi } from "vitest";
import * as authService from "../../../src/services/authService.js";

vi.mock("../../../src/services/authService.js", () => ({
  verifyToken: vi.fn(),
  createUser: vi.fn(),
  createSession: vi.fn(),
  signIn: vi.fn(),
  revokeSession: vi.fn(),
  refresh: vi.fn(),
}));

export default authService;
