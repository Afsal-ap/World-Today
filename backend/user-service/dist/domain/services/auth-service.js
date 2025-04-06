"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.AuthService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AuthService {
    constructor() {
        this.SALT_ROUNDS = 10;
        this.ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
        this.REFRESH_TOKEN_EXPIRY = '7d'; // 7 days
        // Initialize secrets in constructor
        const accessSecret = process.env.JWT_SECRET;
        const refreshSecret = process.env.JWT_REFRESH_SECRET;
        if (!accessSecret || !refreshSecret) {
            throw new Error('JWT secrets not configured properly');
        }
        this.ACCESS_TOKEN_SECRET = accessSecret;
        this.REFRESH_TOKEN_SECRET = refreshSecret;
        console.log('Auth service initialized with secrets');
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Hashing password...');
            const hashedPassword = yield bcrypt.hash(password, this.SALT_ROUNDS);
            return hashedPassword;
        });
    }
    comparePassword(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Comparing passwords...');
            try {
                const isMatch = yield bcrypt.compare(password, hashedPassword);
                console.log('Password comparison result:', isMatch);
                return isMatch;
            }
            catch (error) {
                console.error('Password comparison error:', error);
                return false;
            }
        });
    }
    generateTokens(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(user, "userr");
            const userId = user;
            const email = user.email;
            const accessToken = jwt.sign({ userId, email }, this.ACCESS_TOKEN_SECRET, { expiresIn: this.ACCESS_TOKEN_EXPIRY });
            const refreshToken = jwt.sign({ userId, email }, this.REFRESH_TOKEN_SECRET, { expiresIn: this.REFRESH_TOKEN_EXPIRY });
            return {
                accessToken,
                refreshToken,
                email
            };
        });
    }
    verifyAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ACCESS_TOKEN_SECRET) {
                throw new Error('Access token secret not configured');
            }
            try {
                return jwt.verify(token, this.ACCESS_TOKEN_SECRET);
            }
            catch (error) {
                throw new Error('Invalid access token');
            }
        });
    }
    verifyRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.REFRESH_TOKEN_SECRET) {
                throw new Error('Refresh token secret not configured');
            }
            try {
                return jwt.verify(token, this.REFRESH_TOKEN_SECRET);
            }
            catch (error) {
                throw new Error('Invalid refresh token');
            }
        });
    }
    generateAccessTokenFromRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = yield this.verifyRefreshToken(refreshToken);
                if (!decoded) {
                    throw new Error('Invalid refresh token');
                }
                // Generate new access token
                const accessToken = jwt.sign({ userId: decoded.userId }, this.ACCESS_TOKEN_SECRET, { expiresIn: this.ACCESS_TOKEN_EXPIRY });
                return accessToken;
            }
            catch (error) {
                console.error('Token refresh error:', error);
                throw new Error('Failed to generate new access token');
            }
        });
    }
    getUserByPhoneNumber(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implement this method to fetch user by phone number
            // You'll need to inject the user repository
            // Example:
            // return this.userRepository.findByPhoneNumber(phoneNumber);
            throw new Error('Method not implemented');
        });
    }
}
exports.AuthService = AuthService;
