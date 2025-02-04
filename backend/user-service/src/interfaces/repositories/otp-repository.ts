import { OTP } from "../../domain/entities/otp";

export interface IOtpRepository {
    createOtp(otp: OTP): Promise<void>;
    findOtp(phoneNumber: string, email: string): Promise<OTP | null>;
    deleteOtp(phoneNumber: string, email: string): Promise<void>;
} 