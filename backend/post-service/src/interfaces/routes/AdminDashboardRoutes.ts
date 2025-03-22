import express from 'express'
import { ChannelRepositoryImpl} from '../../infrastructure/repositories/ChannelRepositoryImpl'
import { GetChannelStatsController } from '../controllers/GetChannelStatsController';
import { PostRepositoryImpl } from '../../infrastructure/repositories/PostRepositoryImpl';
import { error } from 'console';

const router = express.Router();
const channelRepository = new ChannelRepositoryImpl();
const postRepository = new PostRepositoryImpl()
const getChannelStatsController = new GetChannelStatsController(channelRepository,postRepository)

router.get('/getChannelStats', async (req,res,next)=>{
    try{
       await getChannelStatsController.getChannelStats(req,res)
    }catch(error){
        next(error)
    }
    })

router.get('/post-chart', async (req, res, next) => {
        try {
          await getChannelStatsController.getPostChart(req, res);
        } catch (error) {
          next(error); 
        }
      });
      

export default router;
