import { OTP } from "../entities/otp";

export interface OTPRepository {
    saveOTP(otp: OTP): Promise<void>;
    deleteOTP(phoneNumber: string): Promise<void>;
    findOTP(phoneNumber: string): Promise<OTP | null>;
}     