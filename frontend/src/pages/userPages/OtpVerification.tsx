import { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useVerifyOtpMutation, useSendOtpMutation } from '../../store/slices/userApiSlice';

const OtpVerification = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const [verifyOtp] = useVerifyOtpMutation();
    const [resendOtp] = useSendOtpMutation();

    const [timer, setTimer] = useState(30); // 30 seconds timer
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        // Start timer when component mounts
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }

        // Cleanup interval
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [timer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await verifyOtp({
                email: location.state?.email,
                otp,
                userData: location.state?.registrationData
            }).unwrap();

            console.log('Verification result:', result);

            if (result.success) {
                // Store token if available
                if (result.tokens?.accessToken) {
                    localStorage.setItem('userToken', result.tokens.accessToken);
                }
                navigate('/login');
            } else {
                setError('Verification failed. Please try again.');
            }
        } catch (err: any) {
            console.error('Verification error:', err);
            setError(err.data?.message || 'Verification failed');
        }
    };

    const handleResendOtp = async () => {
        try {
            setCanResend(false);
            setTimer(30); // Reset timer to 30 seconds
            await resendOtp({ email }).unwrap();
            setError('');
            alert('New OTP sent successfully!');
        } catch (err: any) {
            setError(err?.data?.message || 'Failed to resend OTP');
        }
    };

    if (!email) {
        return <Navigate to="/register" />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Verify Your Email</h2>
                <p className="text-gray-600 text-center mb-6">
                    We've sent a verification code to {email}
                </p>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-950 via-purple-800 to-purple-700 text-white rounded-lg hover:bg-blue-800 transition-all duration-300 hover:scale-95"
                    >
                        Verify OTP
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <button
                        onClick={handleResendOtp}
                        disabled={!canResend}
                        className={`w-full py-3 px-4 ${
                            canResend 
                                ? 'bg-gradient-to-r from-purple-950 via-purple-800 to-purple-700 text-white hover:scale-90' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        } rounded-lg transition-all duration-300`}
                    >
                        {canResend 
                            ? 'Resend OTP' 
                            : `Resend OTP in ${timer}s`
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OtpVerification; 