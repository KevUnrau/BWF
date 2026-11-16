import { vi } from "vitest";

export const res = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
  send: vi.fn(),
  sendStatus: vi.fn(),
};

export const next = vi.fn();
