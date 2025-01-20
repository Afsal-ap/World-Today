import { Request, Response } from "express";
import { ChannelAuthUseCase } from "../../application/use-cases/ChannelAuthUsecase";

export class ChannelAuthController {
  constructor(private channelAuthUseCase: ChannelAuthUseCase) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      console.log('Received registration request:', {
        body: req.body,
        file: req.file,
        headers: req.headers
      });
   
      const logoFile = req.file;
      if (!logoFile) {
        res.status(400).json({ error: "Logo file is required" });
        return;
      }

      const channelData = {
        ...req.body,
        logo: {
          path: logoFile.path.replace(/\\/g, '/'),
          filename: logoFile.filename
        }
      };

      console.log('Processing channel data:', channelData);

      const result = await this.channelAuthUseCase.registerChannel(channelData);
      
      res.status(201).json({ 
        success: true,
        message: "Channel registered successfully. Please verify your email.",
        email: channelData.email
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(400).json({ 
        success: false,
        error: error.message || 'Registration failed',
        details: error.stack
      });
    }
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      console.log('OTP verification request received:', { email, otp });
      
      await this.channelAuthUseCase.verifyOTP(email, otp);
      console.log('OTP verification successful for:', email);
      
      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error: any) {
      console.error('OTP verification failed:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const tokens = await this.channelAuthUseCase.login(req.body);
      res.status(200).json(tokens);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async resendOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      console.log('OTP resend request received for:', email);
      
      await this.channelAuthUseCase.resendOTP(email);
      console.log('OTP resent successfully for:', email);
      
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error: any) {
      console.error('OTP resend failed:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ error: 'Refresh token is required' });
        return;
      }

      const result = await this.channelAuthUseCase.refreshToken(refreshToken);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}
