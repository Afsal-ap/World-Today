import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface PaymentFormProps {
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // Confirm the payment with Stripe.js
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/advertiser/payment-success',
      },
      redirect: 'if_required',
    });

    setIsLoading(false);

    if (error) {
      // Show error to your customer
      setErrorMessage(error.message || 'An unexpected error occurred');
    } else {
      // Payment succeeded, call the success callback
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
        <PaymentElement />
      </div>
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={`w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          isLoading || !stripe ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
        }`}
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default PaymentForm;