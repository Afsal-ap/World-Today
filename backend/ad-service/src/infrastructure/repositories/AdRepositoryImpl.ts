import { Ad } from "../../domain/entities/Ad";
import { IAdRepository } from "../../domain/repositories/IAdRepository";
import { AdModel } from "../db/models/AdModel";

export class AdRepositoryImpl implements IAdRepository {
  async createAd(ad: Ad): Promise<Ad> {
    const newAd = new AdModel(ad);
    const savedAd = await newAd.save();
    return savedAd.toObject() as Ad;
  }

  async getAdsByAdvertiser(advertiserId: string): Promise<Ad[]> {
    return await AdModel.find({ advertiserId }).lean() as Ad[];
  }

  async updateAdStatus(adId: string, status: string): Promise<void> {
    await AdModel.findByIdAndUpdate(adId, { status });
  }

  async deleteAd(adId: string): Promise<void> {
    await AdModel.findByIdAndDelete(adId);
  }

  async getActiveAds(): Promise<Ad[]> {
    return await AdModel.find({ 
       status: "pending",
      //  startDate: { $lte: new Date() },
      //  endDate: { $gte: new Date() }
    }).lean() as Ad[];
  }
}
