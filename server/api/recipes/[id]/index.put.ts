import * as v from 'valibot';

import { isValidAuthSession, useAuthSession } from '~~/server/libs/auth';
import { prisma } from '~~/server/libs/prisma';
import { UpdateRecipeSchema } from '~~/shared/validations/recipe';

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

    const data = await readValidatedBody(event, v.parser(UpdateRecipeSchema));

    const updatedRecipe = await prisma.recipe.update({
      where: {
        id: recipe.id,
      },
      data: {
        ...data,
      },
    });

    return updatedRecipe;
  },
});
