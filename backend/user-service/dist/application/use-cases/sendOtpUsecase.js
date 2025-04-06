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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendOtpUseCase = void 0;
const otp_1 = require("../../domain/entities/otp");
class SendOtpUseCase {
    constructor(otpRepository, smsService) {
        this.otpRepository = otpRepository;
        this.smsService = smsService;
        this.COOLDOWN_PERIOD = 30; // 30 seconds
    }
    execute(phoneNumber, email) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const existingOtp = yield this.otpRepository.findOtp(cleanedPhoneNumber, email);
                if (existingOtp) {
                    const secondsSinceLastOtp = (Date.now() - existingOtp.expiryTime.getTime() + (5 * 60 * 1000)) / 1000;
                    if (secondsSinceLastOtp < this.COOLDOWN_PERIOD) {
                        const remainingTime = Math.ceil(this.COOLDOWN_PERIOD - secondsSinceLastOtp);
                        throw new Error(`Please wait ${remainingTime} seconds before requesting a new OTP`);
                    }
                }
                // Generate 6-digit OTP
                const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
                console.log('🔐 Generated OTP for', cleanedPhoneNumber, ':', otpValue);
                // Create OTP entity with email
                const otp = new otp_1.OTP(cleanedPhoneNumber, email, otpValue);
                // Save OTP to repository
                yield this.otpRepository.createOtp(otp);
                console.log('💾 OTP saved to repository for:', cleanedPhoneNumber);
                // Send OTP via SMS
                try {
                    yield this.smsService.sendOTP(cleanedPhoneNumber, otpValue);
                    console.log('📱 OTP SMS sent successfully to:', cleanedPhoneNumber);
                }
                catch (error) {
                    console.error('📱 Failed to send OTP SMS:', error);
                    yield this.otpRepository.deleteOtp(cleanedPhoneNumber, email);
                    throw new Error('Failed to send OTP SMS: ' + error.message);
                }
            }
            catch (error) {
                console.error('❌ SendOtpUseCase error:', error);
                throw error;
            }
        });
    }
    isValidPhoneNumber(phoneNumber) {
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
exports.SendOtpUseCase = SendOtpUseCase;
