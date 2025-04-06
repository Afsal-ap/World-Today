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
exports.OTPController = void 0;
class OTPController {
    constructor(sendOtpUseCase, verifyOtpUseCase) {
        this.sendOtpUseCase = sendOtpUseCase;
        this.verifyOtpUseCase = verifyOtpUseCase;
    }
    sendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phoneNumber, email } = req.body;
                console.log('📞 Sending OTP to:', phoneNumber);
                if (!phoneNumber) {
                    res.status(400).json({ success: false, message: "Phone number is required" });
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
                const result = yield this.verifyOtpUseCase.execute(phoneNumber, email, otp);
                res.status(200).json({
                    success: true,
                    message: 'OTP verified successfully',
                    data: result
                });
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
exports.OTPController = OTPController;
