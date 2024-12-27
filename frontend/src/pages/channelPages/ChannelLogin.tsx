import { useFormik } from 'formik';
import * as Yup from 'yup';
import { NewspaperIcon } from '@heroicons/react/24/outline';
import { useChannelLoginMutation } from '../../store/slices/channelApiSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ChannelLogin = () => {
  const [login, { isLoading }] = useChannelLoginMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('channelToken');
    if (token) {
      navigate('/channel/home', { replace: true });
    }
  }, [navigate]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
    password: Yup.string()
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await login(values).unwrap();
        localStorage.setItem('channelToken', response.accessToken);
        navigate('/channel/home', { 
          replace: true,
          state: { channelData: response.channelData }
        });
      } catch (err: any) {
        console.error('Login error:', err);
        formik.setStatus(err?.data?.message || 'Login failed');
      }
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 bg-gradient-to-r from-purple-900 to-indigo-900">
        <NewspaperIcon className="h-20 w-20 text-white mb-8" />
        <h1 className="text-4xl font-bold text-white mb-4">Welcome Back</h1>
        <p className="text-blue-200 text-center text-lg">
          Continue sharing your stories with the world
        </p>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-8 text-center text-purple-900">
            Channel Login
          </h2>

          {formik.status && (
            <div className="text-red-500 text-center mb-4">{formik.status}</div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                {...formik.getFieldProps('email')}
                className={`w-full px-4 py-3 rounded-lg border ${
                  formik.touched.email && formik.errors.email
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                {...formik.getFieldProps('password')}
                className={`w-full px-4 py-3 rounded-lg border ${
                  formik.touched.password && formik.errors.password
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !formik.isValid}
              className={`w-full py-3 px-4 rounded-lg text-white transition-all duration-300 ${
                isLoading || !formik.isValid
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-900 hover:bg-purple-800'
              }`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have a channel?{' '}
              <a
                href="/channel/register"
                className="text-purple-900 hover:underline font-semibold"
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelLogin;
