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
            const { email } = req.body;
            
            if (!email) {
                res.status(400).json({ success: false, message: "Email is required" });
                return;
            }

            await this.sendOtpUseCase.execute(email);
            res.status(200).json({ 
                success: true, 
                message: "OTP sent successfully to your email" 
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp, userData } = req.body;
            console.log('📝 Verifying OTP with data:', { email, otp, userData });

            if (!email || !otp) {
                res.status(400).json({
                    success: false,
                    message: 'Email and OTP are required'
                });
                return;
            }

            const result = await this.verifyOtpUseCase.execute(email, otp, userData);
            
            res.status(200).json({
                success: true,
                message: 'OTP verified and registration completed',
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