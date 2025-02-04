import { Router } from 'express';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import ChannelModel, { ChannelDocument } from '../../infrastructure/db/model/ChannelModel';
import { PostModel } from '../../infrastructure/db/model/PostModel';

const router = Router();

interface GetChannelsQuery {
  page?: string;
  limit?: string;
}

interface ToggleBlockParams {    
  channelId: string;
}

// Get channels route handler
const getChannels: RequestHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string || '1');
    const limit = parseInt(req.query.limit as string || '10');
    const skip = (page - 1) * limit;

    const channels = await ChannelModel.find()
      .select('channelName email phoneNumber websiteOrSocialLink logo isVerified createdAt isBlocked')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalChannels = await ChannelModel.countDocuments();
    const totalPages = Math.ceil(totalChannels / limit);

    const channelsWithCounts = await Promise.all(
      channels.map(async (channel) => {
        const postsCount = await PostModel.countDocuments({ channelId: channel._id });
        return {
          id: channel._id,
          channelName: channel.channelName,
          email: channel.email,
          phoneNumber: channel.phoneNumber,
          websiteOrSocialLink: channel.websiteOrSocialLink,
          logo: channel.logo,
          isVerified: channel.isVerified,
          createdAt: channel.createdAt,
          postsCount,
          isBlocked: channel.isBlocked
        };
      })
    );

    res.json({
      status: 'success',
      data: {
        channels: channelsWithCounts,
        totalPages,
        currentPage: page,
        totalChannels
      }
    });
  } catch (error) {
    next(error);
  }
};

// Toggle block route handler
const toggleBlockChannel: RequestHandler = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const channel = await ChannelModel.findById(channelId).lean();
    
    if (!channel) {
      res.status(404).json({ 
        status: 'error',
        message: 'Channel not found' 
      });
      return;
    }

    const updatedChannel = await ChannelModel.findByIdAndUpdate(
      channelId,
      { $set: { isBlocked: !channel.isBlocked } },
      { new: true }
    ).lean();

    if (!updatedChannel) {
      res.status(404).json({ 
        status: 'error',
        message: 'Channel not found' 
      });
      return;
    }

    res.json({
      status: 'success',
      data: {
        channelId: updatedChannel._id,
        isBlocked: updatedChannel.isBlocked
      }
    });
  } catch (error) {
    next(error);
  }
};

// Apply routes
router.get('/channels', getChannels);
router.put('/channels/:channelId/toggle-block', toggleBlockChannel);

export default router;