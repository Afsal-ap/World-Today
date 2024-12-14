import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/register-user';
import { LoginUserUseCase } from '../../application/use-cases/login-user';
import { AuthService } from '../../domain/services/auth-service';
import { SendOtpUseCase } from '../../application/use-cases/sendOtpUsecase';
import { VerifyOtpUseCase } from '../../application/use-cases/verify-otp';

export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUserUseCase,
        private readonly loginUseCase: LoginUserUseCase,
        private readonly authService: AuthService,
        private readonly sendOtpUseCase: SendOtpUseCase,
        private readonly verifyOtpUseCase: VerifyOtpUseCase
    ) {}

    async register(req: Request, res: Response): Promise<void> {
        try {
            // Register the user
            const result = await this.registerUseCase.execute(req.body);
            
            // Immediately send OTP after successful registration
            try {
                await this.sendOtpUseCase.execute(req.body.email);
                console.log('✉️ OTP sent after registration to:', req.body.email);
            } catch (otpError) {
                console.error('Failed to send initial OTP:', otpError);
                // Even if OTP sending fails, we still return the registration data
                // but include a warning in the response
                res.status(201).json({
                    ...result,
                    warning: "Registration successful but failed to send OTP. Please use 'Resend OTP' option."
                });
                return;
            }

            // If everything succeeds, send the success response
            res.status(201).json({
                ...result,
                message: "Registration successful and OTP sent"
            });
        } catch (error: any) {
            console.error('Registration error:', error);
            res.status(400).json({ error: error.message });
        }
    }  

    async login(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.loginUseCase.execute(req.body);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const { refreshToken } = req.body;
            const newAccessToken = await this.authService.generateAccessTokenFromRefreshToken(refreshToken);
            res.status(200).json({ accessToken: newAccessToken });
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    } 

    async sendOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body; 

            await this.sendOtpUseCase.execute(email);
            res.status(200).json({ success: true, message: "OTP sent successfully" });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;
            await this.verifyOtpUseCase.execute(email, otp);
            res.status(200).json({ success: true, message: "OTP verified successfully" });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
} 



