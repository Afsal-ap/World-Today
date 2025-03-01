import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-02-24.acacia" });

export class StripePaymentService {
  async createPaymentIntent(amount: number, currency: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
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
    } catch (error) {
      throw new Error(`Failed to create payment intent: ${(error as Error).message}`);
    }
  }

  async processPayment(amount: number, currency: string, paymentMethodId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency,
        payment_method: paymentMethodId,
        confirm: true,
        confirmation_method: 'manual',
      });

      return paymentIntent.status === 'succeeded';
    } catch (error) {
      throw new Error(`Payment processing failed: ${(error as Error).message}`);
    }
  }

  async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent.status === 'succeeded';
    } catch (error) {
      throw new Error(`Payment confirmation failed: ${(error as Error).message}`);
    }
  }
}
