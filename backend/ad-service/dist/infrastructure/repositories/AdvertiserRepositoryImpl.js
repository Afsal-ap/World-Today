"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertiserRepositoryImpl = void 0;
const AdModel_1 = require("../db/models/AdModel");
const advertiserModel_1 = __importDefault(require("../db/models/advertiserModel"));
class AdvertiserRepositoryImpl {
    async createAdvertiser(advertiser) {
        const newAdvertiser = new advertiserModel_1.default(advertiser);
        return await newAdvertiser.save();
    }
    async findByEmail(email) {
        return await advertiserModel_1.default.findOne({ email });
    }
    async findById(advertiserId) {
        return await advertiserModel_1.default.findById(advertiserId);
    }
    async updateAdvertiser(advertiserId, advertiser) {
        await advertiserModel_1.default.findByIdAndUpdate(advertiserId, advertiser);
    }
    async save(advertiser) {
        const newAdvertiser = new advertiserModel_1.default(advertiser);
        await newAdvertiser.save();
    }
    async count() {
        const totalAds = await AdModel_1.AdModel.countDocuments().exec();
        const totalAdvertisers = await advertiserModel_1.default.countDocuments().exec();
        const adRevenueResult = await AdModel_1.AdModel.aggregate([
            { $match: { status: "pending" } },
            { $group: { _id: null, totalRevenue: { $sum: "$price" } } }
        ]);
        console.log(adRevenueResult, "amount");
        const adRevenue = adRevenueResult.length > 0 ? adRevenueResult[0].totalRevenue : 0;
        return {
            totalAds,
            totalAdvertisers,
            adRevenue
        };
    }
    async getAdCountsByDate(period) {
        try {
            let dateFormat = "%Y-%m-%d";
            if (period === "weekly") {
                dateFormat = "%Y-%U";
            }
            const adCounts = await AdModel_1.AdModel.aggregate([
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
        }
        catch (error) {
            console.error("Error fetching post counts:", error);
            throw new Error("Failed to fetch post counts by date");
        }
    }
}
exports.AdvertiserRepositoryImpl = AdvertiserRepositoryImpl;
//# sourceMappingURL=AdvertiserRepositoryImpl.js.map