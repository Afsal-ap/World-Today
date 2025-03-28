"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdvertiserStatsUsecase = void 0;
class getAdvertiserStatsUsecase {
    constructor(advertiserRepository) {
        this.advertiserRepository = advertiserRepository;
    }
    async execute() {
        const { totalAdvertisers, totalAds, adRevenue } = await this.advertiserRepository.count();
        return {
            status: 'success',
            totalAdvertisers,
            totalAds,
            adRevenue
        };
    }
}
exports.getAdvertiserStatsUsecase = getAdvertiserStatsUsecase;
//# sourceMappingURL=GetAdvertiserStats.js.map