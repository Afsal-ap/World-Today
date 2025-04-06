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
exports.adminMiddleware = void 0;
const adminMiddleware = (userRepository, authService) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'No token provided' });
            }
            const token = authHeader.split(' ')[1];
            const decoded = yield authService.verifyAccessToken(token);
            const user = yield userRepository.findById(decoded.userId);
            if (!user || !user.isAdmin) {
                return res.status(403).json({ message: 'Access denied: Admin only' });
            }
            if (!user || !user.isAdmin || !user.id) {
                return res.status(403).json({ message: 'Access denied: Admin only' });
            }
            req.user = { id: user.id };
            next();
        }
        catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    });
};
exports.adminMiddleware = adminMiddleware;
