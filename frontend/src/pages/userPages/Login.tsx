import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../store/slices/userApiSlice';
import { NewspaperIcon } from '@heroicons/react/24/outline';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const result = await login({ email, password }).unwrap();
            if (result.success) {
                localStorage.setItem('userToken', result.tokens.accessToken);
                navigate('/');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err?.data?.message || err?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Section */}
            <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 animated-gradient"
                style={{
                    background: 'linear-gradient(90deg, #b22e7b, #1e4b9e, #b22e7b)',
                    backgroundSize: '300% 300%',
                    animation: 'gradientMove 8s infinite',
                }}>
                <NewspaperIcon className="h-20 w-20 text-white mb-8" />
                <h1 className="text-4xl font-bold text-white mb-4">World Today</h1>
                <p className="text-blue-200 text-center text-lg">
                    Your trusted source for breaking news and in-depth analysis
                </p>
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold text-center mb-8"
                            style={{
                                background: 'linear-gradient(90deg, #6a0dad, #8a2be2, #c154c1, #6a0dad)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundSize: '300% 300%',
                                animation: 'gradientMove 8s infinite',
                            }}>
                            Welcome Back
                        </h2>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative text-center" role="alert">
                                {error}
                            </div>
                        )}
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-purple-900 hover:text-purple-800">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 bg-gradient-to-r from-purple-950 via-purple-800 to-purple-700 
                                text-white rounded-lg transition-all duration-300 
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-90'}`}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>

                        <div className="text-center">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <a href="/register" className="text-blue-900 hover:underline font-semibold">
                                    Register here
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
