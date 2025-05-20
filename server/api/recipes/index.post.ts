import * as v from 'valibot';

import { isValidAuthSession, useAuthSession } from '~~/server/libs/auth';
import { prisma } from '~~/server/libs/prisma';
import { CreateRecipeSchema } from '~~/shared/validations/recipe';

export default defineEventHandler({
  onRequest: [isValidAuthSession],

  handler: async (event) => {
    const session = await useAuthSession(event);

    const data = await readValidatedBody(event, v.parser(CreateRecipeSchema));

    const recipe = await prisma.recipe.create({
      data: {
        ...data, userId: session.data.userId
      }
    })

    return recipe;
  },
});
