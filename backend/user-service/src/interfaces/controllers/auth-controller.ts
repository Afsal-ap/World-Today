import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/register-user';
import { LoginUserUseCase } from '../../application/use-cases/login-user';
import { AuthService } from '../../domain/services/auth-service';
import { SendOtpUseCase } from '../../application/use-cases/sendOtpUsecase';
import { VerifyOtpUseCase } from '../../application/use-cases/verify-otp';
import { CompleteRegistrationUseCase } from '../../application/use-cases/complete-registration';

export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUserUseCase,
        private readonly loginUseCase: LoginUserUseCase,
        private readonly authService: AuthService,
        private readonly sendOtpUseCase: SendOtpUseCase,
        private readonly verifyOtpUseCase: VerifyOtpUseCase,
        private readonly completeRegistrationUseCase: CompleteRegistrationUseCase
    ) {}
    
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { phone, email, password, name } = req.body;
            
            // First step: Register user (hash password, etc.)
            const registrationData = await this.registerUseCase.execute({
                email,
                password,
                name,
                phone
            });

            // Second step: Complete registration (save user to database)
            const result = await this.completeRegistrationUseCase.execute({
                email,
                password,
                name,
                phone
            });

            // Send OTP
            try {
                await this.sendOtpUseCase.execute(phone, email);
                console.log('✉️ OTP sent after registration to:', email);
                
                res.status(201).json({
                    success: true,
                    data: result,
                    message: "Registration successful and OTP sent"
                });
            } catch (otpError) {
                console.error('Failed to send initial OTP:', otpError);
                res.status(201).json({
                    success: true,
                    data: result,
                    warning: "Registration successful but failed to send OTP"
                });
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }  

    async login(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.loginUseCase.execute(req.body);
            
            if (result.user.isBlocked) {
                res.status(403).json({ 
                    success: false, 
                    error: 'Your account has been blocked. Please contact support.' 
                });
                return;
            }
            
            // Set refresh token in cookie
            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(200).json({
                success: true,
                user: result.user,
                tokens: {
                    accessToken: result.tokens.accessToken,
                    refreshToken: result.tokens.refreshToken
                }
            });
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                throw new Error('Refresh token is required');
            }

            const newAccessToken = await this.authService.generateAccessTokenFromRefreshToken(refreshToken);
            
            res.status(200).json({ 
                success: true,
                accessToken: newAccessToken 
            });
        } catch (error: any) {
            res.status(401).json({ 
                success: false,
                error: error.message 
            });
        }
    }

    async sendOtp(req: Request, res: Response): Promise<void> {
        try {
            const { phoneNumber, email } = req.body;
            console.log('📞 Sending OTP to:', phoneNumber);
            if (!phoneNumber || !email) {
                res.status(400).json({ 
                    success: false, 
                    message: "Phone number and email are required" 
                });
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

            // Verify OTP
            const result = await this.verifyOtpUseCase.execute(phoneNumber, email, otp);
            
            if (result) {
                // Generate tokens and get user data
                const user = await this.authService.getUserByPhoneNumber(phoneNumber);
                const tokens = await this.authService.generateTokens(user);
                
                res.status(200).json({
                    success: true,
                    message: "OTP verified successfully",
                    tokens: tokens,
                    user: user
                });
            } else {
                throw new Error('OTP verification failed');
            }
        } catch (error: any) {
            console.error('❌ OTP Verification Error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
} 



