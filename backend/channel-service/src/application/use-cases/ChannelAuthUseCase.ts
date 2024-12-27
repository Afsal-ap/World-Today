import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ChannelRepository } from "../../domain/repositories/ChannelRepository";
import { RegisterChannelDTO } from "../dto/ChannelAuthDTO";
import { v4 as uuidv4 } from 'uuid'; 
import { LoginDTO } from "../dto/ChannelAuthDTO";
import { OtpService } from '../../infrastructure/utils/otpUtils';

export class ChannelAuthUseCase {
  constructor(private channelRepository: ChannelRepository) {}

  async registerChannel(data: RegisterChannelDTO & { logo: { path: string; filename: string } }): Promise<void> {
    const existingChannel = await this.channelRepository.findByEmail(data.email);
    if (existingChannel) {
      throw new Error("Channel already exists with this email.");
    }

    await OtpService.sendOTP(data.email, data.channelName);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const channel = {
      id: uuidv4(),
      password: hashedPassword,
      channelName: data.channelName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      governmentId: data.governmentId,
      logo: {
        path: data.logo.path,
        filename: data.logo.filename
      },
      websiteOrSocialLink: data.websiteOrSocialLink,
      isVerified: false,
    };      

    await this.channelRepository.createChannel(channel);
  }

  async verifyOTP(email: string, otp: string): Promise<void> {
    const isValid = OtpService.verifyOTP(email, otp);
    if (!isValid) {
      throw new Error('Invalid or expired OTP');
    }

    const channel = await this.channelRepository.findByEmail(email);
    if (!channel) {
      throw new Error('Channel not found');
    }

    await this.channelRepository.updateChannel(channel.id!, { isVerified: true });
  }

  async login(data: LoginDTO): Promise<{ accessToken: string; refreshToken: string }> {
    const channel = await this.channelRepository.findByEmail(data.email);
    if (!channel) throw new Error("Channel not found.");
      
    if (!channel.id) {
      throw new Error("Channel ID is missing.");
    } 

    const isPasswordValid = await bcrypt.compare(data.password, channel.password);
    if (!isPasswordValid) throw new Error("Invalid credentials.");

    const accessToken = this.generateAccessToken(channel.id);
    const refreshToken = this.generateRefreshToken(channel.id);
     
    if (!refreshToken) {
      throw new Error("Failed to generate refresh token.");
    }
    
    await this.channelRepository.updateChannel(channel.id, { refreshToken });
    return { accessToken, refreshToken };
  }

  private generateAccessToken(channelId: string): string {
    return jwt.sign({ channelId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: process.env.TOKEN_EXPIRY });
  }

  private generateRefreshToken(channelId: string): string {
    return jwt.sign({ channelId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
  }
}
