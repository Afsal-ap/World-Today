import { OTP } from "../entities/otp";

export interface OTPRepository {
    saveOTP(otp: OTP): Promise<void>;
    deleteOTP(email: string): Promise<void>;
    findOTP(email: string): Promise<OTP | null>;
}