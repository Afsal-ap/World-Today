"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = exports.AdController = void 0;
const CreateAd_1 = require("../../application/use-cases/CreateAd");
const AdRepositoryImpl_1 = require("../../infrastructure/repositories/AdRepositoryImpl");
const StripePaymentService_1 = require("../../infrastructure/payment/StripePaymentService");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    },
});
const upload = (0, multer_1.default)({ storage });
const adRepository = new AdRepositoryImpl_1.AdRepositoryImpl();
const paymentService = new StripePaymentService_1.StripePaymentService();
const createAdUseCase = new CreateAd_1.CreateAdUseCase(adRepository, paymentService);
class AdController {
    static async createPaymentIntent(req, res) {
        try {
            const { amount, placement } = req.body;
            const paymentIntent = await paymentService.createPaymentIntent(amount, "usd");
            res.json({
                clientSecret: paymentIntent.clientSecret,
                paymentIntentId: paymentIntent.paymentIntentId
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async create(req, res) {
        try {
            const { adData, paymentIntentId } = req.body;
            console.log("Request body:", req.body);
            const paymentStatus = await paymentService.checkPaymentStatus(paymentIntentId);
            if (paymentStatus !== 'succeeded') {
                return res.status(400).json({
                    error: `Payment not completed. Status: ${paymentStatus}`
                });
            }
            const ad = await adRepository.createAd({
                id: "",
                advertiserId: adData.advertiserId,
                title: adData.title,
                description: adData.description,
                imageUrl: adData.imageUrl,
                placement: adData.placement,
                price: adData.price,
                status: "pending",
                createdAt: new Date(),
                updatedAt: new Date()
            });
            res.status(201).json({
                message: "Ad created successfully",
                ad,
                paymentIntentId
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async deleteAd(req, res) {
        try {
            const { adId } = req.params;
            await adRepository.deleteAd(adId);
            res.status(200).json({ message: "Ad deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete ad" });
        }
    }
    static async getByAdvertiser(req, res) {
        try {
            const { advertiserId } = req.params;
            console.log(advertiserId, "Advertiser ID backendil ethi");
            const ads = await adRepository.getAdsByAdvertiser(advertiserId);
            console.log(ads, "Ads backendil ethi");
            res.json(ads);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch ads" });
        }
    }
    static async getActiveAds(req, res) {
        try {
            const ads = await adRepository.getActiveAds();
            console.log("Active adseeeyeye", ads);
            res.json(ads);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch active ads" });
        }
    }
    static async uploadImage(req, res) {
        try {
            const isConnected = await (0, uploadMiddleware_1.testCloudinaryConnection)();
            if (!isConnected) {
                return res.status(503).json({
                    error: "Cloudinary service unavailable. Please try again later."
                });
            }
            if (!req.file) {
                return res.status(400).json({ error: "No image file provided" });
            }
            if (!fs_1.default.existsSync(req.file.path)) {
                return res.status(400).json({
                    error: "File was processed but cannot be found on server"
                });
            }
            const absolutePath = path_1.default.resolve(req.file.path);
            console.log("Uploading file from path:", absolutePath);
            try {
                const result = await cloudinary_1.default.v2.uploader.upload(absolutePath, {
                    folder: "ads",
                    resource_type: "image",
                    use_filename: true,
                    unique_filename: true,
                });
                try {
                    fs_1.default.unlinkSync(absolutePath);
                }
                catch (unlinkError) {
                    console.warn("Warning: Could not delete temporary file:", unlinkError);
                }
                return res.status(200).json({
                    imageUrl: result.secure_url,
                    public_id: result.public_id
                });
            }
            catch (cloudinaryError) {
                console.error("Cloudinary upload error:", cloudinaryError);
                return res.status(500).json({
                    error: "Failed to upload image to Cloudinary",
                    details: cloudinaryError.message
                });
            }
        }
        catch (error) {
            console.error("Server error during upload:", error);
            return res.status(500).json({
                error: "Server error processing upload",
                details: error.message
            });
        }
    }
}
exports.AdController = AdController;
exports.uploadMiddleware = upload.single("image");
//# sourceMappingURL=AdController.js.map