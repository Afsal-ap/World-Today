import { OTP } from "../../domain/entities/otp";
import { OTPRepository } from "../../domain/repositories/otp-repository";
import { EmailService } from "../../infrastructure/services/email-service";

export class SendOtpUseCase {
    private readonly COOLDOWN_PERIOD = 30; // 30 seconds

    constructor(
        private readonly otpRepository: OTPRepository,
        private readonly emailService: EmailService
    ) {}

    async execute(email: string): Promise<void> {
        try {
            // Check if there's an existing OTP and it's within cooldown period
            const existingOtp = await this.otpRepository.findOTP(email);
            if (existingOtp) {
                const secondsSinceLastOtp = 
                    (Date.now() - existingOtp.expiryTime.getTime() + (5 * 60 * 1000)) / 1000;
                
                if (secondsSinceLastOtp < this.COOLDOWN_PERIOD) {
                    const remainingTime = Math.ceil(this.COOLDOWN_PERIOD - secondsSinceLastOtp);
                    throw new Error(`Please wait ${remainingTime} seconds before requesting a new OTP`);
                }
            }

            // Validate email
            if (!this.isValidEmail(email)) {
                throw new Error('Invalid email format');
            }

            // Generate 6-digit OTP
            const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
            console.log('🔐 Generated OTP for', email, ':', otpValue);
            
            // Create OTP entity
            const otp = new OTP(email, otpValue);

            // Save OTP to repository
            await this.otpRepository.saveOTP(otp);
            console.log('💾 OTP saved to repository for:', email);

            // Send OTP via email
            try {
                await this.emailService.sendOTPEmail(email, otpValue);
                console.log('✉️ OTP email sent successfully to:', email);
            } catch (error) {
                console.error('📧 Failed to send OTP email:', error);
                await this.otpRepository.deleteOTP(email);
                throw new Error('Failed to send OTP email: ' + (error as Error).message);
            }
        } catch (error) {
            console.error('❌ SendOtpUseCase error:', error);
            throw error;
        }
    }

    private isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}