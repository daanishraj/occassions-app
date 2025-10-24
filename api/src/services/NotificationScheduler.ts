import cron from 'node-cron';
import { DailyNotificationService } from '../scripts/daily-notifications';
import { logger } from '../utils/logger';

export class NotificationScheduler {
  private dailyNotificationService: DailyNotificationService;
  private cronJob: cron.ScheduledTask | null = null;
  
  private readonly DAILY_SCHEDULE_TIME = '00 5 * * *';
  private readonly SCHEDULE_DESCRIPTION = '5:00 CET';

  constructor() {
    this.dailyNotificationService = new DailyNotificationService();
  }

  start(): void {
    // Prevent multiple cron jobs from being created
    if (this.cronJob) {
      logger.info('📅 Daily notifications scheduler is already running');
      return;
    }

    // Cron format: minute hour day month dayOfWeek
    this.cronJob = cron.schedule(this.DAILY_SCHEDULE_TIME, async () => {
      logger.info(`🕐 Scheduled daily notifications triggered at ${this.SCHEDULE_DESCRIPTION}`);
      
      try {
        await this.dailyNotificationService.run();
        logger.info('✅ Scheduled daily notifications completed successfully');
      } catch (error) {
        logger.error('❌ Scheduled daily notifications failed:', error);
      }
    }, {
      scheduled: true,
      timezone: "Europe/Berlin"
    });

    logger.info(`📅 Daily notifications scheduler started - will run at ${this.SCHEDULE_DESCRIPTION} daily`);
  }

  stop(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      logger.info('⏹️ Daily notifications scheduler stopped');
    }
  }

  getStatus(): { isRunning: boolean; nextRunDate?: String; cronExpression: string } {
    if (!this.cronJob) {
      return { isRunning: false, cronExpression: this.DAILY_SCHEDULE_TIME };
    }

    const nextDate = this.calculateNextRun(this.DAILY_SCHEDULE_TIME);
    const nextRunDate = this.formatDateReadable(nextDate);

    return {
      isRunning: true,
      nextRunDate,
      cronExpression: this.DAILY_SCHEDULE_TIME
    };
  }

  private calculateNextRun(cronExpression: string): Date {
    // Parse cron expression
    const [minute, hour] = cronExpression.split(' ').map(Number);
    
    const now = new Date();
    const nextRun = new Date();
    
    // Set the time for today
    nextRun.setHours(hour, minute, 0, 0);
    
    // If the time has already passed today, set it for tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    return nextRun;
  }

  private formatDateReadable(date: Date): string {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Berlin',
      timeZoneName: 'short'
    });
  }
}

