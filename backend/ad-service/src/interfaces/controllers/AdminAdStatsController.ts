import { Request, Response } from 'express';
import { getAdvertiserStatsUsecase } from '../../application/use-cases/GetAdvertiserStats';
import type { AdvertiserRepository } from '../../domain/repositories/AdvertiserRepository'; // 

export class GetAdStatsController {
  private readonly adStatsUsecase: getAdvertiserStatsUsecase;

  constructor(userRepository: AdvertiserRepository) {
    this.adStatsUsecase = new getAdvertiserStatsUsecase(userRepository); // 
  }

  async handle(req: Request, res: Response) {
    try {
      const result = await this.adStatsUsecase.execute();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }
}
