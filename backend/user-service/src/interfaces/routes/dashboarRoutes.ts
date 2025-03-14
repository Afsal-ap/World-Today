import express from 'express'
import { UserRepositoryImpl} from '../../infrastructure/repositories/user-repository-impl'
import { GetUserStatsController } from '../controllers/dashboard-controller';

const router = express.Router();
const userRepository = new UserRepositoryImpl();
const getUserStatsController = new GetUserStatsController(userRepository)

router.get('/getUserStats',(req,res,next)=>{
    try{
     getUserStatsController.handle(req,res)
    }catch(error){
        next(error)
    }
    }) 

router.get('/user-chart', (req,res,next)=>{
     try{
        getUserStatsController.getUserChart(req,res)
     }catch(error){
        next(error)
     }
 })
    

export default router;
