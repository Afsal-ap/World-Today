import { Router } from "express";
import { ChannelRepositoryImpl } from "../../infrastructure/repositories/ChannelRepositoryImpl";
import { ChannelAuthUseCase } from "../../application/use-cases/ChannelAuthUseCase";
import { ChannelAuthController } from "../controllers/ChannelAuthController";
import { upload } from "../../infrastructure/utils/fileUpload";

const router = Router();
   
const channelRepository = new ChannelRepositoryImpl();
const channelAuthUseCase = new ChannelAuthUseCase(channelRepository);
const channelAuthController = new ChannelAuthController(channelAuthUseCase);

router.post("/register", 
  upload.single('logo'),
  (req, res) => channelAuthController.register(req, res)
);
router.post("/login", (req, res) => channelAuthController.login(req, res));
router.post("/verify-otp", (req, res) => channelAuthController.verifyOTP(req, res));
export default router;
   