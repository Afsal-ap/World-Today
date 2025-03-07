import { IAdRepository } from "../../domain/repositories/IAdRepository";
import { StripePaymentService } from "../../infrastructure/payment/StripePaymentService";
import { CreateAdDTO } from "../dto/CreateAdDTO";
import { Ad } from "../../domain/entities/Ad";

export type AdPlacement = "popup" | "card";

export class CreateAdUseCase {
    constructor(
        private adRepository: IAdRepository,
        private paymentService: StripePaymentService
    ) {}
  
    async execute(adData: CreateAdDTO, paymentIntentId: string): Promise<Ad> {
        const priceMap: Record<AdPlacement, number> = {
            popup: 50,
            card: 100,
            
        };
  
        if (!priceMap[adData.placement as AdPlacement]) {
            throw new Error("Invalid ad placement.");
        }
  
        // Confirm payment before ad creation
        const isPaymentConfirmed = await this.paymentService.confirmPayment(paymentIntentId);
        if (!isPaymentConfirmed) {
            throw new Error("Payment not confirmed");
        }
  
        const newAd = new Ad(
            "",
            adData.advertiserId,
            adData.title,
            adData.description,
            adData.imageUrl,
            adData.placement,
            priceMap[adData.placement as AdPlacement],
            "pending",
            new Date(),
            new Date()
        )
  
        return await this.adRepository.createAd(newAd);
    }
}
  