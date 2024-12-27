import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
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
  private static otpStore = new Map<string, { otp: string; expiresAt: number }>();

  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendOTP(email: string, channelName: string): Promise<string> {
    const otp = this.generateOTP();
    
    // Store OTP with 5 minutes expiration
    this.otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    // Email template
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Channel Registration OTP Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Channel Registration Verification</h2>
          <p>Hello ${channelName},</p>
          <p>Your OTP for channel registration is:</p>
          <h1 style="color: #4C1D95; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px;">
            ${otp}
          </h1>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return otp;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP email');
    }
  }

  static verifyOTP(email: string, userOtp: string): boolean {
    const storedData = this.otpStore.get(email);
    
    if (!storedData) {
      return false;
    }

    if (Date.now() > storedData.expiresAt) {
      this.otpStore.delete(email);
      return false;
    }

    if (storedData.otp === userOtp) {
      this.otpStore.delete(email);
      return true;
    }

    return false;
  }
} 