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
exports.adminAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminAuthMiddleware = (userRepository) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
                res.status(401).json({ message: 'No token provided' });
                return;
            }
            const token = authHeader.split(' ')[1];
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('JWT_SECRET is not configured');
            }
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            const user = yield userRepository.findById(decoded.userId);
            console.log(user, "admin");
            if (!user || !user.isAdmin) {
                res.status(403).json({ message: 'Not authorized as admin' });
                return;
            }
            if (!(user === null || user === void 0 ? void 0 : user.id)) {
                throw new Error('User ID is undefined');
            }
            req.user = { id: user.id };
            next();
        }
        catch (error) {
            console.error('Admin auth middleware error:', error);
            res.status(401).json({ message: 'Invalid token' });
        }
    });
};
exports.adminAuthMiddleware = adminAuthMiddleware;
