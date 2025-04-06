"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserStatsController = void 0;
const dashboard_usecase_1 = require("../../application/use-cases/admin/dashboard-usecase");
const GetUserChart_usecase_1 = require("../../application/use-cases/admin/GetUserChart-usecase");
class GetUserStatsController {
    constructor(userRepository) {
        this.userStatsUsecase = new dashboard_usecase_1.getUserStatsUsecase(userRepository);
        this.userChartUsecase = new GetUserChart_usecase_1.GetUserChartUsecase(userRepository);
    }
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userStatsUsecase.execute();
                return res.status(200).json(result);
            }
            catch (error) {
                console.error("Error in handle method:", error);
                return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
            }
        });
    }
    getUserChart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const period = req.query.period; // Ensure it's treated as a string
                if (period !== "daily" && period !== "weekly") {
                    return res.status(400).json({ message: "Invalid period. Use 'daily' or 'weekly'." });
                }
                const data = yield this.userChartUsecase.execute(period); // Corrected `this` usage
                return res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error fetching user chart:", error);
                return res.status(500).json({ success: false, message: "Internal server error." });
            }
        });
    }
}
exports.GetUserStatsController = GetUserStatsController;
