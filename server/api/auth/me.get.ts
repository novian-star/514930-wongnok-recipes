import type { SessionUserData } from '~~/shared/types/auth';

import { isValidAuthSession, useAuthSession } from '~~/server/libs/auth';
import { prisma } from '~~/server/libs/prisma';

export default defineEventHandler({
  onRequest: [isValidAuthSession],

  handler: async (event) => {
    const session = await useAuthSession(event);

    // Get user data.
    const user = await prisma.user.findUnique({
      where: { id: session.data.userId },
    });

    if (!user) {
      throw createError({
        statusCode: 401,
      });
    }

    return {
      data: {
        user,
      } satisfies SessionUserData,
    };
  },
});
