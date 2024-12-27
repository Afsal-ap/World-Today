import { OTPRepository } from "../../domain/repositories/otp-repository";
import { CompleteRegistrationUseCase } from "./complete-registration";

export class VerifyOtpUseCase {
    constructor(
        private readonly otpRepository: OTPRepository,
        private readonly completeRegistrationUseCase: CompleteRegistrationUseCase
    ) {}

    async execute(email: string, otp: string, userData?: any): Promise<any> {
        console.log('🔍 Verifying OTP:', { email, otp });
        
        const savedOtp = await this.otpRepository.findOTP(email);
        if (!savedOtp) {
            throw new Error('OTP not found');
        }

        if (savedOtp.isExpired()) {
            await this.otpRepository.deleteOTP(email);
            throw new Error('OTP has expired');
        }

        if (savedOtp.otp !== otp) {
            throw new Error('Invalid OTP');
        }

        // Delete the used OTP
        await this.otpRepository.deleteOTP(email);

        // Complete registration if userData exists
        if (userData) {
            console.log('📝 Proceeding with registration:', userData.email);
            return await this.completeRegistrationUseCase.execute(userData);
        }

        return { success: true };
    }
} 