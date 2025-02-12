import { useFormik } from 'formik';
import * as Yup from 'yup';
import { NewspaperIcon } from '@heroicons/react/24/outline';
import { useRegisterMutation } from '../../store/slices/userApiSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Register = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const userToken = localStorage.getItem('userToken');

  // Add this useEffect to check for existing token
  useEffect(() => {
    if (userToken) {
      navigate('/');
    }
  }, [navigate, userToken]);

  // Helper function to format phone number
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters except +
    let cleaned = value.replace(/[^\d+]/g, '');
    
    // Ensure it starts with + and has only digits after
    if (!cleaned.startsWith('+')) {
        cleaned = '+' + cleaned.replace(/\D/g, '');
    }
    
    // Limit to 15 characters (including +)
    return cleaned.slice(0, 15);
  };

  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters')
      .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
    
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
    
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^\+\d{10,15}$/, 'Phone number must include country code (e.g., +91XXXXXXXXXX)')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '+91' // Initialize with country code
    },
    validationSchema,
    onSubmit: async (values) => {
      const formattedPhone = formatPhoneNumber(values.phone);
      console.log('Formatted phone number:', formattedPhone);

      if (!/^\+\d{10,15}$/.test(formattedPhone)) {
        formik.setStatus('Invalid phone number format');
        return;
      }

      try {
        const result = await register({
          ...values,
          phone: formattedPhone
        }).unwrap();
        console.log(result , "resulttt")
        if (result.success) {
          navigate('/verify-otp', { 
            state: { 
              phoneNumber: formattedPhone,
              email: values.email,
            } 
          });
        }
      } catch (err: any) {
        console.error('Registration error:', err);
        formik.setStatus(err?.data?.message || err?.message || 'Registration failed');
      }
    },
  });

  // Handle phone number input changes
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    formik.setFieldValue('phone', formattedValue);
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
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-8 text-center"
            style={{
              background: 'linear-gradient(90deg, #6a0dad, #8a2be2, #c154c1, #6a0dad)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '300% 300%',
              animation: 'gradientMove 8s infinite',
            }}>
            Create Account
          </h2>

          {formik.status && (
            <div className="text-red-500 text-center mb-4">{formik.status}</div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                {...formik.getFieldProps('name')}
                className={`w-full px-4 py-3 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 ${
                  formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <input
                type="email"
                placeholder="Email Address"
                {...formik.getFieldProps('email')}
                className={`w-full px-4 py-3 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 ${
                  formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <input
                type="password"
                placeholder="Password"
                {...formik.getFieldProps('password')}
                className={`w-full px-4 py-3 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 ${
                  formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                {...formik.getFieldProps('confirmPassword')}
                className={`w-full px-4 py-3 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <input
                type="tel"
                placeholder="Phone Number (e.g., +91XXXXXXXXXX)"
                value={formik.values.phone}
                onChange={handlePhoneChange}
                onBlur={formik.handleBlur('phone')}
                className={`w-full px-4 py-3 bg-gray-100 border rounded-lg focus:outline-none focus:border-blue-500 ${
                  formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.phone}</div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Start with + followed by country code (e.g., +91 for India)
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formik.isValid || formik.isSubmitting}
              className={`w-full py-3 px-4 bg-gradient-to-r from-purple-950 via-purple-800 to-purple-700 
                text-white rounded-lg transition-all duration-300 
                ${(isLoading || !formik.isValid || formik.isSubmitting) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-90'}`}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-blue-900 hover:underline font-semibold">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;