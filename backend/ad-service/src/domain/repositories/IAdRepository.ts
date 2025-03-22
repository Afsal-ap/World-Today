import { Ad } from "../entities/Ad";

export interface IAdRepository {
  createAd(ad: Ad): Promise<Ad>;
  getAdsByAdvertiser(advertiserId: string): Promise<Ad[]>;
  updateAdStatus(adId: string, status: string): Promise<void>;
  getActiveAds(): Promise<Ad[]>;
  deleteAd(adId: string): Promise<void>;

}
