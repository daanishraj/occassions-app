/// <reference types="vitest" />
import { config } from 'dotenv';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file before checking for DATABASE_URL_TEST
config({ path: resolve(__dirname, '.env') });

if (!process.env.DATABASE_URL_TEST) {
  throw new Error(
    '❌ DATABASE_URL_TEST environment variable is required for tests!\n' +
    '   Please set DATABASE_URL_TEST in your .env file or environment.\n' +
    '   Example: DATABASE_URL_TEST="postgresql://user:password@localhost:5432/occasions_test"\n' +
    '   Current .env file location: ' + resolve(__dirname, '.env')
  );
}

// Set DATABASE_URL to the test database URL before any modules load
// This ensures PrismaClient instances created at module load time use the test database
process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup-vitest.ts'],
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    env: {
      DATABASE_URL: process.env.DATABASE_URL_TEST,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

