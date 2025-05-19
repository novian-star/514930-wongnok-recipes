import crypto from 'crypto';
import type { H3Event } from 'h3';

declare const globalThis: {
  password?: string;
};

export async function useAuthSession(event: H3Event) {
  // Get and set memory password.
  // TODO: Implement a better approach.
  const password = globalThis.password || crypto.randomBytes(128).toString();

  if (!globalThis.password) {
    globalThis.password = password;
  }

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
