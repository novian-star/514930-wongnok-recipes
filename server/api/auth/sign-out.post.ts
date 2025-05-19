import { isValidAuthSession, useAuthSession } from '~~/server/libs/auth';

export default defineEventHandler({
  onRequest: [isValidAuthSession],

  handler: async (event) => {
    // Clear an authentication session.
    const session = await useAuthSession(event);
    await session.clear();

    return;
  },
});
