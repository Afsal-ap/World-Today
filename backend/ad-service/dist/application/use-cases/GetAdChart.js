"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdChartUsecase = void 0;
class GetAdChartUsecase {
    constructor(adRepository) {
        this.adRepository = adRepository;
    }
    async execute(period) {
        return await this.adRepository.getAdCountsByDate(period);
    }
}
exports.GetAdChartUsecase = GetAdChartUsecase;
//# sourceMappingURL=GetAdChart.js.map