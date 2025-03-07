import Stripe from 'stripe';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }

  async createCustomer(userId: string, paymentMethodId: string): Promise<Stripe.Customer> {
    // Create customer without payment_method
    const customer = await this.stripe.customers.create({
      metadata: { userId },
    });

    // Attach payment method to the customer
    await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    // Set the attached payment method as the default
    await this.stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    return customer;
  }

  async createSubscription(customerId: string): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: 'price_1Qzz9eLJGKouWmFeYTfAWqkC' }], // Replace with your actual Price ID
      expand: ['latest_invoice.payment_intent'],
      payment_behavior: 'default_incomplete', // Ensures payment method is charged
    });
  }
}
