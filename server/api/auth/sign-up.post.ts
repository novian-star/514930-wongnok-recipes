import bcrypt from 'bcryptjs';
import * as v from 'valibot';

import { useAuthSession } from '~~/server/libs/auth';
import { prisma } from '~~/server/libs/prisma';
import { SignUpSchema } from '~~/shared/validations/auth';

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, v.parser(SignUpSchema));

  const { username, password, name } = data;

  // Verify an existing user.
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (user) {
    throw createError({
      statusCode: 409,
    });
  }

  // Create user.
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const createdUser = await prisma.user.create({
    data: { username, password: hashedPassword, name },
  });

  // Set an authentication session.
  const session = await useAuthSession(event);
  await session.update({
    userId: createdUser.id,
  });

  return;
});
