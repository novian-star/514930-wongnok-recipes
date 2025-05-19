import type { User } from '~~/.generated/prisma';

export type SessionUserData = {
  user: Omit<User, 'password'>;
};
