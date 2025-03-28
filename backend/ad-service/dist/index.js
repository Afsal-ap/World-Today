"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const AdvertiserAuthRoutes_1 = __importDefault(require("./interfaces/routes/AdvertiserAuthRoutes"));
const mongoose_connection_1 = __importDefault(require("./infrastructure/db/db-connection/mongoose.connection"));
const multer_1 = __importDefault(require("multer"));
const AdRoutes_1 = __importDefault(require("./interfaces/routes/AdRoutes"));
const AdminDashboardRoutes_ts_1 = __importDefault(require("./interfaces/routes/AdminDashboardRoutes.ts"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
(0, mongoose_connection_1.default)();
const requiredEnvVars = ['MONGODB_URI', 'ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    console.error('Please check your .env file');
    if (process.env.NODE_ENV !== 'development') {
        process.exit(1);
    }
}
app.use('/advertiser', AdvertiserAuthRoutes_1.default);
app.use('/api/ads', AdRoutes_1.default);
app.use('/api/dashboard', AdminDashboardRoutes_ts_1.default);
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Ad service running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    if (process.env.NODE_ENV === 'development') {
        console.log('Development settings:');
        console.log(`- Skip email sending: ${process.env.SKIP_EMAIL === 'true' ? 'Yes' : 'No'}`);
        console.log(`- Allow registration without email: ${process.env.ALLOW_REGISTRATION_WITHOUT_EMAIL === 'true' ? 'Yes' : 'No'}`);
        console.log(`- Auto verify accounts: ${process.env.AUTO_VERIFY === 'true' ? 'Yes' : 'No'}`);
    }
});
//# sourceMappingURL=index.js.map