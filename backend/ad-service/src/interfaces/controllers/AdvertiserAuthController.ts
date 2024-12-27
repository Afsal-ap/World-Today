import { Request, Response } from 'express';
import { AdvertiserAuthUseCase } from '../../application/use-cases/AdvertiserAuthUseCase';

export class AdvertiserAuthController {
    constructor(private advertiserAuthUseCase: AdvertiserAuthUseCase) {}

    async register(req: Request, res: Response) {
        try {
            await this.advertiserAuthUseCase.registerAdvertiser(req.body);
            res.status(201).json({ message: 'Registration successful. Please check your email for OTP.' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const tokens = await this.advertiserAuthUseCase.login(req.body);
            res.status(200).json(tokens);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
} 