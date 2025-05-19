import bcrypt from 'bcryptjs';
import * as v from 'valibot';

import { useAuthSession } from '~~/server/libs/auth';
import { prisma } from '~~/server/libs/prisma';
import { LoginSchema } from '~~/shared/validations/auth';

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, v.parser(LoginSchema));

  const { username, password } = data;

  // Verify credentials.
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, password: true },
  });

  const validPassword = bcrypt.compareSync(password, user?.password || '');

  if (!user || !validPassword) {
    throw createError({
      statusCode: 401,
    });
  }

  // Set an authentication session.
  const session = await useAuthSession(event);
  await session.update({
    userId: user.id,
  });

  return;
});
