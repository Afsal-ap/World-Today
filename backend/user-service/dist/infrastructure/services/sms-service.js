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
exports.SmsService = void 0;
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class SmsService {
    constructor() {
        // Get Twilio credentials from environment variables
        const accountSid = this.getRequiredEnv('TWILIO_ACCOUNT_SID');
        const authToken = this.getRequiredEnv('TWILIO_AUTH_TOKEN');
        this.fromNumber = this.getRequiredEnv('TWILIO_PHONE_NUMBER');
        this.client = (0, twilio_1.default)(accountSid, authToken);
        // For testing purposes only
        if (process.env.NODE_ENV === 'test') {
            this.client = (0, twilio_1.default)('ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', process.env.TWILIO_AUTH_TOKEN);
            this.fromNumber = '+15005550006'; // Twilio test number
        }
    }
    getRequiredEnv(key) {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
        return value;
    }
    sendOTP(to, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate that 'to' and 'from' numbers are different
                if (to === this.fromNumber) {
                    throw new Error(`Cannot send SMS to the same number as the sender. From: ${this.fromNumber}, To: ${to}`);
                }
                // Validate phone number format
                if (!this.isValidPhoneNumber(to)) {
                    throw new Error(`Invalid phone number format: ${to}`);
                }
                const message = yield this.client.messages.create({
                    body: `Your OTP is: ${otp}`,
                    from: this.fromNumber,
                    to: to
                });
                console.log('📱 SMS sent successfully. SID:', message.sid);
            }
            catch (error) {
                console.error('📱 Failed to send SMS:', error);
                throw new Error('Failed to send OTP via SMS');
            }
        });
    }
    isValidPhoneNumber(phoneNumber) {
        // Validate E.164 format
        return /^\+[1-9]\d{1,14}$/.test(phoneNumber);
    }
}
exports.SmsService = SmsService;
