import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-02-24.acacia" });

export class StripePaymentService {
  async processPayment(amount: number, currency: string, paymentMethod: string) {
    try {
      // Simple, direct approach
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency,
        payment_method: paymentMethod,
        confirm: true,
        payment_method_types: ['card']
      });
  
      return paymentIntent;
    } catch (error) {
      throw new Error(`Payment failed: ${(error as Error).message}`);
    }
  }
}
