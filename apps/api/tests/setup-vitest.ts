import { PrismaClient } from '@prisma/client';
import { afterAll, beforeAll } from 'vitest';
import { seedTestData, setupTestDatabase, teardownTestDatabase } from './helpers/database';

// Setup timeout for tests
// if (process.env.DEBUGGER_ATTACHED === "vitest") {
//   // 10 minutes timeout when debugger is attached
//   vi.setConfig({ testTimeout: 6e5 });
// } else {
//   // 20 seconds timeout for normal tests
//   vi.setConfig({ testTimeout: 2e4 });
// }

let prisma: PrismaClient;

beforeAll(async () => {
  // STRICT: Require DATABASE_URL_TEST - no fallback to prevent dev database contamination
  const testDatabaseUrl = process.env.DATABASE_URL_TEST;
  
  if (!testDatabaseUrl) {
    throw new Error(
      '❌ DATABASE_URL_TEST environment variable is required for tests!\n' +
      '   This prevents contamination of your development database.\n' +
      '   Please set DATABASE_URL_TEST in your .env file or environment.\n' +
      '   Example: DATABASE_URL_TEST="postgresql://user:password@localhost:5432/occasions_test"'
    );
  }
  
  // Override DATABASE_URL for tests (this should already be set in vitest.config.mts, but ensure it here too)
  process.env.DATABASE_URL = testDatabaseUrl;
  
  // Setup test database (run migrations)
  await setupTestDatabase();
  
  // Create Prisma client with test database
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: testDatabaseUrl,
      },
    },
  });
  
  // Seed test data
  await seedTestData(prisma);
  console.log('✓ Test data seeded');
});

afterAll(async () => {
  // Clean up test database
  if (prisma) {
    await teardownTestDatabase();
    await prisma.$disconnect();
  }
});

