"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdStatsController = void 0;
const GetAdvertiserStats_1 = require("../../application/use-cases/GetAdvertiserStats");
const GetAdChart_1 = require("../../application/use-cases/GetAdChart");
class GetAdStatsController {
    constructor(userRepository) {
        this.adStatsUsecase = new GetAdvertiserStats_1.getAdvertiserStatsUsecase(userRepository);
        this.adChartUsecase = new GetAdChart_1.GetAdChartUsecase(userRepository);
    }
    async handle(req, res) {
        try {
            const result = await this.adStatsUsecase.execute();
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    }
    async getAdChart(req, res) {
        try {
            const period = req.query.period || 'daily';
            const chartData = await this.adChartUsecase.execute(period);
            res.status(200).json({
                success: true,
                data: chartData
            });
        }
        catch (error) {
            console.error('Error fetching chart data:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch chart data'
            });
        }
    }
}
exports.GetAdStatsController = GetAdStatsController;
//# sourceMappingURL=AdminAdStatsController.js.map