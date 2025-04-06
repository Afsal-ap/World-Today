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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const stripe_1 = __importDefault(require("stripe"));
class StripeService {
    constructor() {
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            // @ts-ignore
            apiVersion: "2023-10-16",
        });
    }
    createCustomer(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            // Your existing implementation
            const customer = yield this.stripe.customers.create({
                email,
                name,
            });
            return customer.id;
        });
    }
    createSubscription(customerId, paymentMethodId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Your existing implementation
            // ...
            return {}; // Replace with your actual implementation
        });
    }
    isSubscriptionActive(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscription = yield this.stripe.subscriptions.retrieve(subscriptionId);
                return subscription.status === 'active';
            }
            catch (error) {
                console.error('Error checking subscription status:', error);
                return false;
            }
        });
    }
}
exports.StripeService = StripeService;
