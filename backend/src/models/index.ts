import { PrismaClient } from '@prisma/client';
import { env } from '@/config/env';

// Create global Prisma instance with enhanced configuration
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

// Prevent multiple instances in development
if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export * from '@prisma/client';