import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { AdvertiserRepository } from "../../domain/repositories/AdvertiserRepository";
import { Advertiser } from "../../domain/entities/Advertiser";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

interface TokenPayload {
  advertiserId: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AdvertiserAuthUseCase {
    private readonly accessTokenSecret: Secret;
    private readonly refreshTokenSecret: Secret;

    constructor(private advertiserRepository: AdvertiserRepository) {
        // Validate and set secrets in constructor
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
  
    async registerAdvertiser(advertiserData: Partial<Advertiser>): Promise<void> {
        if (!advertiserData.email || !advertiserData.password) {
            throw new Error("Email and password are required");
        }

        const existingAdvertiser = await this.advertiserRepository.findByEmail(advertiserData.email);
        if (existingAdvertiser) {
            throw new Error("Advertiser already exists with this email.");
        }

        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(advertiserData.password, salt);

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            
            const newAdvertiser: Partial<Advertiser> = {
                ...advertiserData,
                password: hashedPassword,
                otp,
                otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
                isVerified: process.env.NODE_ENV === 'development'
            };

            await this.advertiserRepository.save(newAdvertiser);
        } catch (error) {
            throw new Error(`Registration failed: ${(error as Error).message}`);
        }
    }

    async login(email: string, password: string): Promise<AuthTokens> {
        const advertiser = await this.advertiserRepository.findByEmail(email);
        if (!advertiser || !advertiser.id) {
            throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, advertiser.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        return {
            accessToken: this.generateAccessToken(advertiser.id),
            refreshToken: this.generateRefreshToken(advertiser.id)
        };
    }

    async verifyOtp(email: string, otp: string): Promise<void> {
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

        await this.advertiserRepository.updateAdvertiser(advertiser.id!, {
            isVerified: true,
            otp: undefined,
            otpExpiry: undefined
        });
    }

    private generateAccessToken(advertiserId: string): string {
        const payload: TokenPayload = { advertiserId };
        const options: SignOptions = { expiresIn: '1h' };

        return jwt.sign(payload, this.accessTokenSecret, options);
    }
    
    private generateRefreshToken(advertiserId: string): string {
        const payload: TokenPayload = { advertiserId };
        const options: SignOptions = {
            expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRY || '7d', 10)
        };

        return jwt.sign(payload, this.refreshTokenSecret, options);
    }
}