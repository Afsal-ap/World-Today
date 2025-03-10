import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVerifyOtpMutation } from '../../store/slices/adApiSlice';

const AdvertiserOtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email information is missing. Please go back to registration.');
      return;
    }
    
    try {
      await verifyOtp({ email, otp }).unwrap();
      navigate('/advertiser/login', { state: { verified: true } });
    } catch (err: any) {
      const errorMessage = err.data?.message || err.data?.error || 'Verification failed. Please try again.';
      setError(errorMessage);
      console.error('OTP verification error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a verification code to {email}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 text-red-600 text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                placeholder="Enter 6-digit code"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !otp}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdvertiserOtpVerification; 