import prisma from "../prisma/client.js";

export function findSession(sessionId) {
  return prisma.betting_sessions.findFirst({
    select: {
      competition_id: true,
      season_id: true,
    },
    where: {
      id: sessionId,
    },
  });
}
