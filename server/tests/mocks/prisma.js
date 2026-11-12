import { vi } from "vitest";
import prisma from "../../src/prisma/client.js";

export const tx = {};

vi.mock("../../src/prisma/client.js", () => ({
  default: {
    $transaction: vi.fn(),
  },
}));

prisma.$transaction.mockImplementation((callback) => callback(tx));

export default prisma;
