import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

export class SmsService {
    private readonly client: twilio.Twilio;
    private readonly fromNumber: string;

    constructor() {
        // Get Twilio credentials from environment variables
        const accountSid = this.getRequiredEnv('TWILIO_ACCOUNT_SID');
        const authToken = this.getRequiredEnv('TWILIO_AUTH_TOKEN');
        this.fromNumber = this.getRequiredEnv('TWILIO_PHONE_NUMBER');

        this.client = twilio(accountSid, authToken);
   
        // For testing purposes only
        if (process.env.NODE_ENV === 'test') {
            this.client = twilio('ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', process.env.TWILIO_AUTH_TOKEN);
            this.fromNumber = '+15005550006'; // Twilio test number
        }
    }

    private getRequiredEnv(key: string): string {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
        return value;
    }

    async sendOTP(to: string, otp: string): Promise<void> {
        try {
            // Validate that 'to' and 'from' numbers are different
            if (to === this.fromNumber) {
                throw new Error(`Cannot send SMS to the same number as the sender. From: ${this.fromNumber}, To: ${to}`);
            }

            // Validate phone number format
            if (!this.isValidPhoneNumber(to)) {
                throw new Error(`Invalid phone number format: ${to}`);
            }

            const message = await this.client.messages.create({
                body: `Your OTP is: ${otp}`,
                from: this.fromNumber,
                to: to
            });

            console.log('📱 SMS sent successfully. SID:', message.sid);
        } catch (error) {
            console.error('📱 Failed to send SMS:', error);
            throw new Error('Failed to send OTP via SMS');
        }
    }

    private isValidPhoneNumber(phoneNumber: string): boolean {
        // Validate E.164 format
        return /^\+[1-9]\d{1,14}$/.test(phoneNumber);
    }
}
