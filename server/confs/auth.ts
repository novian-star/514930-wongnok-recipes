import crypto from 'crypto';

declare const globalThis: {
  password?: string;
};

export const authConfig = {
  password:
    process.env.AUTH_SESSION_PASSWORd ||
    (() => {
      // Get and set memory password.
      const password =
        globalThis.password || crypto.randomBytes(128).toString();

      if (!globalThis.password) {
        globalThis.password = password;
      }

      return password;
    })(),
};
