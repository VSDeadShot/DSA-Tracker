import prisma from './prisma'
import { Prisma } from '@prisma/client'

/**
 * Fetches a Problem by id only if it belongs to the given user, in a single query.
 * Returns null if the problem doesn't exist or isn't owned by the user — callers
 * decide how to handle that (redirect, notFound, throw, silent no-op, etc).
 */
export async function getOwnedProblem<T extends Prisma.ProblemInclude | undefined = undefined>(
  problemId: string,
  userId: string,
  include?: T
): Promise<Prisma.ProblemGetPayload<{ include: T }> | null> {
  return prisma.problem.findUnique({
    where: { id: problemId, user_id: userId },
    include,
  }) as Promise<Prisma.ProblemGetPayload<{ include: T }> | null>
}
