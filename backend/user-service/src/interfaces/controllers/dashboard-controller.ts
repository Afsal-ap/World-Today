import { Request, Response } from 'express';
import { getUserStatsUsecase } from '../../application/use-cases/admin/dashboard-usecase';
import type { IUserRepository } from '../../domain/repositories/user-repository';
import { GetUserChartUsecase } from '../../application/use-cases/admin/GetUserChart-usecase';

export class GetUserStatsController {
  private readonly userStatsUsecase: getUserStatsUsecase;
  private readonly userChartUsecase: GetUserChartUsecase;

  constructor(userRepository: IUserRepository) {
    this.userStatsUsecase = new getUserStatsUsecase(userRepository);
    this.userChartUsecase = new GetUserChartUsecase(userRepository);
  }

  async handle(req: Request, res: Response) {
    try {
      const result = await this.userStatsUsecase.execute();
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in handle method:", error);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  async getUserChart(req: Request, res: Response) {
    try {
      const period = req.query.period as string; // Ensure it's treated as a string

      if (period !== "daily" && period !== "weekly") {
        return res.status(400).json({ message: "Invalid period. Use 'daily' or 'weekly'." });
      }

      const data = await this.userChartUsecase.execute(period); // Corrected `this` usage
      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error fetching user chart:", error);
      return res.status(500).json({ success: false, message: "Internal server error." });
    }
  }
}
