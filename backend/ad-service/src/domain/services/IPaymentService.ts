// domain/services/IPaymentService.ts

export interface IPaymentService {
    /**
     * Create a payment intent to be used with Stripe Elements
     * 
     * @param amount - The payment amount in the currency's base unit
     * @param currency - The three-letter currency code (e.g., 'usd')
     * @returns Object containing the client secret and payment intent ID
     */
    createPaymentIntent(amount: number, currency: string): Promise<{ 
      clientSecret: string; 
      paymentIntentId: string 
    }>;
  
    /**
     * Confirm if a payment has been successfully processed
     * 
     * @param paymentIntentId - The ID of the payment intent to check
     * @returns Boolean indicating if payment was successful
     */
    confirmPayment(paymentIntentId: string): Promise<boolean>;
    
    /**
     * Check the current status of a payment intent
     * 
     * @param paymentIntentId - The ID of the payment intent to check
     * @returns String representing the payment status (e.g., 'succeeded', 'processing', 'requires_payment_method')
     */
    checkPaymentStatus(paymentIntentId: string): Promise<string>;
  }