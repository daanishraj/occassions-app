import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const setupTestDatabase = async () => {
  // STRICT: Require DATABASE_URL_TEST - no fallback to prevent dev database contamination
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
    
    // If migrations are already applied or database already exists, that's okay
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
  // STRICT: Require DATABASE_URL_TEST - no fallback
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

  // Clean up all test data
  await prisma.occasion.deleteMany();
  
  await prisma.$disconnect();
};

export const seedTestData = async (prisma: PrismaClient) => {
  const testUserId = 'test-user-id-123';
  
  // Clean existing test data
  await prisma.occasion.deleteMany({
    where: {
      userId: testUserId,
    },
  });

  // Seed test occasions
  const occasions = await prisma.occasion.createMany({
    data: [
      {
        userId: testUserId,
        name: 'John Doe Birthday',
        occasionType: 'Birthday',
        month: 'January',
        day: 15,
      },
      {
        userId: testUserId,
        name: 'Wedding Anniversary',
        occasionType: 'Anniversary',
        month: 'June',
        day: 20,
      },
    ],
  });

  return { testUserId, occasions };
};

