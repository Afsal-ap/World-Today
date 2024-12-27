import { Request, Response } from "express";
import { ChannelRepository } from "../../domain/repositories/ChannelRepository";
import { log } from "console";

export class ChannelDashboardController {
  constructor(private channelRepository: ChannelRepository) {}

  async dashboard(req: Request, res: Response) {
    try {
      const channelId = (req as any).user.channelId;
      const channel = await this.channelRepository.findById(channelId);

      if (!channel) {
        return res.status(404).json({
          success: false,
          message: "Channel not found" 
          
          
        })
          
      }

      res.status(200).json({
        success: true,
        channelData: {
          channelName: channel.channelName,
          email: channel.email,
          logo: channel.logo.filename,
          websiteOrSocialLink: channel.websiteOrSocialLink,
          phoneNumber: channel.phoneNumber,
          // Add any other channel data you want to display
          
        }
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
} 