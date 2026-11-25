import { vi } from "vitest";
import * as groupService from "../../../src/services/groupService.js";

vi.mock("../../../src/services/groupService.js", () => ({
  kickMember: vi.fn(),
  leaveGroup: vi.fn(),
  createGroup: vi.fn(),
}));

export default groupService;
