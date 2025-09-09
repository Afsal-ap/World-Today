import bcrypt from "bcrypt";
import jwt ,{ SignOptions } from "jsonwebtoken";
import { ChannelRepository } from "../../domain/repositories/ChannelRepository";
import { RegisterChannelDTO } from "../dto/ChannelAuthDto";
import { v4 as uuidv4 } from 'uuid'; 
import { LoginDTO } from "../dto/ChannelAuthDto";
import { OtpService } from '../../infrastructure/utils/otpUtils';

export class ChannelAuthUseCase {
  private pendingRegistrations = new Map<string, any>();
      
  constructor(
    private channelRepository: ChannelRepository,
  ) {}

  async registerChannel(data: RegisterChannelDTO & { logo: { path: string; filename: string } }): Promise<void> {
    const existingChannel = await this.channelRepository.findByEmail(data.email);
    if (existingChannel) {
      throw new Error("Channel already exists with this email.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const channelData = {
      id: uuidv4(),
      password: hashedPassword,
      channelName: data.channelName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      governmentId: data.governmentId,
      logo: data.logo.path,
      websiteOrSocialLink: data.websiteOrSocialLink,
      isVerified: false,
    };

    // Store pending registration
    this.pendingRegistrations.set(data.email, channelData);
    
    // Send OTP and log it
    console.log('Sending OTP for new registration:', data.email);
    await OtpService.sendOTP(data.email, data.channelName);
  }

  async verifyOTP(email: string, otp: string): Promise<void> {
    console.log('Attempting to verify OTP:', { email, otp });
    const isValid = OtpService.verifyOTP(email, otp);
    
    if (!isValid) {
      console.log('OTP verification failed for:', email);
      throw new Error('Invalid or expired OTP');
    }

    console.log('OTP verified successfully for:', email);
    const pendingChannel = this.pendingRegistrations.get(email);
    if (!pendingChannel) {
      throw new Error('No pending registration found');
    }

    // Set isVerified to true before creating the channel
    const verifiedChannel = {
      ...pendingChannel,
      isVerified: true
    };

    // Create channel after OTP verification with isVerified flag
    await this.channelRepository.createChannel(verifiedChannel);
    this.pendingRegistrations.delete(email);
  }

  async login(data: LoginDTO): Promise<{ accessToken: string; refreshToken: string }> {
    const channel = await this.channelRepository.findByEmail(data.email);
    if (!channel) throw new Error("Channel not found.");
    
    if (!channel.isVerified) {
      throw new Error("Please verify your email first.");
    }

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
    const secret = process.env.ACCESS_TOKEN_SECRET as string;
    const expiresIn = (process.env.TOKEN_EXPIRY || "1h") as jwt.SignOptions["expiresIn"];
  
    return jwt.sign({ channelId }, secret, { expiresIn });
  }
  
  
  private generateRefreshToken(channelId: string): string {
    const secret = process.env.REFRESH_TOKEN_SECRET as string;
    const expiresIn = (process.env.REFRESH_TOKEN_EXPIRY || "7d") as jwt.SignOptions["expiresIn"];
  
    return jwt.sign({ channelId }, secret, { expiresIn });
  }
  
  
  

  async resendOTP(email: string): Promise<void> {
    console.log('Attempting to resend OTP for:', email);
    const pendingChannel = this.pendingRegistrations.get(email);
    if (!pendingChannel) {
      console.log('No pending registration found for:', email);
      throw new Error('No pending registration found');
    }
    
    await OtpService.sendOTP(email, pendingChannel.channelName);
    console.log('OTP resent successfully for:', email);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { channelId: string };
      
      // Find channel with this refresh token
      const channel = await this.channelRepository.findById(decoded.channelId);
      if (!channel || channel.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      // Generate new access token
      if (!channel.id) throw new Error('Channel ID is undefined');
      const accessToken = this.generateAccessToken(channel.id);
      return { accessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
