import { OTP } from "../../domain/entities/otp";
import { IOtpRepository } from "../../interfaces/repositories/otp-repository";
import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiryTime: { type: Date, required: true },
    lastSentAt: { type: Date, required: true }
});

const OTPModel = mongoose.model('OTP', OTPSchema);

export class OTPRepositoryImpl implements IOtpRepository {
    async createOtp(otp: OTP): Promise<void> {
        console.log('💾 Saving OTP:', {
            phoneNumber: otp.phoneNumber,
            email: otp.email,
            otp: otp.otp,
            expiryTime: otp.expiryTime,
            lastSentAt: otp.lastSentAt
        });

        // Delete any existing OTP first
        await OTPModel.deleteOne({ 
            phoneNumber: otp.phoneNumber,
            email: otp.email
        });

        await OTPModel.create({
            phoneNumber: otp.phoneNumber,
            email: otp.email,
            otp: otp.otp,
            expiryTime: otp.expiryTime,
            lastSentAt: otp.lastSentAt
        });
    }

    async findOtp(phoneNumber: string, email: string): Promise<OTP | null> {
        console.log('🔍 Searching for OTP:', { phoneNumber, email });
        const otpDoc = await OTPModel.findOne({ phoneNumber, email });
        console.log('📍 Found OTP:', otpDoc);
        
        if (!otpDoc) {
            console.log('❌ OTP not found');
            return null;
        }

        return new OTP(
            otpDoc.phoneNumber,
            otpDoc.email,
            otpDoc.otp,
            otpDoc.expiryTime,
            otpDoc.lastSentAt
        );
    }

    async deleteOtp(phoneNumber: string, email: string): Promise<void> {
        await OTPModel.deleteOne({ phoneNumber, email });
    }
}