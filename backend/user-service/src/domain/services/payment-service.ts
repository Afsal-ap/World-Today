export interface IPaymentService {
  createCustomer(email: string, name: string): Promise<string>;
  createSubscription(customerId: string, paymentMethodId: string): Promise<any>;
  isSubscriptionActive(subscriptionId: string): Promise<boolean>;
  // Other methods...
}
