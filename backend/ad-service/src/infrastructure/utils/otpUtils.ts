import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailError extends Error {
    message: string;
    stack?: string;
}

class OtpUtils {
    private static getTransporter() {
        // Create a new transporter each time to avoid connection issues
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            // Debug options
            logger: true,
            debug: process.env.NODE_ENV !== 'production'
        });
    }

    static async sendOTP(email: string, otp: string): Promise<void> {
        try {
            console.log('Starting email configuration check...');
            console.log('Email settings:', {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_SECURE,
                user: process.env.EMAIL_USER ? 'Set' : 'Not set',
                pass: process.env.EMAIL_PASS ? 'Set' : 'Not set'
            });

            // Log the OTP for development purposes
            console.log('🔑 OTP for', email, ':', otp);

            // For development, you can skip actual email sending if needed
            if (process.env.NODE_ENV === 'development' && process.env.SKIP_EMAIL === 'true') {
                console.log('Skipping email in development mode. OTP:', otp);
                return;
            }

            const transporter = this.getTransporter();
            
            await transporter.verify();
            console.log('Transporter verified successfully');

            const mailOptions = {
                from: `"Ad Service" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Email Verification OTP',
                text: `Your verification code is: ${otp}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>Email Verification</h2>
                        <p>Your verification code is:</p>
                        <h1 style="color: #4F46E5; font-size: 32px;">${otp}</h1>
                        <p>This code will expire in 10 minutes.</p>
                    </div>
                `,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ', info.messageId);
        } catch (error) {
            const emailError = error as EmailError;
            console.error('Detailed error in sendOTP:', {
                error: emailError.message,
                stack: emailError.stack,
                emailUser: process.env.EMAIL_USER ? 'Set' : 'Not set',
                emailPass: process.env.EMAIL_PASS ? 'Set' : 'Not set'
            });
            
            // For development, allow registration to continue even if email fails
            if (process.env.NODE_ENV === 'development' && process.env.ALLOW_REGISTRATION_WITHOUT_EMAIL === 'true') {
                console.log('Continuing registration despite email failure (development mode)');
                return;
            }
            
            throw new Error('Failed to send OTP email');
        }
    }

    // ... other OTP related methods
}

export default OtpUtils; 