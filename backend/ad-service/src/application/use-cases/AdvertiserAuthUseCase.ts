import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AdvertiserRepository } from "../../domain/repositories/AdvertiserRepository";
import { RegisterAdvertiserDTO, LoginDTO } from "../dto/AdvertiserAuthDTO";
import { v4 as uuidv4 } from 'uuid';
import { OtpService } from '../../infrastructure/utils/otpUtils'


export class AdvertiserAuthUseCase {
    constructor(private advertiserRepository: AdvertiserRepository) {}
  
    async registerAdvertiser(data: RegisterAdvertiserDTO): Promise<void> {
        const existingAdvertiser = await this.advertiserRepository.findByEmail(data.email);
        if (existingAdvertiser) {
            throw new Error("Advertiser already exists with this email.");
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        try {
            // Send OTP first
            await OtpService.sendOTP(data.email, data.companyName);

            // If email sent successfully, save user with OTP
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const advertiser = {
                id: uuidv4(),
                ...data,
                password: hashedPassword,
                isVerified: false,
                otp,
                otpExpiry
            };

            await this.advertiserRepository.createAdvertiser(advertiser);
        } catch (error) {
            console.error('Error in registerAdvertiser:', error);
            throw new Error('Failed to register advertiser');
        }
    }

    async login(data: LoginDTO): Promise<{ accessToken: string; refreshToken: string }> {
        const advertiser = await this.advertiserRepository.findByEmail(data.email);
        if (!advertiser) throw new Error("Advertiser not found.");

        if (!advertiser.id) {
            throw new Error("Advertiser ID is missing.");
        }

        const isPasswordValid = await bcrypt.compare(data.password, advertiser.password);
        if (!isPasswordValid) throw new Error("Invalid credentials.");

        const accessToken = this.generateAccessToken(advertiser.id);
        const refreshToken = this.generateRefreshToken(advertiser.id);

        await this.advertiserRepository.updateAdvertiser(advertiser.id, { refreshToken });
        return { accessToken, refreshToken };
    }

    private generateAccessToken(advertiserId: string): string {
        return jwt.sign({ advertiserId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: process.env.TOKEN_EXPIRY });
    }

    private generateRefreshToken(advertiserId: string): string {
        return jwt.sign({ advertiserId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
    }
} 