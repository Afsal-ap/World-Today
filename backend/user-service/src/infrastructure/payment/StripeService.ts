import Stripe from 'stripe';
import { IPaymentService } from '../../domain/services/payment-service';

export class StripeService implements IPaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16', // Use the latest API version or the one you're using
    });
  }

  async createCustomer(email: string, name: string): Promise<string> {
    // Your existing implementation
    const customer = await this.stripe.customers.create({
      email,
      name,
    });
    return customer.id;
  }

  async createSubscription(customerId: string, paymentMethodId: string): Promise<any> {
    // Your existing implementation
    // ...
    return {}; // Replace with your actual implementation
  }

  async isSubscriptionActive(subscriptionId: string): Promise<boolean> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription.status === 'active';
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  // Other methods...
}
