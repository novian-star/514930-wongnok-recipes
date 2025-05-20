import { prisma } from '~~/server/libs/prisma';

export default defineEventHandler(async (event) => {
  const { search, limit, offset } = getQuery(event);

  const [recipes, count] = await prisma.$transaction([
    prisma.recipe.findMany({
      where: {
        OR: search ? [
          { title: { contains: String(search) } },
          { description: { contains: String(search) } },
          { ingredients: { contains: String(search) } },
          { instructions: { contains: String(search) } },
        ] : undefined,
      },
      include: {
        ratings: {
          select: {
            value: true,
          },
        },
      },
      take: limit ? parseInt(String(limit)) || 10 : 10,
      skip: offset ? parseInt(String(offset)) || 0 : 0,
    }),
    prisma.recipe.count({
      where: {
        OR: search ? [
          { title: { contains: String(search) } },
          { description: { contains: String(search) } },
          { ingredients: { contains: String(search) } },
          { instructions: { contains: String(search) } },
        ] : undefined,
      },
    }),
  ]);

  return {
    data: recipes,
    meta: {
      count,
    },
  };
});
