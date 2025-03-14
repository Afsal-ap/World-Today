import express from 'express'
import { AdvertiserRepositoryImpl} from '../../infrastructure/repositories/AdvertiserRepositoryImpl'
import { GetAdStatsController } from '../controllers/AdminAdStatsController';

const router = express.Router();
const advertiserRepository = new AdvertiserRepositoryImpl();
const getAdStatsController = new GetAdStatsController(advertiserRepository)

router.get('/getAdvertiserStats',(req,res,next)=>{
    try{
        getAdStatsController.handle(req,res)
    }catch(error){
        next(error)
    }
    })

export default router;
