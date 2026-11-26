import { vi } from "vitest";
import * as groupRepository from "../../../src/repositories/groupRepository.js";

vi.mock("../../../src/repositories/groupRepository.js", () => ({
  findMembersByGroup: vi.fn(),
  countMembers: vi.fn(),
  findInvitation: vi.fn(),
  updateInvitationStatus: vi.fn(),
  createMember: vi.fn(),
  deleteMember: vi.fn(),
  countAdmins: vi.fn(),
  updateMemberRole: vi.fn(),
  deleteGroup: vi.fn(),
  createGroup: vi.fn(),
  createInvitation: vi.fn(),
  findInvitationsByUser: vi.fn(),
  updateInvitationsReadStatus: vi.fn(),
  deleteInvitation: vi.fn(),
  findMember: vi.fn(),
  findGroupsByUser: vi.fn(),
  findGroupByName: vi.fn(),
  countUnreadInvitationsByUser: vi.fn(),
}));

export default groupRepository;
