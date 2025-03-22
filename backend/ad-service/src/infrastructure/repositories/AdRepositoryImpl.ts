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

  
  async getAdCountsByDate(period: 'daily' | 'weekly'): Promise<{ date: string; count: number }[]> {
    try {
      let dateFormat = "%Y-%m-%d"; // Default: Daily
      if (period === "weekly") {
        dateFormat = "%Y-%U"; // Weekly (Year-Week Number)
      }
  
      const adCounts = await AdModel.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      return adCounts.map(item => ({
        date: item._id,
        count: item.count
      }));
    } catch (error) {
      console.error("Error fetching post counts:", error);
      throw new Error("Failed to fetch post counts by date");
    }
  }
}
