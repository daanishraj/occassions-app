import { Month, OccasionType, PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { TEST_USER_ID } from './constants';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const setupTestDatabase = async () => {
  const testDatabaseUrl = process.env.DATABASE_URL_TEST;
  
  if (!testDatabaseUrl) {
    throw new Error(
      '❌ DATABASE_URL_TEST environment variable is required for tests!\n' +
      '   This prevents contamination of your development database.\n' +
      '   Please set DATABASE_URL_TEST in your .env file or environment.'
    );
  }

  try {
    // Run migrations using npx prisma migrate deploy
    // This will only apply migrations that haven't been applied yet
    execSync('npx prisma migrate deploy', {
      env: {
        ...process.env,
        DATABASE_URL: testDatabaseUrl,
      },
      stdio: 'pipe', // Use 'pipe' to capture output and avoid noise
      cwd: join(__dirname, '../..'),
    });
    console.log('✓ Database migrations completed');
  } catch (error: any) {
    // Check if error is just about migrations already applied (which is fine)
    const errorOutput = error.stderr?.toString() || error.stdout?.toString() || error.message || '';
    
    if (errorOutput.includes('already applied') || 
        errorOutput.includes('Unique constraint failed') ||
        errorOutput.includes('already exists')) {
      console.log('✓ Database and migrations are ready');
    } else {
      console.error('✗ Failed to run database migrations:', errorOutput || error.message);
      throw error;
    }
  }

  return testDatabaseUrl;
};

export const teardownTestDatabase = async () => {
  const testDatabaseUrl = process.env.DATABASE_URL_TEST;
  
  if (!testDatabaseUrl) {
    throw new Error('DATABASE_URL_TEST is required for teardown');
  }
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: testDatabaseUrl,
      },
    },
  });

  try {
    // Get all table names in the public schema, excluding Prisma system tables
    const tablesResult = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      AND tablename NOT LIKE '_prisma_%'
    `;

    const tableNames = tablesResult.map((row) => row.tablename);

    if (tableNames.length > 0) {
      // Truncate all tables with CASCADE to handle foreign key constraints
      // This is faster and more thorough than deleteMany()
      const tableList = tableNames.map((name) => `"${name}"`).join(', ');
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE;`
      );
      console.log(`✓ Cleared ${tableNames.length} table(s): ${tableNames.join(', ')}`);
    } else {
      console.log('✓ No tables found to clear');
    }
  } catch (error) {
    console.error('✗ Error clearing test database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const seedTestData = async (prisma: PrismaClient) => {
  // Clean existing test data
  await prisma.occasion.deleteMany({
    where: {
      userId: TEST_USER_ID,
    },
  });

  // Seed test occasions
  const occasions = await prisma.occasion.createMany({
    data: [
      {
        userId: TEST_USER_ID,
        name: 'John Doe Birthday',
        occasionType: OccasionType.Birthday,
        month: Month.January,
        day: 15,
      },
      {
        userId: TEST_USER_ID,
        name: 'Wedding Anniversary',
        occasionType: OccasionType.Anniversary,
        month: Month.June,
        day: 20,
      },
    ],
  });

  return { testUserId: TEST_USER_ID, occasions };
};

