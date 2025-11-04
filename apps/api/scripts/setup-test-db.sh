#!/bin/bash

# Script to help set up the test database
# This creates a test database and helps you configure DATABASE_URL_TEST

echo "Setting up test database for occasions-app..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is not set. Please set it first in your .env file."
    exit 1
fi

# Extract database connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/database
DB_URL=$DATABASE_URL

# Extract database name and create test database name
# Get the database name from DATABASE_URL
DB_NAME=$(echo $DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

if [ -z "$DB_NAME" ]; then
    echo "❌ Could not parse database name from DATABASE_URL"
    exit 1
fi

TEST_DB_NAME="${DB_NAME}_test"

# Build test database URL (replace database name with test database name)
TEST_DB_URL=$(echo $DB_URL | sed "s|/${DB_NAME}|/${TEST_DB_NAME}|g")

echo ""
echo "📋 Test Database Configuration:"
echo "   Original Database: $DB_NAME"
echo "   Test Database: $TEST_DB_URL"
echo ""

# Create the test database
echo "Creating test database: $TEST_DB_NAME"
echo "You may need to enter your database password..."

# Extract connection details for psql
# Try to create database using psql
psql "$DB_URL" -c "CREATE DATABASE ${TEST_DB_NAME};" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Test database created successfully!"
else
    echo "⚠️  Could not create database automatically. You may need to create it manually:"
    echo "   CREATE DATABASE ${TEST_DB_NAME};"
fi

echo ""
echo "📝 Add this to your .env file:"
echo "   DATABASE_URL_TEST=\"$TEST_DB_URL\""
echo ""
echo "Or run this command to add it automatically:"
echo "   echo 'DATABASE_URL_TEST=\"$TEST_DB_URL\"' >> .env"

