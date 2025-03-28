"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdvertiserAuthController_1 = require("../controllers/AdvertiserAuthController");
const AdvertiserAuthUseCase_1 = require("../../application/use-cases/AdvertiserAuthUseCase");
const AdvertiserRepositoryImpl_1 = require("../../infrastructure/repositories/AdvertiserRepositoryImpl");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
const upload = (0, multer_1.default)({ storage });
const advertiserRepository = new AdvertiserRepositoryImpl_1.AdvertiserRepositoryImpl();
const advertiserAuthUseCase = new AdvertiserAuthUseCase_1.AdvertiserAuthUseCase(advertiserRepository);
const advertiserAuthController = new AdvertiserAuthController_1.AdvertiserAuthController(advertiserAuthUseCase);
const registerHandler = async (req, res) => {
    return advertiserAuthController.register(req, res);
};
const loginHandler = async (req, res) => {
    return advertiserAuthController.login(req, res);
};
const verifyOtpHandler = async (req, res) => {
    return advertiserAuthController.verifyOtp(req, res);
};
router.post('/register', upload.single('logo'), registerHandler);
router.post('/login', loginHandler);
router.post('/verify-otp', verifyOtpHandler);
exports.default = router;
//# sourceMappingURL=AdvertiserAuthRoutes.js.map