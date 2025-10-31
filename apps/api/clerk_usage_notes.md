# Clerk Usage Notes - Occasions App

## Overview

This application uses **Clerk** for authentication and user management, with a custom database for app-specific data (occasions). This document explains the architecture and implementation details.

## Architecture

### Authentication Flow
```
Frontend → Clerk Auth → Gets user.id → Sends to your API → Your API uses user.id to query occasions
```

### Data Storage
- **User Authentication & Profiles**: Handled by Clerk in their database
- **App Data (Occasions)**: Stored in your Prisma database with `userId` linking to Clerk's user ID

## Implementation Details

### Frontend (React + Clerk)

#### Authentication Setup
- **Package**: `@clerk/clerk-react`
- **Login/Signup**: Uses Clerk's `<SignIn>` and `<SignUp>` components
- **Route Protection**: Uses `<SignedIn>` and `<SignedOut>` wrappers
- **User Context**: Uses `useUser()` and `useAuth()` hooks

#### Key Files:
- `ui/src/App.tsx` - Route protection with Clerk components
- `ui/src/pages/login/index.tsx` - Login/signup forms
- `ui/src/pages/occassions/hooks/use-get-occasion.ts` - Gets Clerk user ID

#### User ID Usage:
```typescript
const { user } = useUser()
const userId = user?.id; // Example: "user_2nbrhZV5IyEc44ZS16A6hSZx7ns"
```

### Backend (Express + Prisma)

#### Authentication Handling:
- **No JWT validation**: Clerk user ID is passed directly in Authorization header
- **User ID Extraction**: `req.headers.authorization?.split(" ")[1]`
- **Database Queries**: Use Clerk user ID to filter occasions

#### Key Files:
- `api/src/controllers/occasions.controller.ts` - Extracts user ID from headers
- `api/src/routes/occasions.route.ts` - API endpoints
- `api/prisma/schema.prisma` - Database schema with `userId` field

## Current Profile Setup

### Two Profile Systems (Conflicting):

1. **Clerk's Profile Management**:
   - File: `ui/src/pages/profile/components/clerk-user-info/index.tsx`
   - Uses: `<UserButton/>` - Clerk's built-in profile UI
   - Status: ✅ Working - handles user profile in Clerk's database

2. **Custom Profile System**:
   - File: `ui/src/pages/profile/components/custom-user-info/index.tsx`
   - File: `api/src/controllers/profile.controller.ts`
   - Status: ❌ Not connected - returns mock data only

### Profile Controller Issues:
- Returns hardcoded mock data (`firstName: "James", lastName: "Py"`)
- Not integrated with Clerk user data
- No database persistence
- Creates confusion about which profile system to use

## Database Schema

### Current Schema (Prisma):
```prisma
model Occasion {
  id            String      @id @default(cuid())
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  userId        String      // Links to Clerk user ID
  name          String
  occasionType  OccasionType
  month         Month
  day           Int
}
```

### Missing Profile Model:
- No `Profile` table in database
- User profile data is managed entirely by Clerk
- Only occasions are stored locally

## API Endpoints

### Occasions API:
- `GET /occasions` - Gets occasions for authenticated user
- `POST /occasions` - Creates new occasion
- `PUT /occasions/:id` - Updates occasion
- `DELETE /occasions/:id` - Deletes occasion

### Profile API (Mock):
- `GET /profile` - Returns hardcoded profile data
- `PUT /profile` - Updates hardcoded profile data

## Recommendations

### Option 1: Use Clerk's Profile Management (Recommended)
**Pros:**
- ✅ Already working
- ✅ No additional database complexity
- ✅ Clerk handles all user management
- ✅ Built-in UI components

**Cons:**
- ❌ Limited customization
- ❌ Cannot add app-specific profile fields

**Implementation:**
- Remove custom profile controller and components
- Use only Clerk's `<UserButton/>` for profile management
- Focus database only on occasions

### Option 2: Create Proper Profile Model
**Pros:**
- ✅ Full control over profile data
- ✅ Can add app-specific fields
- ✅ Better data consistency

**Cons:**
- ❌ More complex setup
- ❌ Need to sync with Clerk
- ❌ Duplicate data management

**Implementation:**
```prisma
model Profile {
  id            String   @id @default(cuid())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  userId        String   @unique  // Links to Clerk user ID
  firstName     String
  lastName      String
  email         String
  phoneNumber   String?
  occasions     Occasion[]
}
```

### Option 3: Hybrid Approach
- Keep Clerk for authentication
- Add Profile model for additional app-specific data
- Sync between Clerk and local database

## Current Issues to Address

1. **Port Conflicts**: API server has port 3001 conflicts
2. **Profile Confusion**: Two different profile systems
3. **Mock Data**: Profile controller returns fake data
4. **No Validation**: Backend doesn't validate Clerk user IDs

## Security Considerations

1. **User ID Validation**: Currently no verification that user ID is valid
2. **Authorization**: Should verify user owns the data they're accessing
3. **Clerk Integration**: Consider using Clerk's backend SDK for validation

## Next Steps

1. **Decide on profile approach** (Option 1, 2, or 3)
2. **Fix port conflicts** for development
3. **Remove unused profile code** if going with Clerk-only
4. **Add proper user validation** in API endpoints
5. **Consider Clerk backend SDK** for server-side validation

---

*Last updated: October 2024*
