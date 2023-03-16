import { PrismaClient } from '@prisma/client'

export const prisma =
  // @ts-expect-error
  global.prisma || new PrismaClient({
    log: ['query'],
  });


// @ts-expect-error
if (process.env.NODE_ENV === 'development') global.prisma = prisma;

