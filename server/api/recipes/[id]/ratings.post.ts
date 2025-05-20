import * as v from 'valibot';

import { isValidAuthSession, useAuthSession } from '~~/server/libs/auth';
import { prisma } from '~~/server/libs/prisma';
import { CreateRatingSchema } from '~~/shared/validations/recipe';

export default defineEventHandler({
  onRequest: [isValidAuthSession],

  handler: async (event) => {
    const session = await useAuthSession(event);

    const { id } = getQuery(event) as { id: string };

    const recipe = await prisma.recipe.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        userId: true,
        ratings: {
          where: {
            userId: session.data.userId
          },
        }
      }
    })

    if (!recipe) {
      throw createError({
        statusCode: 404
      })
    }

    // On users attempt to rate their own recipe.
    if (recipe.userId === session.data.userId) {
      throw createError({
        statusCode: 403
      })
    }

    // On users attempt to rate a recipe they have already rated.
    if (recipe.ratings.length > 0) {
      throw createError({
        statusCode: 403
      })
    }

    const data = await readValidatedBody(event, v.parser(CreateRatingSchema));

    await prisma.recipe.update({
      where: {
        id: recipe.id
      },
      data: {
        ratings: {
          create: {
            value: data.value,
            userId: session.data.userId
          }
        }
      }
    })

    return;
  },
});
