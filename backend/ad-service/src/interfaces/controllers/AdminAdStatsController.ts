import { Request, Response } from 'express';
import { getAdvertiserStatsUsecase } from '../../application/use-cases/GetAdvertiserStats';
import type { AdvertiserRepository } from '../../domain/repositories/AdvertiserRepository'; // 
import { GetAdChartUsecase } from '../../application/use-cases/GetAdChart';


export class GetAdStatsController {
  private readonly adStatsUsecase: getAdvertiserStatsUsecase;
  private readonly adChartUsecase:GetAdChartUsecase

  constructor(userRepository: AdvertiserRepository) {
    this.adStatsUsecase = new getAdvertiserStatsUsecase(userRepository);
    this.adChartUsecase = new GetAdChartUsecase(userRepository)
     
  }

  async handle(req: Request, res: Response) {
    try {
      const result = await this.adStatsUsecase.execute();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }  
  async getAdChart(req: Request, res: Response) {
    try {
      const period = (req.query.period as 'daily' | 'weekly') || 'daily';
      const chartData = await this.adChartUsecase.execute(period);
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
}
