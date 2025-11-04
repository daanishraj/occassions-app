##VERIFY THIS ONCE MORE

# Setting Up Test Database

To run tests, you need to create a separate test database and configure `DATABASE_URL_TEST`.

## Option 1: Manual Setup (Recommended)

### Step 1: Create Test Database

Connect to your PostgreSQL server and create a test database:

```bash
# Using psql
psql -U your_username -d postgres
CREATE DATABASE occasions_test;

# Or using createdb command
createdb -U your_username occasions_test
```

### Step 2: Add to .env File

Add `DATABASE_URL_TEST` to your `.env` file in the `apps/api/` directory:

```bash
# Your existing DATABASE_URL (for development)
DATABASE_URL="postgresql://user:password@localhost:5432/never_miss_a_date"

# Test database (REQUIRED for tests)
DATABASE_URL_TEST="postgresql://user:password@localhost:5432/never_miss_a_date_TEST"
```

**Important**: The test database URL should:
- Use the same credentials as your dev database
- Point to a different database name
- Be on the same PostgreSQL server (or a separate test server)

## Option 2: Using the Setup Script

A helper script is available at `scripts/setup-test-db.sh`:

```bash
# Make sure DATABASE_URL is set in your .env first
cd apps/api
./scripts/setup-test-db.sh
```

This script will:
1. Parse your `DATABASE_URL`
2. Create a test database with `_test` suffix
3. Show you the `DATABASE_URL_TEST` to add to your `.env`

## Option 3: Using Docker (if you use Docker for PostgreSQL)

If you're using Docker for your database:

```bash
# Create a test database container
docker run --name never-miss-a-date-test-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=never_miss_a_date_TEST \
  -p 5433:5432 \
  -d postgres

# Then use:
DATABASE_URL_TEST="postgresql://postgres:password@localhost:5433/never_miss_a_date_TEST"
```

## Verification

After setting up, verify your configuration:

```bash
# Check that DATABASE_URL_TEST is set
cd apps/api
npm run test -- --run tests/integration/routes/occassions.route.test.ts
```

If you see an error about `DATABASE_URL_TEST` not being set, make sure:
1. The `.env` file exists in `apps/api/` directory
2. `DATABASE_URL_TEST` is set in that file
3. The test database exists and is accessible

## Database URL Format

The format for PostgreSQL connection strings is:
```
postgresql://[user[:password]@][host][:port][/database][?param1=value1&...]
```

Examples:
- Local: `postgresql://postgres:password@localhost:5432/occasions_test`
- Remote: `postgresql://user:pass@example.com:5432/occasions_test`
- With SSL: `postgresql://user:pass@host:5432/db?sslmode=require`

