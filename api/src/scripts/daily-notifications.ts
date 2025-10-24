import { OccasionType, PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { dailyNotificationsLogger } from '../utils/dailyNotificationsLogger';
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

  private formatUserName(user: { firstName: string | null; lastName: string | null; userId: string }): string {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    } else {
      return user.userId; // Fallback to userId if no name available
    }
  }

  async run(): Promise<void> {
    dailyNotificationsLogger.info('Starting daily notification script...');
    
    try {
      const today = DateUtils.getTodayDateInfo();
      dailyNotificationsLogger.info(`Checking for occasions on ${DateUtils.formatDateInfo(today)}`);

      // Get all unique user IDs from the database
      const userIds = await this.getAllUserIds();
      dailyNotificationsLogger.info(`Found ${userIds.length} unique users in database`);

      if (userIds.length === 0) {
        dailyNotificationsLogger.info('No users found in database. Exiting.');
        return;
      }

      // Get phone numbers for all users
      const userPhoneNumbers = await this.clerkService.getAllUserPhoneNumbers(userIds);
      dailyNotificationsLogger.info(`Retrieved phone numbers for ${userPhoneNumbers.length} users`);

      let usersProcessed = 0;
      let messagesSent = 0;

      // Process each user
      for (const userPhone of userPhoneNumbers) {
        try {
          usersProcessed++;
          const userName = this.formatUserName(userPhone);
          dailyNotificationsLogger.info(`Processing user ${usersProcessed}/${userIds.length}: ${userName}`);

          if (!userPhone.phoneNumber) {
            dailyNotificationsLogger.info(`No phone number found for user ${userName}. Skipping.`);
            continue;
          }

          // Get today's occasions for this user
          const userOccasions = await this.getTodaysOccasionsForUser(userPhone.userId, today);
          
          if (userOccasions.length === 0) {
            dailyNotificationsLogger.info(`No occasions found for user ${userName} today. Skipping.`);
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
              dailyNotificationsLogger.info(`Message sent successfully to user ${userName}`);
            } else {
              dailyNotificationsLogger.error(`Failed to send message to user ${userName}`);
            }
          }

        } catch (error) {
          const userName = this.formatUserName(userPhone);
          dailyNotificationsLogger.error(`Error processing user ${userName}:`, error);
          // Continue to next user
        }
      }

      // Log final statistics
      dailyNotificationsLogger.info(`Script completed successfully.`);
      dailyNotificationsLogger.info(`Users processed: ${usersProcessed}`);
      dailyNotificationsLogger.info(`Users sent messages: ${messagesSent}`);
      dailyNotificationsLogger.info(`Logs saved to: ${dailyNotificationsLogger.logFilePath}`);

    } catch (error) {
      dailyNotificationsLogger.error('Fatal error in daily notification script:', error);
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
    dailyNotificationsLogger.info('Daily notification script completed successfully');
  } catch (error) {
    dailyNotificationsLogger.error('Daily notification script failed:', error);
    process.exit(1);
  }
}

// Run the script if this file is executed directly
if (require.main === module) {
  main();
}

export { DailyNotificationService };
