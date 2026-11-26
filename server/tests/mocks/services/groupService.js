import { vi } from "vitest";
import * as groupService from "../../../src/services/groupService.js";

vi.mock("../../../src/services/groupService.js", () => ({
  kickMember: vi.fn(),
  leaveGroup: vi.fn(),
  createGroup: vi.fn(),
  readInvitations: vi.fn(),
  joinGroup: vi.fn(),
  createInvitation: vi.fn(),
  deleteInvitation: vi.fn(),
}));

export default groupService;
