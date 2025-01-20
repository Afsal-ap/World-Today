import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD   
  },
  debug: true     
});

// Add a verification step
transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP server connection error:", error);
  } else {
    console.log("SMTP server connection successful");
  }
});

export class OtpService {
  private static otpStore = new Map<string, { otp: string; timestamp: number }>();

  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendOTP(email: string, channelName: string): Promise<void> {
    const otp = this.generateOTP();
    console.log('Generated OTP for', email, ':', otp);

    // Store OTP with timestamp
    this.otpStore.set(email, {
      otp,
      timestamp: Date.now()
    });

    // TODO: Implement actual email sending here
    console.log(`Email would be sent to ${email} with OTP: ${otp}`);
  }

  static verifyOTP(email: string, submittedOTP: string): boolean {
    const storedData = this.otpStore.get(email);
    console.log('Verifying OTP:', { 
      email, 
      submittedOTP, 
      storedOTP: storedData?.otp 
    });

    if (!storedData) {
      console.log('No OTP found for email:', email);
      return false;
    }

    // Check if OTP is expired (5 minutes)
    if (Date.now() - storedData.timestamp > 5 * 60 * 1000) {
      console.log('OTP expired for email:', email);
      this.otpStore.delete(email);
      return false;
    }

    const isValid = storedData.otp === submittedOTP;
    console.log('OTP validation result:', isValid);

    if (isValid) {
      this.otpStore.delete(email); // Remove OTP after successful verification
    }

    return isValid;
  }
} 