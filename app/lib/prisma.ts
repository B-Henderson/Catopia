import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  throw new Error('POSTGRES_PRISMA_URL or DATABASE_URL environment variable is required');
}

const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;