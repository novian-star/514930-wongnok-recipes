import type { CookingTime, Difficulty } from '~~/.generated/prisma';
import { useAuthSession } from '~~/server/libs/auth';
import { prisma } from '~~/server/libs/prisma';

export default defineEventHandler(async (event) => {
  const { search, limit, offset, owned } = getQuery(event);
  const filter = JSON.parse(String(getQuery(event).filter)) as {
    cookingTime: string;
    difficulty: string;
  };

  const session = await useAuthSession(event);

  const [recipes, count] = await prisma.$transaction([
    prisma.recipe.findMany({
      where: {
        OR: search
          ? [
              { title: { contains: String(search) } },
              { description: { contains: String(search) } },
              { ingredients: { contains: String(search) } },
              { instructions: { contains: String(search) } },
            ]
          : undefined,
        userId: owned ? session.data.userId : undefined,
        cookingTime: filter?.cookingTime
          ? { equals: String(filter.cookingTime) as CookingTime }
          : undefined,
        difficulty: filter?.difficulty
          ? { equals: String(filter.difficulty) as Difficulty }
          : undefined,
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
        OR: search
          ? [
              { title: { contains: String(search) } },
              { description: { contains: String(search) } },
              { ingredients: { contains: String(search) } },
              { instructions: { contains: String(search) } },
            ]
          : undefined,
        userId: owned ? session.data.userId : undefined,
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
