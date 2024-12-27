import mongoose, { Schema, Document } from "mongoose";

export interface AdvertiserDocument extends Document {
    companyName: string;
    contactPersonName: string;
    email: string;
    phoneNumber: string;
    password: string;
    refreshToken?: string;
    isVerified: boolean;
    otp: string;
    otpExpiry: Date;
}

const AdvertiserSchema = new Schema<AdvertiserDocument>({
    companyName: { type: String, required: true },
    contactPersonName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false }
});

export default mongoose.model<AdvertiserDocument>("Advertiser", AdvertiserSchema); 