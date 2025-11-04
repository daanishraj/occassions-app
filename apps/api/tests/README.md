# Test Setup

This directory contains integration and unit tests for the API.

## Test Database Setup

The integration tests use a separate test database to ensure isolation and determinism. 

### Configuration

1. **Set up a test database**: Create a separate PostgreSQL database for tests. **This is required** - tests will not run without it.

2. **Set environment variable**: Add `DATABASE_URL_TEST` to your `.env` file:
   ```bash
   DATABASE_URL_TEST="postgresql://user:password@localhost:5432/occasions_test"
   ```

   **IMPORTANT**: `DATABASE_URL_TEST` is **REQUIRED**. Tests will fail immediately if it's not set to prevent accidentally contaminating your development database.

### How It Works

1. **Before all tests** (`setup-vitest.ts`):
   - Runs Prisma migrations on the test database
   - Seeds test data (2 occasions for test user)

2. **After all tests**:
   - Cleans up all test data
   - Disconnects from the database

### Test Data

The test setup automatically seeds:
- 2 occasions for user `test-user-id-123`:
  - "John Doe Birthday" (Birthday, January 15)
  - "Wedding Anniversary" (Anniversary, June 20)

### Running Tests

```bash
# Run all tests
npm test

# Run tests in UI mode
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Notes

- Tests are isolated: each test run starts with clean, seeded data
- The test database is automatically migrated before tests run
- Test data is cleaned up after all tests complete

