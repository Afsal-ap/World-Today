import { IOtpRepository } from '../../interfaces/repositories/otp-repository';
import { IOtp } from '../../domain/entities/otp';

export interface VerifyOtpUseCase {
    execute(phoneNumber: string, email: string, otp: string): Promise<boolean>;
}

export class VerifyOtp implements VerifyOtpUseCase {
    constructor(
        private readonly otpRepository: IOtpRepository
    ) {}

    async execute(phoneNumber: string, email: string, otp: string): Promise<boolean> {
        const foundOtp = await this.otpRepository.findOtp(phoneNumber, email);
        
        if (!foundOtp) {
            throw new Error('OTP not found');
        }

        if (foundOtp.otp !== otp) {
            throw new Error('Invalid OTP');
        }

        if (foundOtp.isExpired()) {
            throw new Error('OTP has expired');
        }

        await this.otpRepository.deleteOtp(phoneNumber, email);
        
        return true;
    }
} 