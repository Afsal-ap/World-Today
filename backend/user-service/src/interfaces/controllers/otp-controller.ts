import { Request, Response } from 'express';
import { SendOtpUseCase } from '../../application/use-cases/sendOtpUsecase';
import { VerifyOtpUseCase } from '../../application/use-cases/verify-otp';

export class OTPController {
    constructor(
        private readonly sendOtpUseCase: SendOtpUseCase,
        private readonly verifyOtpUseCase: VerifyOtpUseCase
    ) {}

    async sendOtp(req: Request, res: Response): Promise<void> {
        try {
            const { phoneNumber, email } = req.body;
            console.log('📞 Sending OTP to:', phoneNumber);
            if (!phoneNumber) {
                res.status(400).json({ success: false, message: "Phone number is required" });
                return;
            }

            await this.sendOtpUseCase.execute(phoneNumber, email);
            res.status(200).json({ 
                success: true, 
                message: "OTP sent successfully to your phone" 
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { phoneNumber, email, otp } = req.body;
            console.log('📝 Verifying OTP with data:', { phoneNumber, email, otp });

            if (!phoneNumber || !email || !otp) {
                res.status(400).json({
                    success: false,
                    message: 'Phone number, email and OTP are required'
                });
                return;
            }

            const result = await this.verifyOtpUseCase.execute(phoneNumber, email, otp);
            res.status(200).json({
                success: true,
                message: 'OTP verified successfully',
                data: result
            });
        } catch (error: any) {
            console.error('❌ OTP Verification Error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}