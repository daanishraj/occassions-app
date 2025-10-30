import { createClerkClient } from '@clerk/backend';
import { logger } from '../../utils/logger';

export interface ClerkConfig {
  secretKey: string;
}

export interface UserInfo {
  userId: string;
  phoneNumber: string | null;
  firstName: string | null;
  lastName: string | null;
}

interface PhoneNumber {
  phoneNumber: string;
  verification?: {
    status: string;
  } | null;
}

export class ClerkService {
  private clerk: ReturnType<typeof createClerkClient>;

  constructor(config: ClerkConfig) {
    this.clerk = createClerkClient({
      secretKey: config.secretKey,
    });
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    try {
      const user = await this.clerk.users.getUser(userId);
      
      const phoneNumbers: PhoneNumber[] = user.phoneNumbers;
      let phoneNumber: string | null = null;
      
      if (phoneNumbers && phoneNumbers.length > 0) {
        // Return the first verified phone number, or the first one if none are verified
        const verifiedPhone = phoneNumbers.find((pn: PhoneNumber) => pn.verification?.status === 'verified');
        const selectedPhone = verifiedPhone || phoneNumbers[0];
        phoneNumber = selectedPhone.phoneNumber;
        
        logger.info(`Found phone number for user ${userId}: ${phoneNumber}`);
      } else {
        // Check public metadata for phone number (fallback)
        const publicMetadata = user.publicMetadata as any;
        if (publicMetadata?.phoneNumber) {
          phoneNumber = publicMetadata.phoneNumber;
          logger.info(`Found phone number in metadata for user ${userId}: ${phoneNumber}`);
        } else {
          logger.info(`No phone number found for user ${userId}`);
        }
      }

      return {
        userId,
        phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName
      };
    } catch (error) {
      logger.error(`Failed to fetch user data for user ${userId}:`, error);
      return {
        userId,
        phoneNumber: null,
        firstName: null,
        lastName: null
      };
    }
  }

  async getAllUsersInfo(userIds: string[]): Promise<UserInfo[]> {
    const results: UserInfo[] = [];
    
    for (const userId of userIds) {
      const userInfo = await this.getUserInfo(userId);
      results.push(userInfo);
    }
    
    return results;
  }
}

export const createClerkService = (): ClerkService => {
  const secretKey = process.env.CLERK_SECRET_KEY;
  
  if (!secretKey) {
    throw new Error('CLERK_SECRET_KEY environment variable is required');
  }

  const config: ClerkConfig = {
    secretKey,
  };

  return new ClerkService(config);
};
