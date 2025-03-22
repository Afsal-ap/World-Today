import express from 'express'
import { AdvertiserRepositoryImpl} from '../../infrastructure/repositories/AdvertiserRepositoryImpl'
import { GetAdStatsController } from '../controllers/AdminAdStatsController';
import {  } from '../../infrastructure/repositories/AdRepositoryImpl';

const router = express.Router();
const advertiserRepository = new AdvertiserRepositoryImpl();
const getAdStatsController = new GetAdStatsController(advertiserRepository)

router.get('/getAdvertiserStats',async(req,res,next)=>{
    try{
       await getAdStatsController.handle(req,res)
    }catch(error){
        next(error)
    }
    })

router.get('/getAdChart',async(req,res,next)=>{
     try{
        await getAdStatsController.getAdChart(req,res)
    }catch(error){
          next(error)
        }
        })

export default router;
