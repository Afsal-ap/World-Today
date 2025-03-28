"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class OtpUtils {
    static getTransporter() {
        return nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            logger: true,
            debug: process.env.NODE_ENV !== 'production'
        });
    }
    static async sendOTP(email, otp) {
        try {
            console.log('Starting email configuration check...');
            console.log('Email settings:', {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_SECURE,
                user: process.env.EMAIL_USER ? 'Set' : 'Not set',
                pass: process.env.EMAIL_PASS ? 'Set' : 'Not set'
            });
            console.log('🔑 OTP for', email, ':', otp);
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
        }
        catch (error) {
            const emailError = error;
            console.error('Detailed error in sendOTP:', {
                error: emailError.message,
                stack: emailError.stack,
                emailUser: process.env.EMAIL_USER ? 'Set' : 'Not set',
                emailPass: process.env.EMAIL_PASS ? 'Set' : 'Not set'
            });
            if (process.env.NODE_ENV === 'development' && process.env.ALLOW_REGISTRATION_WITHOUT_EMAIL === 'true') {
                console.log('Continuing registration despite email failure (development mode)');
                return;
            }
            throw new Error('Failed to send OTP email');
        }
    }
}
exports.default = OtpUtils;
//# sourceMappingURL=otpUtils.js.map