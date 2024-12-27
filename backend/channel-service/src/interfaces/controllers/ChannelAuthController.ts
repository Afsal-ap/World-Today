import { Request, Response } from "express";
import { ChannelAuthUseCase } from "../../application/use-cases/ChannelAuthUseCase";

export class ChannelAuthController {
  constructor(private channelAuthUseCase: ChannelAuthUseCase) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      console.log('Received registration request:', {
        body: req.body,
        file: req.file
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

      await this.channelAuthUseCase.registerChannel(channelData);
      
      res.status(201).json({ 
        success: true,
        message: "Channel registered successfully. Please verify your email.",
        email: channelData.email
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(400).json({ 
        success: false,
        error: error.message || 'Registration failed' 
      });
    }
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      await this.channelAuthUseCase.verifyOTP(email, otp);
      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error: any) {
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
}
