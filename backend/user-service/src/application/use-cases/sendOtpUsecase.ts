import { OTP } from "../../domain/entities/otp";
import { IOtpRepository } from "../../interfaces/repositories/otp-repository";
import { SmsService } from "../../infrastructure/services/sms-service";

export class SendOtpUseCase {
    private readonly COOLDOWN_PERIOD = 30; // 30 seconds

    constructor(
        private readonly otpRepository: IOtpRepository,
        private readonly smsService: SmsService
    ) {}

    async execute(phoneNumber: string, email: string): Promise<void> {
        try { 
            console.log('Original phone number:', phoneNumber);
            // Clean and format phone number
            const formattedPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
            console.log('Formatted phone number:', formattedPhoneNumber);
            // Ensure it starts with +
            const cleanedPhoneNumber = formattedPhoneNumber.startsWith('+') 
                ? formattedPhoneNumber 
                : `+${formattedPhoneNumber}`;

            if (!this.isValidPhoneNumber(cleanedPhoneNumber)) {
                throw new Error('Invalid phone number format. Please include country code (e.g., +91XXXXXXXXXX)');
            }

            // Check if there's an existing OTP and it's within cooldown period
            const existingOtp = await this.otpRepository.findOtp(cleanedPhoneNumber, email);
            if (existingOtp) {
                const secondsSinceLastOtp = 
                    (Date.now() - existingOtp.expiryTime.getTime() + (5 * 60 * 1000)) / 1000;
                
                if (secondsSinceLastOtp < this.COOLDOWN_PERIOD) {
                    const remainingTime = Math.ceil(this.COOLDOWN_PERIOD - secondsSinceLastOtp);
                    throw new Error(`Please wait ${remainingTime} seconds before requesting a new OTP`);
                }
            }

            // Generate 6-digit OTP
            const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
            console.log('🔐 Generated OTP for', cleanedPhoneNumber, ':', otpValue);
            
            // Create OTP entity with email
            const otp = new OTP(cleanedPhoneNumber, email, otpValue);

            // Save OTP to repository
            await this.otpRepository.createOtp(otp);
            console.log('💾 OTP saved to repository for:', cleanedPhoneNumber);

            // Send OTP via SMS
            try {
                await this.smsService.sendOTP(cleanedPhoneNumber, otpValue);
                console.log('📱 OTP SMS sent successfully to:', cleanedPhoneNumber);
            } catch (error) {
                console.error('📱 Failed to send OTP SMS:', error);
                await this.otpRepository.deleteOtp(cleanedPhoneNumber, email);
                throw new Error('Failed to send OTP SMS: ' + (error as Error).message);
            }
        } catch (error) {
            console.error('❌ SendOtpUseCase error:', error);
            throw error;
        }
    }

    private isValidPhoneNumber(phoneNumber: string): boolean {
        // Validate E.164 format: + followed by country code and subscriber number
        const cleaned = phoneNumber.trim();
        
        // Check if it starts with +
        if (!cleaned.startsWith('+')) {
            console.log('Phone number validation failed: Missing + prefix');
            return false;
        }
     
        // Remove the + and check if the remaining characters are all digits
        const numbersOnly = cleaned.slice(1);
        if (!/^\d{10,14}$/.test(numbersOnly)) {
            console.log('Phone number validation failed: Invalid length or non-digit characters');
            return false;
        }

        // Additional logging
        console.log('Phone number validation passed:', cleaned);
        return true;
    }
}