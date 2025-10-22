import { Month } from '@prisma/client';

export interface DateInfo {
  month: Month;
  day: number;
}

export class DateUtils {
  /**
   * Get today's month and day
   */
  static getTodayDateInfo(): DateInfo {
    const today = new Date();
    const month = this.getMonthName(today.getMonth());
    const day = today.getDate();
    
    return { month, day };
  }

  /**
   * Convert JavaScript month index (0-11) to our Month enum
   */
  private static getMonthName(monthIndex: number): Month {
    const months: Month[] = [
      Month.January,
      Month.February,
      Month.March,
      Month.April,
      Month.May,
      Month.June,
      Month.July,
      Month.August,
      Month.September,
      Month.October,
      Month.November,
      Month.December,
    ];
    
    return months[monthIndex];
  }

  /**
   * Check if a given month and day matches today
   */
  static isToday(month: Month, day: number): boolean {
    const today = this.getTodayDateInfo();
    return today.month === month && today.day === day;
  }

  /**
   * Format date info for logging
   */
  static formatDateInfo(dateInfo: DateInfo): string {
    return `${dateInfo.month} ${dateInfo.day}`;
  }
}
