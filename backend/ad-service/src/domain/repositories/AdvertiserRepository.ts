import { Advertiser } from "../entities/Advertiser";

export interface AdvertiserRepository {
    createAdvertiser(advertiser: Advertiser): Promise<Advertiser>;
    findByEmail(email: string): Promise<Advertiser | null>;
    findById(advertiserId: string): Promise<Advertiser | null>;
    updateAdvertiser(advertiserId: string, advertiser: Partial<Advertiser>): Promise<void>;
    save(advertiser: Partial<Advertiser>): Promise<void>;
} 