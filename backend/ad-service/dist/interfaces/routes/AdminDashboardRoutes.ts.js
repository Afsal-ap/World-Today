"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdvertiserRepositoryImpl_1 = require("../../infrastructure/repositories/AdvertiserRepositoryImpl");
const AdminAdStatsController_1 = require("../controllers/AdminAdStatsController");
const router = express_1.default.Router();
const advertiserRepository = new AdvertiserRepositoryImpl_1.AdvertiserRepositoryImpl();
const getAdStatsController = new AdminAdStatsController_1.GetAdStatsController(advertiserRepository);
router.get('/getAdvertiserStats', async (req, res, next) => {
    try {
        await getAdStatsController.handle(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/getAdChart', async (req, res, next) => {
    try {
        await getAdStatsController.getAdChart(req, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=AdminDashboardRoutes.ts.js.map