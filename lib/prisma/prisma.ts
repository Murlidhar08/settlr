import { PrismaPg } from '@prisma/adapter-pg';
import { envServer } from "../env.server";
import { PrismaClient } from '../generated/prisma/client';

const prismaClientSingleton = () => {
  const connectionString = envServer.DATABASE_URL;
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export { prisma };

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
