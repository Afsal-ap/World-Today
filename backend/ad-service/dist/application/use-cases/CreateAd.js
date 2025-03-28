"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAdUseCase = void 0;
const Ad_1 = require("../../domain/entities/Ad");
class CreateAdUseCase {
    constructor(adRepository, paymentService) {
        this.adRepository = adRepository;
        this.paymentService = paymentService;
    }
    async execute(adData, paymentIntentId) {
        const priceMap = {
            popup: 50,
            card: 100,
        };
        if (!priceMap[adData.placement]) {
            throw new Error("Invalid ad placement.");
        }
        const isPaymentConfirmed = await this.paymentService.confirmPayment(paymentIntentId);
        if (!isPaymentConfirmed) {
            throw new Error("Payment not confirmed");
        }
        const newAd = new Ad_1.Ad("", adData.advertiserId, adData.title, adData.description, adData.imageUrl, adData.placement, priceMap[adData.placement], "pending", new Date(), new Date());
        return await this.adRepository.createAd(newAd);
    }
}
exports.CreateAdUseCase = CreateAdUseCase;
//# sourceMappingURL=CreateAd.js.map