import { OccasionType, PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { logger } from '../utils/logger';
import { createClerkService } from './utils/clerk';
import { DateUtils } from './utils/date-utils';
import { createTwilioService } from './utils/twilio';

interface OccasionGroup {
  occasionType: OccasionType;
  names: string[];
}

interface UserOccasions {
  userId: string;
  phoneNumber: string | null;
  occasions: OccasionGroup[];
}

class DailyNotificationService {
  private prisma: PrismaClient;
  private twilioService: ReturnType<typeof createTwilioService>;
  private clerkService: ReturnType<typeof createClerkService>;

  constructor() {
    this.prisma = new PrismaClient();
    this.twilioService = createTwilioService();
    this.clerkService = createClerkService();
  }

  async run(): Promise<void> {
    logger.info('Starting daily notification script...');
    
    try {
      const today = DateUtils.getTodayDateInfo();
      logger.info(`Checking for occasions on ${DateUtils.formatDateInfo(today)}`);

      // Get all unique user IDs from the database
      const userIds = await this.getAllUserIds();
      logger.info(`Found ${userIds.length} unique users in database`);

      if (userIds.length === 0) {
        logger.info('No users found in database. Exiting.');
        return;
      }

      // Get phone numbers for all users
      const userPhoneNumbers = await this.clerkService.getAllUserPhoneNumbers(userIds);
      logger.info(`Retrieved phone numbers for ${userPhoneNumbers.length} users`);

      let usersProcessed = 0;
      let messagesSent = 0;

      // Process each user
      for (const userPhone of userPhoneNumbers) {
        try {
          usersProcessed++;
          logger.info(`Processing user ${usersProcessed}/${userIds.length}: ${userPhone.userId}`);

          if (!userPhone.phoneNumber) {
            logger.info(`No phone number found for user ${userPhone.userId}. Skipping.`);
            continue;
          }

          // Get today's occasions for this user
          const userOccasions = await this.getTodaysOccasionsForUser(userPhone.userId, today);
          
          if (userOccasions.length === 0) {
            logger.info(`No occasions found for user ${userPhone.userId} today. Skipping.`);
            continue;
          }

          // Group occasions by type
          const occasionGroups = this.groupOccasionsByType(userOccasions);
          
          // Send message if there are occasions
          if (occasionGroups.length > 0) {
            const message = this.constructMessage(occasionGroups);
            const success = await this.twilioService.sendSMS(userPhone.phoneNumber, message);
            
            if (success) {
              messagesSent++;
              logger.info(`Message sent successfully to user ${userPhone.userId}`);
            } else {
              logger.error(`Failed to send message to user ${userPhone.userId}`);
            }
          }

        } catch (error) {
          logger.error(`Error processing user ${userPhone.userId}:`, error);
          // Continue to next user
        }
      }

      // Log final statistics
      logger.info(`Script completed successfully.`);
      logger.info(`Users processed: ${usersProcessed}`);
      logger.info(`Users sent messages: ${messagesSent}`);
      logger.info(`Logs saved to: ${logger.logFilePath}`);

    } catch (error) {
      logger.error('Fatal error in daily notification script:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  private async getAllUserIds(): Promise<string[]> {
    const occasions = await this.prisma.occasion.findMany({
      select: { userId: true },
      distinct: ['userId'],
    });
    
    return occasions.map(occasion => occasion.userId);
  }

  private async getTodaysOccasionsForUser(userId: string, today: { month: any; day: number }) {
    return await this.prisma.occasion.findMany({
      where: {
        userId,
        month: today.month,
        day: today.day,
      },
      select: {
        name: true,
        occasionType: true,
      },
    });
  }

  private groupOccasionsByType(occasions: Array<{ name: string; occasionType: OccasionType }>): OccasionGroup[] {
    const groups = new Map<OccasionType, string[]>();

    for (const occasion of occasions) {
      if (!groups.has(occasion.occasionType)) {
        groups.set(occasion.occasionType, []);
      }
      groups.get(occasion.occasionType)!.push(occasion.name);
    }

    return Array.from(groups.entries()).map(([occasionType, names]) => ({
      occasionType,
      names,
    }));
  }

  private constructMessage(occasionGroups: OccasionGroup[]): string {
    const messageParts: string[] = [];

    for (const group of occasionGroups) {
      if (group.names.length > 0) {
        const namesList = group.names.join(', ');
        const occasionTypeText = group.occasionType.toLowerCase();
        messageParts.push(`These lovely people have their ${occasionTypeText} today! \n${namesList}`);
      }
    }

    return messageParts.join('\n\n');
  }
}

async function main() {
  const service = new DailyNotificationService();
  
  try {
    await service.run();
    logger.info('Daily notification script completed successfully');
  } catch (error) {
    logger.error('Daily notification script failed:', error);
    process.exit(1);
  }
}

// Run the script if this file is executed directly
if (require.main === module) {
  main();
}

export { DailyNotificationService };
