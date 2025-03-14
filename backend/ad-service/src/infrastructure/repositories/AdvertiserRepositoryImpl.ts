import { Advertiser } from "../../domain/entities/Advertiser";
import { AdvertiserRepository } from "../../domain/repositories/AdvertiserRepository";
import { AdModel } from "../db/models/AdModel";
import AdvertiserModel from "../db/models/advertiserModel";

export class AdvertiserRepositoryImpl implements AdvertiserRepository {
    async createAdvertiser(advertiser: Advertiser): Promise<Advertiser> {
        const newAdvertiser = new AdvertiserModel(advertiser);
        return await newAdvertiser.save();
    }

    async findByEmail(email: string): Promise<Advertiser | null> {
        return await AdvertiserModel.findOne({ email });
    }

    async findById(advertiserId: string): Promise<Advertiser | null> {
        return await AdvertiserModel.findById(advertiserId);
    }

    async updateAdvertiser(advertiserId: string, advertiser: Partial<Advertiser>): Promise<void> {
        await AdvertiserModel.findByIdAndUpdate(advertiserId, advertiser);
    }

    async save(advertiser: Partial<Advertiser>): Promise<void> {
        const newAdvertiser = new AdvertiserModel(advertiser);
        await newAdvertiser.save();
    }
    async count(): Promise<{ totalAdvertisers: number; totalAds: number; adRevenue: number }> {
        const totalAds = await AdModel.countDocuments().exec();
        const totalAdvertisers = await AdvertiserModel.countDocuments().exec(); 
    
        const adRevenueResult = await AdModel.aggregate([
            { $match: { status: "pending" } }, // Consider only approved ads
            { $group: { _id: null, totalRevenue: { $sum: "$price" } } } // Sum up the price
        ]);
      console.log(adRevenueResult, "amount");
      
        // Extract totalRevenue or default to 0 if no ads exist
        const adRevenue = adRevenueResult.length > 0 ? adRevenueResult[0].totalRevenue : 0;
    
        return {
            totalAds,
            totalAdvertisers,
            adRevenue
        };
    }
    
}