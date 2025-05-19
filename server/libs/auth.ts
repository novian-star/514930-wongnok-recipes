import type { H3Event } from 'h3';

import { authConfig } from '~~/server/confs/auth';

export async function useAuthSession(event: H3Event) {
  const password = authConfig.password;

  const session = await useSession<{
    userId: string;
  }>(event, {
    password,
    maxAge: 60 * 60 * 1, // 1 hours
  });

  return session;
}

/** Authentication session validation middleware. */
export async function isValidAuthSession(event: H3Event) {
  const session = await useAuthSession(event);
  if (!session.data.userId) {
    throw createError({
      statusCode: 401,
    });
  }
}
