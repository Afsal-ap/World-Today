import { Router } from "express";
import { ChannelDashboardController } from "../controllers/ChannelDashboardController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { ChannelRepositoryImpl } from "../../infrastructure/repositories/ChannelRepositoryImpl";

const router = Router();
const channelRepository = new ChannelRepositoryImpl();
const channelDashboardController = new ChannelDashboardController(channelRepository);
const authMiddleware = new AuthMiddleware();

// Protected route - requires authentication
router.get("/", 
  authMiddleware.verifyToken.bind(authMiddleware), 
  (req, res, next) => {
    channelDashboardController.dashboard(req, res).catch(next);
  }
);

export default router; 