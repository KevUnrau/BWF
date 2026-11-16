import { vi } from "vitest";
import * as argon2 from "argon2";

vi.mock("argon2", () => ({
  hash: vi.fn(),
  verify: vi.fn(),
}));

export default argon2;
