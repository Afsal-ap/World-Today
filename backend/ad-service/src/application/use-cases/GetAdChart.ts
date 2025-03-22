import { AdvertiserRepository } from "../../domain/repositories/AdvertiserRepository";

export class GetAdChartUsecase {
    constructor(private readonly adRepository: AdvertiserRepository) {}

    async execute(period: 'daily' | 'weekly') {  
        return await this.adRepository.getAdCountsByDate(period);
    }
}
