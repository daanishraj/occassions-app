import { Twilio } from 'twilio';
import { logger } from '../../utils/logger';

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

export class TwilioService {
  private twilio: Twilio;
  private fromNumber: string;

  constructor(config: TwilioConfig) {
    this.twilio = new Twilio(config.accountSid, config.authToken);
    this.fromNumber = config.fromNumber;
  }

  async sendSMS(to: string, body: string): Promise<boolean> {
    try {
      const message = await this.twilio.messages.create({
        body,
        from: this.fromNumber,
        to,
      });

      logger.info(`SMS sent successfully to ${to}. Message SID: ${message.sid}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send SMS to ${to}:`, error);
      return false;
    }
  }
}

// Create service using environment variables
export const createTwilioService = (): TwilioService => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER environment variables are required');
  }

  const config: TwilioConfig = {
    accountSid,
    authToken,
    fromNumber,
  };

  return new TwilioService(config);
};
