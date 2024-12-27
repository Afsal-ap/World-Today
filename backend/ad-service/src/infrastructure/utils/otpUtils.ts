import nodemailer from 'nodemailer';

export class OtpService {
    private static transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        debug: true
    });

    static async sendOTP(email: string, companyName: string): Promise<string> {
        try {
            console.log('Starting OTP send process...');
            console.log('Email configuration:', {
                from: process.env.EMAIL_USER,
                to: email
            });

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            console.log('🔑 OTP for', email, ':', otp);
            
            await this.transporter.verify();
            console.log('Transporter verified successfully');

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Verify Your Email - Ad Service',
                html: `
                    <h1>Email Verification</h1>
                    <p>Hello ${companyName},</p>
                    <p>Your OTP for email verification is: <strong>${otp}</strong></p>
                    <p>This OTP will expire in 10 minutes.</p>
                `
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', {
                messageId: info.messageId,
                response: info.response
            });

            return otp;

        } catch (err: unknown) {
            const error = err as Error;
            console.error('Detailed error in sendOTP:', {
                error: error.message,
                stack: error.stack,
                emailUser: process.env.EMAIL_USER ? 'Set' : 'Not set',
                emailPass: process.env.EMAIL_PASSWORD ? 'Set' : 'Not set'
            });
            throw new Error('Failed to send OTP email');
        }
    }
} 