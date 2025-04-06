"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_repository_impl_1 = require("../../infrastructure/repositories/user-repository-impl");
const dashboard_controller_1 = require("../controllers/dashboard-controller");
const router = express_1.default.Router();
const userRepository = new user_repository_impl_1.UserRepositoryImpl();
const getUserStatsController = new dashboard_controller_1.GetUserStatsController(userRepository);
router.get('/getUserStats', (req, res, next) => {
    try {
        getUserStatsController.handle(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/user-chart', (req, res, next) => {
    try {
        getUserStatsController.getUserChart(req, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
