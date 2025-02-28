import { Advertiser } from "../../domain/entities/Advertiser";
import { AdvertiserRepository } from "../../domain/repositories/AdvertiserRepository";
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
} 