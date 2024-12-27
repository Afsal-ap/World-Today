import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChannelVerifyOtpMutation } from '../../store/slices/channelApiSlice';

const ChannelOtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [verifyOtp, { isLoading }] = useChannelVerifyOtpMutation();

  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('channelToken');
    if (token) {
        navigate('/channel/home', { replace: true });
        return;
    }
    if (!email) {
        navigate('/channel/register', { replace: true });
        return;
    }
  }, [email, navigate]);

  useEffect(() => {
    if (!email) {
      navigate('/channel/register');
      return;
    }

    let interval: NodeJS.Timeout;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer, canResend, email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      await verifyOtp({ email, otp }).unwrap();
      navigate('/channel/login', { 
        replace: true,
        state: { message: 'Email verified successfully. Please login.' } 
      });
    } catch (err: any) {
      setError(err?.data?.error || 'Verification failed');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleResendOtp = async () => {
    try {
      // Add resend OTP mutation here if needed
      setCanResend(false);
      setTimer(300);
    } catch (err: any) {
      setError(err?.data?.error || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-purple-100 p-3">
            <svg
              className="h-12 w-12 text-purple-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M34 24v-4c0-5.523-4.477-10-10-10S14 14.477 14 20v4m20 0l-4 4m4-4l-4-4m-16 4l4 4m-4-4l4-4m-4 4h20"
              />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a verification code to<br />
          <span className="font-medium text-purple-900">{email}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="sr-only">
                OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => {
                  setError('');
                  setOtp(e.target.value.replace(/\D/g, ''));
                }}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Enter 6-digit OTP"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading || otp.length !== 6
                    ? 'bg-purple-300 cursor-not-allowed'
                    : 'bg-purple-900 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                }`}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend}
                className={`text-sm ${
                  canResend
                    ? 'text-purple-900 hover:text-purple-800 cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                {canResend ? 'Resend OTP' : `Resend OTP in ${formatTime(timer)}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChannelOtpVerification; 