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
exports.AuthController = void 0;
class AuthController {
    constructor(registerUseCase, loginUseCase, authService, sendOtpUseCase, verifyOtpUseCase, completeRegistrationUseCase) {
        this.registerUseCase = registerUseCase;
        this.loginUseCase = loginUseCase;
        this.authService = authService;
        this.sendOtpUseCase = sendOtpUseCase;
        this.verifyOtpUseCase = verifyOtpUseCase;
        this.completeRegistrationUseCase = completeRegistrationUseCase;
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phone, email, password, name } = req.body;
                // First step: Register user (hash password, etc.)
                const registrationData = yield this.registerUseCase.execute({
                    email,
                    password,
                    name,
                    phone
                });
                // Second step: Complete registration (save user to database)
                const result = yield this.completeRegistrationUseCase.execute({
                    email,
                    password,
                    name,
                    phone
                });
                // Send OTP
                try {
                    yield this.sendOtpUseCase.execute(phone, email);
                    console.log('✉️ OTP sent after registration to:', email);
                    res.status(201).json({
                        success: true,
                        data: result,
                        message: "Registration successful and OTP sent"
                    });
                }
                catch (otpError) {
                    console.error('Failed to send initial OTP:', otpError);
                    res.status(201).json({
                        success: true,
                        data: result,
                        warning: "Registration successful but failed to send OTP"
                    });
                }
            }
            catch (error) {
                console.error('Registration error:', error);
                res.status(400).json({
                    success: false,
                    error: error.message
                });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.loginUseCase.execute(req.body);
                if (result.user.isBlocked) {
                    res.status(403).json({
                        success: false,
                        error: 'Your account has been blocked. Please contact support.'
                    });
                    return;
                }
                // Set refresh token in cookie
                res.cookie('refreshToken', result.tokens.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
                res.status(200).json({
                    success: true,
                    user: result.user,
                    tokens: {
                        accessToken: result.tokens.accessToken,
                        refreshToken: result.tokens.refreshToken
                    }
                });
            }
            catch (error) {
                res.status(401).json({ error: error.message });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                if (!refreshToken) {
                    throw new Error('Refresh token is required');
                }
                const newAccessToken = yield this.authService.generateAccessTokenFromRefreshToken(refreshToken);
                res.status(200).json({
                    success: true,
                    accessToken: newAccessToken
                });
            }
            catch (error) {
                res.status(401).json({
                    success: false,
                    error: error.message
                });
            }
        });
    }
    sendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phoneNumber, email } = req.body;
                console.log('📞 Sending OTP to:', phoneNumber);
                if (!phoneNumber || !email) {
                    res.status(400).json({
                        success: false,
                        message: "Phone number and email are required"
                    });
                    return;
                }
                yield this.sendOtpUseCase.execute(phoneNumber, email);
                res.status(200).json({
                    success: true,
                    message: "OTP sent successfully to your phone"
                });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phoneNumber, email, otp } = req.body;
                console.log('📝 Verifying OTP with data:', { phoneNumber, email, otp });
                if (!phoneNumber || !email || !otp) {
                    res.status(400).json({
                        success: false,
                        message: 'Phone number, email and OTP are required'
                    });
                    return;
                }
                // Verify OTP
                const result = yield this.verifyOtpUseCase.execute(phoneNumber, email, otp);
                if (result) {
                    // Generate tokens and get user data
                    const user = yield this.authService.getUserByPhoneNumber(phoneNumber);
                    const tokens = yield this.authService.generateTokens(user);
                    res.status(200).json({
                        success: true,
                        message: "OTP verified successfully",
                        tokens: tokens,
                        user: user
                    });
                }
                else {
                    throw new Error('OTP verification failed');
                }
            }
            catch (error) {
                console.error('❌ OTP Verification Error:', error);
                res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
        });
    }
}
exports.AuthController = AuthController;
