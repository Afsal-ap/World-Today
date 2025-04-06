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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_1 = require("../../domain/services/auth-service");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            res.status(400).json({ message: 'No token provided' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not configured');
        }
        try {
            // Verify access token
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            req.user = { id: decoded.userId, userId: decoded.userId };
            return next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                if (!refreshToken) {
                    res.status(401).json({ message: 'Access token expired, no refresh token provided' });
                    return;
                }
                // Generate new access token using refresh token
                const authService = new auth_service_1.AuthService();
                const newAccessToken = yield authService.generateAccessTokenFromRefreshToken(refreshToken);
                // Verify the new access token
                const decoded = jsonwebtoken_1.default.verify(newAccessToken, secret);
                req.user = { id: decoded.userId, userId: decoded.userId };
                // Attach the new access token to the response
                res.setHeader('Authorization', `Bearer ${newAccessToken}`);
                return next();
            }
            else {
                throw error;
            }
        }
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
});
exports.authMiddleware = authMiddleware;
