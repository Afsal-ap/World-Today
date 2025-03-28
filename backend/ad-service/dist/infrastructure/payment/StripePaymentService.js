"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripePaymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
class StripePaymentService {
    constructor() {
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-02-24.acacia',
        });
    }
    async createPaymentIntent(amount, currency) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amount * 100,
                currency,
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            };
        }
        catch (error) {
            throw new Error(`Failed to create payment intent: ${error.message}`);
        }
    }
    async confirmPayment(paymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            return paymentIntent.status === 'succeeded';
        }
        catch (error) {
            throw new Error(`Payment confirmation failed: ${error.message}`);
        }
    }
    async checkPaymentStatus(paymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            return paymentIntent.status;
        }
        catch (error) {
            throw new Error(`Failed to check payment status: ${error.message}`);
        }
    }
}
exports.StripePaymentService = StripePaymentService;
//# sourceMappingURL=StripePaymentService.js.map