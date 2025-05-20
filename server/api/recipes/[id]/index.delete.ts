import { isValidAuthSession, useAuthSession } from '~~/server/libs/auth';
import { prisma } from '~~/server/libs/prisma';

export default defineEventHandler({
  onRequest: [isValidAuthSession],

  handler: async (event) => {
    const { id } = getQuery(event) as { id: string };

    const recipe = await prisma.recipe.findUnique({
      where: {
        id,
      },
    });

    if (!recipe) {
      throw createError({
        statusCode: 404,
      });
    }

    const session = await useAuthSession(event);

    if (recipe.userId !== session.data.userId) {
      throw createError({
        statusCode: 403,
      });
    }

    await prisma.recipe.delete({
      where: {
        id,
      },
    });

    return;
  },
});
