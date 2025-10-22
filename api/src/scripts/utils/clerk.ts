import { createClerkClient } from '@clerk/backend';
import { logger } from '../../utils/logger';

export interface ClerkConfig {
  secretKey: string;
}

export interface UserPhoneNumber {
  userId: string;
  phoneNumber: string | null;
}

interface PhoneNumber {
  phoneNumber: string;
  verification?: {
    status: string;
  };
}

export class ClerkService {
  private clerk: ReturnType<typeof createClerkClient>;

  constructor(config: ClerkConfig) {
    this.clerk = createClerkClient({
      secretKey: config.secretKey,
    });
  }

  async getUserPhoneNumber(userId: string): Promise<string | null> {
    try {
      const user = await this.clerk.users.getUser(userId);
      
      const phoneNumbers: PhoneNumber[] = user.phoneNumbers;
      
      if (phoneNumbers && phoneNumbers.length > 0) {
        // Return the first verified phone number, or the first one if none are verified
        const verifiedPhone = phoneNumbers.find((pn: PhoneNumber) => pn.verification?.status === 'verified');
        const phoneNumber = verifiedPhone || phoneNumbers[0];
        
        logger.info(`Found phone number for user ${userId}: ${phoneNumber.phoneNumber}`);
        return phoneNumber.phoneNumber;
      }

      // Check public metadata for phone number (fallback)
      const publicMetadata = user.publicMetadata as any;
      if (publicMetadata?.phoneNumber) {
        logger.info(`Found phone number in metadata for user ${userId}: ${publicMetadata.phoneNumber}`);
        return publicMetadata.phoneNumber;
      }

      logger.info(`No phone number found for user ${userId}`);
      return null;
    } catch (error) {
      logger.error(`Failed to fetch phone number for user ${userId}:`, error);
      return null;
    }
  }

  async getAllUserPhoneNumbers(userIds: string[]): Promise<UserPhoneNumber[]> {
    const results: UserPhoneNumber[] = [];
    
    for (const userId of userIds) {
      const phoneNumber = await this.getUserPhoneNumber(userId);
      results.push({ userId, phoneNumber });
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
