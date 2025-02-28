import { Request, Response } from "express";
import { CreateAdUseCase } from "../../application/use-cases/CreateAd";
import { AdRepositoryImpl } from "../../infrastructure/repositories/AdRepositoryImpl";
import { StripePaymentService } from "../../infrastructure/payment/StripePaymentService";

const adRepository = new AdRepositoryImpl();
const paymentService = new StripePaymentService();
const createAdUseCase = new CreateAdUseCase(adRepository, paymentService);

export class AdController {
  static async create(req: Request, res: Response) {
    try {
      const { advertiserId, title, description, imageUrl, targetUrl, placement, paymentMethod } = req.body;
      const ad = await createAdUseCase.execute({ advertiserId, title, description, imageUrl, targetUrl, placement }, paymentMethod);
      res.status(201).json({ message: "Ad created successfully", ad });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getByAdvertiser(req: Request, res: Response) {
    try {
      const { advertiserId } = req.params;
      const ads = await adRepository.getAdsByAdvertiser(advertiserId);
      res.json(ads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ads" });
    }
  }
}
