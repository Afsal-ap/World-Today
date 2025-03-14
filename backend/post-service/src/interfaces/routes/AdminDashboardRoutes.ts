import express from 'express'
import { ChannelRepositoryImpl} from '../../infrastructure/repositories/ChannelRepositoryImpl'
import { GetChannelStatsController } from '../controllers/GetChannelStatsController';

const router = express.Router();
const channelRepository = new ChannelRepositoryImpl();
const getChannelStatsController = new GetChannelStatsController(channelRepository)

router.get('/getChannelStats',(req,res,next)=>{
    try{
        getChannelStatsController.handle(req,res)
    }catch(error){
        next(error)
    }
    })

export default router;
