import { OTP } from "../../domain/entities/otp";
import { OTPRepository } from "../../domain/repositories/otp-repository";
import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiryTime: { type: Date, required: true }
});

const OTPModel = mongoose.model('OTP', OTPSchema);

export class OTPRepositoryImpl implements OTPRepository {
    async saveOTP(otp: OTP): Promise<void> {
        console.log('💾 Saving OTP to database:', {
            email: otp.email,
            otp: otp.otp
        });
        await OTPModel.create({
            email: otp.email,
            otp: otp.otp,
            expiryTime: otp.expiryTime
        });
    }

    async findOTP(email: string): Promise<OTP | null> {
        const otpDoc = await OTPModel.findOne({ email });
        if (!otpDoc) return null;
        return new OTP(otpDoc.email, otpDoc.otp, otpDoc.expiryTime);
    }

    async deleteOTP(email: string): Promise<void> {
        await OTPModel.deleteOne({ email });
    }
}