import { Router } from "express";
import { ChannelDashboardController } from "../controllers/ChannelDashboardController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { ChannelRepositoryImpl } from "../../infrastructure/repositories/ChannelRepositoryImpl";
import ChannelModel from "../../infrastructure/db/model/ChannelModel";
import { Request, Response } from "express";
import { PostModel } from "../../infrastructure/db/model/PostModel";
import { GetChannelStatsController } from "../controllers/GetChannelStatsController";
import { PostRepositoryImpl } from "../../infrastructure/repositories/PostRepositoryImpl";


const router = Router();
const channelRepository = new ChannelRepositoryImpl(); 
const postRepository = new PostRepositoryImpl()
const channelDashboardController = new ChannelDashboardController(channelRepository);
const authMiddleware = new AuthMiddleware(); 
const getChannelStatsController = new GetChannelStatsController(channelRepository,postRepository)

router.get("/", 
  authMiddleware.verifyToken.bind(authMiddleware), 
  (req, res, next) => {
    channelDashboardController.dashboard(req, res).catch(next);
  }
);

router.get('/profile', 
  authMiddleware.verifyToken.bind(authMiddleware), 
  (req: Request, res: Response, next) => {
    (async () => {
      try {
        const channelId = (req as any).user.channelId;
        
        const channelProfile = await ChannelModel.findById(channelId).select([
          'channelName',
          'email',
          'bio',
          'logo',
          'websiteOrSocialLink',
          'phoneNumber',
          'createdAt'
        ]);

        if (!channelProfile) {
          res.status(404).json({ 
            status: 'error',
            message: 'Channel not found' 
          });
          return;
        }

        res.json({
          status: 'success',
          data: {
            channelName: channelProfile.channelName,
            email: channelProfile.email,
            bio: channelProfile.bio || '',
            logo: channelProfile.logo,
            websiteOrSocialLink: channelProfile.websiteOrSocialLink,
            phoneNumber: channelProfile.phoneNumber,
            createdAt: channelProfile.createdAt
          }
        });
      } catch (error: any) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
          status: 'error',
          message: 'Failed to fetch profile'
        });
      }
    })().catch(next);
  }
);

router.put('/profile', 
  authMiddleware.verifyToken.bind(authMiddleware), 
  async (req: Request, res: Response, next) => {
    try {
      const channelId = (req as any).user.channelId;
      const updateData = {
        channelName: req.body.channelName,
        bio: req.body.bio,
        websiteOrSocialLink: req.body.websiteOrSocialLink,
        phoneNumber: req.body.phoneNumber
      };

      const updatedChannel = await ChannelModel.findByIdAndUpdate(
        channelId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

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
          channelName: updatedChannel.channelName,
          email: updatedChannel.email,
          bio: updatedChannel.bio || '',
          websiteOrSocialLink: updatedChannel.websiteOrSocialLink,
          phoneNumber: updatedChannel.phoneNumber
        }
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update profile'
      });
    }
  } )

  router.get(
    '/getChannelDashboard/:channelId',
    authMiddleware.verifyToken.bind(authMiddleware),
    async (req, res, next) => {
      try {
        const channelId = req.params.channelId as string;
        const period = (req.query.period as 'daily' | 'weekly') || 'daily'; // Default to 'daily'
        
        // Pass both channelId and period to the controller
        await getChannelStatsController.getChannelDashbordDetails(req, res, channelId, period);
      } catch (error) {
        next(error);
      }
    }
  );
  




export default router; 