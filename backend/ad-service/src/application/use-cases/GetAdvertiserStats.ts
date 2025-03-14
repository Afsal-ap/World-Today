import { AdvertiserRepository } from '../../domain/repositories/AdvertiserRepository'; 


export class getAdvertiserStatsUsecase{
   constructor(private readonly advertiserRepository: AdvertiserRepository){}

   async execute(){
      const {totalAdvertisers, totalAds, adRevenue} = await this.advertiserRepository.count();

      return {
        status: 'success',
        totalAdvertisers,
        totalAds,
        adRevenue
      }
   } 
}
