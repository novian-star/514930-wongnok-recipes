import { prisma } from '~~/server/libs/prisma';

export default defineEventHandler(async (_event) => {
  return await prisma.recipe.findMany({
    include: {
      ratings: {
        select: {
          value: true,
        },
      },
    },
  });
});
