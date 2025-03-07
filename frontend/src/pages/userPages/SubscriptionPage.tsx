import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useCreateSubscriptionMutation } from '../../store/slices/userApiSlice'; // Import mutation

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [createSubscription] = useCreateSubscriptionMutation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const token = localStorage.getItem('userToken');
    if (!token) {
      setError('Please log in to subscribe');
      setLoading(false);
      return;
    }

    const decodedToken = jwtDecode<{ userId?: string }>(token);
    const userId = decodedToken.userId
    const cardElement = elements.getElement(CardElement);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement!,
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment method creation failed');
        setLoading(false);
        return;
      }

      const result = await createSubscription({ userId, paymentMethodId: paymentMethod!.id }).unwrap();
      const { clientSecret } = result;

      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);

      if (confirmError) {
        setError(confirmError.message || 'Payment confirmation failed');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Subscribe to Premium</h2>
        <p className="text-gray-600 mb-6 text-center">Enjoy an ad-free experience for $5/month!</p>
        <CardElement className="p-3 border rounded-md mb-4" />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full py-3 bg-orange-700 text-white rounded-full hover:bg-orange-600 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Subscribe Now'}
        </button>
      </form>
    </div>
  );
};

const SubscriptionPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default SubscriptionPage;