import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAdvertiserRegisterMutation } from '../../store/slices/adApiSlice';
import { NewspaperIcon } from '@heroicons/react/24/outline';

const AdvertiserRegister = () => {
  const [register, { isLoading }] = useAdvertiserRegisterMutation();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    companyName: Yup.string()
      .required('Company name is required')
      .min(2, 'Company name must be at least 2 characters'),
    contactPersonName: Yup.string()
      .required('Contact person name is required')
      .min(2, 'Contact person name must be at least 2 characters')
      .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
  });

  const formik = useFormik({
    initialValues: {
      companyName: '',
      contactPersonName: '',
      email: '',
      phoneNumber: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log('Submitting form with values:', values);
        const result = await register(values).unwrap();
        console.log('Registration response:', result);
        navigate('/advertiser/verify-otp', { state: { email: values.email } });
      } catch (err: any) {
        console.error('Registration error:', err);
        formik.setStatus(err.data?.message || 'Registration failed');
      }
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 bg-gradient-to-r from-purple-900 to-indigo-900">
        <NewspaperIcon className="h-20 w-20 text-white mb-8" />
        <h1 className="text-4xl font-bold text-white mb-4">Welcome Advertiser</h1>
        <p className="text-blue-200 text-center text-lg">
          Start promoting your business to millions of viewers
        </p>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-8 text-center text-purple-900">
            Register as Advertiser
          </h2>

          {formik.status && (
            <div className="text-red-500 text-center mb-4">{formik.status}</div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Company Name */}
            <div>
              <input
                type="text"
                placeholder="Company Name"
                {...formik.getFieldProps('companyName')}
                className={`w-full px-4 py-3 rounded-lg border ${
                  formik.touched.companyName && formik.errors.companyName
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {formik.touched.companyName && formik.errors.companyName && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.companyName}
                </div>
              )}
            </div>

            {/* Contact Person Name */}
            <div>
              <input
                type="text"
                placeholder="Contact Person Name"
                {...formik.getFieldProps('contactPersonName')}
                className={`w-full px-4 py-3 rounded-lg border ${
                  formik.touched.contactPersonName && formik.errors.contactPersonName
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {formik.touched.contactPersonName && formik.errors.contactPersonName && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.contactPersonName}
                </div>
              )}
            </div>

            {/* Email */}
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

            {/* Phone Number */}
            <div>
              <input
                type="text"
                placeholder="Phone Number"
                {...formik.getFieldProps('phoneNumber')}
                className={`w-full px-4 py-3 rounded-lg border ${
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.phoneNumber}
                </div>
              )}
            </div>

            {/* Password */}
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
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a
                href="/advertiser/login"
                className="text-purple-900 hover:underline font-semibold"
              >
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertiserRegister; 