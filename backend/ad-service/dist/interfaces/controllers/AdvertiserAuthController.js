"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertiserAuthController = void 0;
class AdvertiserAuthController {
    constructor(advertiserAuthUseCase) {
        this.advertiserAuthUseCase = advertiserAuthUseCase;
    }
    async register(req, res) {
        try {
            await this.advertiserAuthUseCase.registerAdvertiser(req.body);
            res.status(201).json({ message: 'Registration successful. Please check your email for OTP.' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async login(req, res) {
        try {
            const tokens = await this.advertiserAuthUseCase.login(req.body.email, req.body.password);
            res.status(200).json(tokens);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
    async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            await this.advertiserAuthUseCase.verifyOtp(email, otp);
            res.status(200).json({ message: 'Email verified successfully' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.AdvertiserAuthController = AdvertiserAuthController;
//# sourceMappingURL=AdvertiserAuthController.js.map