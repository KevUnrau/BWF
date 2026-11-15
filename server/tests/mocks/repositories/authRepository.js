import { vi } from "vitest";
import * as authRepository from "../../../src/repositories/authRepository.js";

vi.mock("../../../src/repositories/authRepository.js", () => ({
  findUserByName: vi.fn(),
  createUser: vi.fn(),
  createSession: vi.fn(),
  findUserByMail: vi.fn(),
  findUserById: vi.fn(),
  revokeSession: vi.fn(),
  findToken: vi.fn(),
}));

export default authRepository;
