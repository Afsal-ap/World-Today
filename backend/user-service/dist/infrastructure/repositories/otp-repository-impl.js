"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPRepositoryImpl = void 0;
const otp_1 = require("../../domain/entities/otp");
const mongoose_1 = __importDefault(require("mongoose"));
const OTPSchema = new mongoose_1.default.Schema({
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiryTime: { type: Date, required: true },
    lastSentAt: { type: Date, required: true }
});
const OTPModel = mongoose_1.default.model('OTP', OTPSchema);
class OTPRepositoryImpl {
    createOtp(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('💾 Saving OTP:', {
                phoneNumber: otp.phoneNumber,
                email: otp.email,
                otp: otp.otp,
                expiryTime: otp.expiryTime,
                lastSentAt: otp.lastSentAt
            });
            // Delete any existing OTP first
            yield OTPModel.deleteOne({
                phoneNumber: otp.phoneNumber,
                email: otp.email
            });
            yield OTPModel.create({
                phoneNumber: otp.phoneNumber,
                email: otp.email,
                otp: otp.otp,
                expiryTime: otp.expiryTime,
                lastSentAt: otp.lastSentAt
            });
        });
    }
    findOtp(phoneNumber, email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('🔍 Searching for OTP:', { phoneNumber, email });
            const otpDoc = yield OTPModel.findOne({ phoneNumber, email });
            console.log('📍 Found OTP:', otpDoc);
            if (!otpDoc) {
                console.log('❌ OTP not found');
                return null;
            }
            return new otp_1.OTP(otpDoc.phoneNumber, otpDoc.email, otpDoc.otp, otpDoc.expiryTime, otpDoc.lastSentAt);
        });
    }
    deleteOtp(phoneNumber, email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield OTPModel.deleteOne({ phoneNumber, email });
        });
    }
}
exports.OTPRepositoryImpl = OTPRepositoryImpl;
