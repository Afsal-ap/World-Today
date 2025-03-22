import { Request, Response } from 'express';
import { getChannelStatsUsecase } from '../../application/use-cases/GetChannelStats';
import type { ChannelRepository } from '../../domain/repositories/ChannelRepository'; // 
import { GetChannelChartUsecase } from '../../application/use-cases/GetChartChannel-usecase';
import { PostRepository } from '../../domain/repositories/PostRepository';
import { log } from 'console';


export class GetChannelStatsController {
  private readonly channelStatsUsecase: getChannelStatsUsecase;
  private readonly channelChartUsecase : GetChannelChartUsecase

  constructor(userRepository: ChannelRepository, postRepository:PostRepository) {
    this.channelStatsUsecase = new getChannelStatsUsecase(userRepository,postRepository);  
    this.channelChartUsecase = new GetChannelChartUsecase(postRepository)
  }

  async getChannelStats(req: Request, res: Response) {
    try {
      const result = await this.channelStatsUsecase.getChannelStatsAdmin();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  } 

  async getPostChart(req: Request, res: Response) {
    try {
      const period = (req.query.period as 'daily' | 'weekly') || 'daily';
      const chartData = await this.channelChartUsecase.execute(period);
      res.status(200).json({
        success: true,
        data: chartData
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch chart data'
      });
    }
  } 


   async getChannelDashbordDetails(req:Request, res:Response, channelId:string,period: 'daily' | 'weekly' = 'daily'){
      
      try{
         const result = await this.channelStatsUsecase.getChannelStats(channelId,period) 
           console.log(result, "kittytyt");
           
         res.status(200).json(result)
      }catch(error){
        console.error('Error fetching  data:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to fetch data'
      })
   }
}
}
