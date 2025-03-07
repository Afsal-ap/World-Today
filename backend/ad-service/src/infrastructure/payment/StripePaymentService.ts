import Stripe from 'stripe';
import { IPaymentService } from '../../domain/services/IPaymentService';

export class StripePaymentService implements IPaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-02-24.acacia', // Use the latest API version
    });
  }

  async createPaymentIntent(amount: number, currency: string): Promise<{ clientSecret: string; paymentIntentId: string }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      throw new Error(`Failed to create payment intent: ${(error as Error).message}`);
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<boolean> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent.status === 'succeeded';
    } catch (error) {
      throw new Error(`Payment confirmation failed: ${(error as Error).message}`);
    }
  }

  // New method to check payment status
  async checkPaymentStatus(paymentIntentId: string): Promise<string> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent.status;
    } catch (error) {
      throw new Error(`Failed to check payment status: ${(error as Error).message}`);
    }
  }
}