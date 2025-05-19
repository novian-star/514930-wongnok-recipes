import {
  PrismaClient as BasePrismaClient,
  type Prisma,
} from '~~/.generated/prisma';

declare const globalThis: {
  prisma?: PrismaClient;
};

const options = {
  omit: {
    user: { password: true },
  },
} as const satisfies Prisma.PrismaClientOptions;

export class PrismaClient extends BasePrismaClient<typeof options> {
  constructor() {
    super(options);
  }
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
