"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryImpl = void 0;
const user_1 = require("../../domain/entities/user");
const mongoose_connection_1 = require("../db/mongoose-connection");
class UserRepositoryImpl {
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield mongoose_connection_1.UserModel.create({
                email: user.email,
                password: user.password,
                name: user.name,
                phone: user.phone,
                lastLogin: user.lastLogin,
                isAdmin: user.isAdmin,
                isBlocked: user.isBlocked,
                stripeCustomerId: user.stripeCustomerId,
                subscriptionId: user.subscriptionId,
                subscriptionStatus: user.subscriptionStatus,
            });
            return new user_1.User({
                id: newUser._id.toString(),
                email: newUser.email,
                password: newUser.password || undefined,
                name: newUser.name,
                phone: newUser.phone,
                lastLogin: newUser.lastLogin,
                isAdmin: newUser.isAdmin,
                isBlocked: newUser.isBlocked,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
                stripeCustomerId: newUser.stripeCustomerId || undefined,
                subscriptionId: newUser.subscriptionId || undefined,
                subscriptionStatus: newUser.subscriptionStatus,
            });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDoc = yield mongoose_connection_1.UserModel.findOne({ email }).exec();
            if (!userDoc)
                return null;
            return new user_1.User({
                id: userDoc._id.toString(),
                email: userDoc.email,
                password: userDoc.password || undefined,
                name: userDoc.name,
                phone: userDoc.phone,
                lastLogin: userDoc.lastLogin,
                isAdmin: userDoc.isAdmin,
                isBlocked: userDoc.isBlocked,
                createdAt: userDoc.createdAt,
                updatedAt: userDoc.updatedAt,
                stripeCustomerId: userDoc.stripeCustomerId || undefined,
                subscriptionId: userDoc.subscriptionId || undefined,
                subscriptionStatus: userDoc.subscriptionStatus,
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDoc = yield mongoose_connection_1.UserModel.findById(id).exec();
            if (!userDoc)
                return null;
            return new user_1.User({
                id: userDoc._id.toString(),
                email: userDoc.email,
                password: userDoc.password || undefined,
                name: userDoc.name,
                phone: userDoc.phone,
                lastLogin: userDoc.lastLogin,
                isAdmin: userDoc.isAdmin,
                isBlocked: userDoc.isBlocked,
                createdAt: userDoc.createdAt,
                updatedAt: userDoc.updatedAt,
                stripeCustomerId: userDoc.stripeCustomerId || undefined,
                subscriptionId: userDoc.subscriptionId || undefined,
                subscriptionStatus: userDoc.subscriptionStatus,
            });
        });
    }
    findAll(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield mongoose_connection_1.UserModel.find()
                    .select('-password') // Exclude password from results
                    .skip(skip)
                    .limit(limit)
                    .lean()
                    .exec();
                return users.map((user) => new user_1.User({
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    lastLogin: user.lastLogin,
                    isAdmin: user.isAdmin,
                    isBlocked: user.isBlocked,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    stripeCustomerId: user.stripeCustomerId || undefined,
                    subscriptionId: user.subscriptionId || undefined,
                    subscriptionStatus: user.subscriptionStatus,
                    password: undefined, // Explicitly set to undefined since excluded
                }));
            }
            catch (error) {
                console.error('Error in findAll:', error);
                throw error;
            }
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalUsers = yield mongoose_connection_1.UserModel.countDocuments();
            const activeUsers = yield mongoose_connection_1.UserModel.countDocuments({
                lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            });
            return { totalUsers, activeUsers };
        });
    }
    getActiveUsers(period) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupBy = period === "daily"
                ? { $dateToString: { format: "%Y-%m-%d", date: "$lastLogin" } }
                : { $isoWeek: "$lastLogin" };
            const activeUsers = yield mongoose_connection_1.UserModel.aggregate([
                { $match: { lastLogin: { $exists: true } } },
                { $group: { _id: groupBy, uniqueUsers: { $addToSet: "$_id" } } },
                { $project: { _id: 1, count: { $size: "$uniqueUsers" } } },
                { $sort: { _id: 1 } } // Sort by date
            ]);
            return activeUsers;
        });
    }
    updateUserStatus(userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoose_connection_1.UserModel.findByIdAndUpdate(userId, { isAdmin, updatedAt: new Date() }, { new: true }).exec();
            if (!result) {
                throw new Error('User not found');
            }
        });
    }
    updateUserBlockStatus(userId, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield mongoose_connection_1.UserModel.findByIdAndUpdate(userId, { isBlocked, updatedAt: new Date() }, { new: true }).exec();
            if (!updatedUser) {
                throw new Error('User not found');
            }
        });
    }
    update(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield mongoose_connection_1.UserModel.findByIdAndUpdate(userId, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true }).exec();
            if (!updatedUser)
                return null;
            return new user_1.User({
                id: updatedUser._id.toString(),
                email: updatedUser.email,
                password: updatedUser.password || undefined,
                name: updatedUser.name,
                phone: updatedUser.phone,
                lastLogin: updatedUser.lastLogin,
                isAdmin: updatedUser.isAdmin,
                isBlocked: updatedUser.isBlocked,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
                stripeCustomerId: updatedUser.stripeCustomerId || undefined,
                subscriptionId: updatedUser.subscriptionId || undefined,
                subscriptionStatus: updatedUser.subscriptionStatus,
            });
        });
    }
}
exports.UserRepositoryImpl = UserRepositoryImpl;
