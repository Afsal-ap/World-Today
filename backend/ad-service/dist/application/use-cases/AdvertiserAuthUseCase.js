"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertiserAuthUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AdvertiserAuthUseCase {
    constructor(advertiserRepository) {
        this.advertiserRepository = advertiserRepository;
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        if (!accessSecret) {
            throw new Error("ACCESS_TOKEN_SECRET is not configured in environment variables");
        }
        if (!refreshSecret) {
            throw new Error("REFRESH_TOKEN_SECRET is not configured in environment variables");
        }
        this.accessTokenSecret = accessSecret;
        this.refreshTokenSecret = refreshSecret;
    }
    async registerAdvertiser(advertiserData) {
        if (!advertiserData.email || !advertiserData.password) {
            throw new Error("Email and password are required");
        }
        const existingAdvertiser = await this.advertiserRepository.findByEmail(advertiserData.email);
        if (existingAdvertiser) {
            throw new Error("Advertiser already exists with this email.");
        }
        try {
            const salt = await bcrypt_1.default.genSalt(10);
            const hashedPassword = await bcrypt_1.default.hash(advertiserData.password, salt);
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const newAdvertiser = {
                ...advertiserData,
                password: hashedPassword,
                otp,
                otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
                isVerified: process.env.NODE_ENV === 'development'
            };
            await this.advertiserRepository.save(newAdvertiser);
        }
        catch (error) {
            throw new Error(`Registration failed: ${error.message}`);
        }
    }
    async login(email, password) {
        const advertiser = await this.advertiserRepository.findByEmail(email);
        if (!advertiser || !advertiser.id) {
            throw new Error("Invalid email or password");
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, advertiser.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        return {
            accessToken: this.generateAccessToken(advertiser.id),
            refreshToken: this.generateRefreshToken(advertiser.id)
        };
    }
    async verifyOtp(email, otp) {
        const advertiser = await this.advertiserRepository.findByEmail(email);
        if (!advertiser) {
            throw new Error("Advertiser not found");
        }
        if (advertiser.isVerified) {
            throw new Error("Email already verified");
        }
        if (!advertiser.otp) {
            throw new Error("No OTP found for this account");
        }
        if (advertiser.otp !== otp) {
            throw new Error("Invalid OTP");
        }
        if (advertiser.otpExpiry && new Date() > new Date(advertiser.otpExpiry)) {
            throw new Error("OTP has expired. Please request a new one");
        }
        await this.advertiserRepository.updateAdvertiser(advertiser.id, {
            isVerified: true,
            otp: undefined,
            otpExpiry: undefined
        });
    }
    generateAccessToken(advertiserId) {
        const payload = { advertiserId };
        const options = { expiresIn: '1h' };
        return jsonwebtoken_1.default.sign(payload, this.accessTokenSecret, options);
    }
    generateRefreshToken(advertiserId) {
        const payload = { advertiserId };
        const options = {
            expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRY || '7d', 10)
        };
        return jsonwebtoken_1.default.sign(payload, this.refreshTokenSecret, options);
    }
}
exports.AdvertiserAuthUseCase = AdvertiserAuthUseCase;
//# sourceMappingURL=AdvertiserAuthUseCase.js.map