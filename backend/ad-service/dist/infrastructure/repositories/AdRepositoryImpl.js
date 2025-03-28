"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdRepositoryImpl = void 0;
const AdModel_1 = require("../db/models/AdModel");
class AdRepositoryImpl {
    async createAd(ad) {
        const newAd = new AdModel_1.AdModel(ad);
        const savedAd = await newAd.save();
        return savedAd.toObject();
    }
    async getAdsByAdvertiser(advertiserId) {
        return await AdModel_1.AdModel.find({ advertiserId }).lean();
    }
    async updateAdStatus(adId, status) {
        await AdModel_1.AdModel.findByIdAndUpdate(adId, { status });
    }
    async deleteAd(adId) {
        await AdModel_1.AdModel.findByIdAndDelete(adId);
    }
    async getActiveAds() {
        return await AdModel_1.AdModel.find({
            status: "pending",
        }).lean();
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
exports.AdRepositoryImpl = AdRepositoryImpl;
//# sourceMappingURL=AdRepositoryImpl.js.map