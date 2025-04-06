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
exports.GetSubscriptionStatusUseCase = void 0;
class GetSubscriptionStatusUseCase {
    constructor(userRepository, stripeService) {
        this.userRepository = userRepository;
        this.stripeService = stripeService;
    }
    execute(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            // If user has subscription status in database, use that
            if (user.subscriptionStatus === 'active') {
                return true;
            }
            // If user has a Stripe subscription ID, verify with Stripe
            if (user.subscriptionId) {
                const isActive = yield this.stripeService.isSubscriptionActive(user.subscriptionId);
                // Update user's subscription status in database if needed
                if (isActive && user.subscriptionStatus !== 'active') {
                    yield this.userRepository.update(user.id, {
                        subscriptionStatus: 'active'
                    });
                }
                else if (!isActive && user.subscriptionStatus === 'active') {
                    yield this.userRepository.update(user.id, {
                        subscriptionStatus: 'inactive'
                    });
                }
                return isActive;
            }
            return false;
        });
    }
}
exports.GetSubscriptionStatusUseCase = GetSubscriptionStatusUseCase;
