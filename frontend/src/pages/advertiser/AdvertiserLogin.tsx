import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAdvertiserLoginMutation } from '../../store/slices/adApiSlice';

const AdvertiserLogin = () => {
  const [login, { isLoading }] = useAdvertiserLoginMutation();
  const navigate = useNavigate();
  console.log(process.env.NEXT_PUBLIC_API_URL,"env");

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await login(values).unwrap();
        localStorage.setItem('advertiserToken', result.accessToken);
        localStorage.setItem('advertiserRefreshToken', result.refreshToken);
        navigate('/advertiser/dashboard');
      } catch (err: any) {
        formik.setStatus(err.data?.error || 'Login failed');
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {formik.status && (
            <div className="mb-4 text-red-600 text-center">{formik.status}</div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...formik.getFieldProps('email')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="mt-1 text-red-600 text-sm">{formik.errors.email}</div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...formik.getFieldProps('password')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="mt-1 text-red-600 text-sm">{formik.errors.password}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdvertiserLogin; 