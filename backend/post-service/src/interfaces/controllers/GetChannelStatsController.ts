import { Request, Response } from 'express';
import { getChannelStatsUsecase } from '../../application/use-cases/GetChannelStats';
import type { ChannelRepository } from '../../domain/repositories/ChannelRepository'; // 

export class GetChannelStatsController {
  private readonly channelStatsUsecase: getChannelStatsUsecase;

  constructor(userRepository: ChannelRepository) {
    this.channelStatsUsecase = new getChannelStatsUsecase(userRepository); 
  }

  async handle(req: Request, res: Response) {
    try {
      const result = await this.channelStatsUsecase.execute();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }
}
