# Daily Notifications Script

This directory contains scripts for sending daily SMS notifications to users about their occasions.

## Overview

The daily notification script (`daily-notifications.ts`) runs through all users in the database and sends SMS messages to those who have occasions (birthdays, anniversaries) occurring today.

## Features

- ✅ Fetches all unique user IDs from the database
- ✅ Retrieves phone numbers from Clerk user profiles
- ✅ Filters occasions to only those occurring today
- ✅ Groups occasions by type (Birthday, Anniversary)
- ✅ Constructs personalized messages
- ✅ Sends SMS via Twilio
- ✅ Comprehensive logging with error handling
- ✅ Continues processing even if individual messages fail
- ✅ Provides detailed statistics at completion

## Usage

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Ensure your database is set up and migrated:
   ```bash
   npm run prisma:migrate
   ```

3. Set up environment variables:
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your actual credentials
   # Required variables:
   # - DATABASE_URL
   # - CLERK_SECRET_KEY
   # - TWILIO_ACCOUNT_SID
   # - TWILIO_AUTH_TOKEN
   # - TWILIO_FROM_NUMBER
   ```

### Running the Script

#### Development Mode (with ts-node)
```bash
npm run daily-notifications
```

#### Production Mode (compiled)
```bash
npm run daily-notifications:build
npm run daily-notifications:run
```

#### Direct Execution
```bash
npx ts-node src/scripts/daily-notifications.ts
```

### Scheduling

To run this script daily, you can set up a cron job:

```bash
# Add to crontab to run daily at 9 AM
0 9 * * * cd /path/to/your/api && npm run daily-notifications:run
```

Or use GitHub Actions, AWS Lambda, or other scheduling services.

## Configuration

The script uses environment variables for all sensitive credentials:

- **Twilio**: Account SID, Auth Token, and From Number
- **Clerk**: Secret Key for user data access
- **Database**: Database connection URL

See `env.example` file for the complete list of required environment variables.

To configure:
1. Copy `env.example` to `.env`
2. Fill in your actual credentials
3. Ensure `.env` is in `.gitignore`

## Message Format

The script constructs messages in this format:

```
These lovely people have their birthday today! John, Jane, Bob

These lovely people have their anniversary today! Alice & Bob, Carol & Dave
```

## Logging

All operations are logged using the built-in logger utility. The script logs:

- Script start/completion
- Number of users found
- Phone number retrieval results
- Occasion filtering results
- Message sending success/failure
- Final statistics (users processed, messages sent, etc.)
- Any errors encountered

## Error Handling

- If a user has no phone number, they are skipped
- If Twilio fails to send a message, the error is logged but processing continues
- If Clerk fails to fetch user data, the error is logged but processing continues
- Database connection errors will cause the script to exit

## File Structure

```
src/scripts/
├── daily-notifications.ts    # Main script
└── utils/
    ├── twilio.ts            # Twilio SMS service
    ├── clerk.ts             # Clerk user data service
    └── date-utils.ts        # Date manipulation utilities
```

## Dependencies

- `@prisma/client` - Database access
- `@clerk/clerk-sdk-node` - User data from Clerk
- `twilio` - SMS messaging
- `ts-node` - TypeScript execution
