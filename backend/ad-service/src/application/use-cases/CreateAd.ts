import { IAdRepository } from "../../domain/repositories/IAdRepository";
import { StripePaymentService } from "../../infrastructure/payment/StripePaymentService";
import { CreateAdDTO } from "../dto/CreateAdDTO";
import { Ad } from "../../domain/entities/Ad";

type AdPlacement = "sidebar" | "topbar" | "popup";

export class CreateAdUseCase {
    constructor(
        private adRepository: IAdRepository,
        private paymentService: StripePaymentService
    ) {}
  
    async execute(adData: CreateAdDTO, paymentMethod: string): Promise<Ad> {
        const priceMap: Record<AdPlacement, number> = {
            sidebar: 50,
            topbar: 100,
            popup: 150
        };
  
        if (!priceMap[adData.placement as AdPlacement]) {
            throw new Error("Invalid ad placement.");
        }
  
        // Process payment before ad creation
        await this.paymentService.processPayment(
            priceMap[adData.placement as AdPlacement],
            "usd",
            paymentMethod
        );
  
        const newAd = new Ad(
            "",
            adData.advertiserId,
            adData.title,
            adData.description,
            adData.imageUrl,
            adData.targetUrl,
            adData.placement,
            priceMap[adData.placement as AdPlacement],
            "pending",
            new Date(),
            new Date()
        )
  
        return await this.adRepository.createAd(newAd);
    }
}
  