import { prisma } from '~~/server/libs/prisma';

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event) as { id: string };

  const recipe = await prisma.recipe.findUnique({
    where: {
      id: id,
    },
    include: {
      ratings: {
        select: {
          userId: true,
          value: true,
        }
      }
    }
  });

  if (!recipe) {
    throw createError({
      statusCode: 404
    })
  }

  return recipe;
});
