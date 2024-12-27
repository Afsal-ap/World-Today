import { useFormik } from 'formik';
import * as Yup from 'yup';
import { NewspaperIcon } from '@heroicons/react/24/outline';
import { useChannelRegisterMutation } from '../../store/slices/channelApiSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ChannelRegister = () => {
  const [register, { isLoading }] = useChannelRegisterMutation();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const validationSchema = Yup.object({
    channelName: Yup.string()
      .required('Channel name is required')
      .min(2, 'Channel name must be at least 2 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
    governmentId: Yup.string()
      .required('Government ID is required')
      .min(5, 'Government ID must be at least 5 characters'),
    logo: Yup.mixed()
      .required('Logo is required')
      .test('fileSize', 'File is too large', (value: any) => {
        if (!value) return true;
        return value && value.size <= 5 * 1024 * 1024; // 5MB
      })
      .test('fileType', 'Unsupported file type', (value: any) => {
        if (!value) return true;
        return value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
      }),
    websiteOrSocialLink: Yup.string()
      .required('Website or social link is required')
      .url('Must be a valid URL'),
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
  });

  const formik = useFormik({
    initialValues: {
      channelName: '',
      email: '',
      phoneNumber: '',
      governmentId: '',
      logo: null as File | null,
      websiteOrSocialLink: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        
        console.log('Submitting values:', values);

        formData.append('channelName', values.channelName);
        formData.append('email', values.email);
        formData.append('phoneNumber', values.phoneNumber);
        formData.append('governmentId', values.governmentId);
        formData.append('websiteOrSocialLink', values.websiteOrSocialLink);
        formData.append('password', values.password);
        
        if (values.logo) {
          formData.append('logo', values.logo);
        }

        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        const result = await register(formData).unwrap();
        console.log('Registration response:', result);

        if (result.email) {
          navigate('/channel/verify-otp', {
            state: {
              email: values.email,
              isChannel: true
            }
          });
        }
      } catch (err: any) {
        console.error('Registration error details:', err);
        formik.setStatus(
          err.data?.error || err.data?.message || 'Registration failed. Please try again.'
        );
      }
    },
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue('logo', file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 bg-gradient-to-r from-purple-900 to-indigo-900">
        <NewspaperIcon className="h-20 w-20 text-white mb-8" />
        <h1 className="text-4xl font-bold text-white mb-4">Create Your Channel</h1>
        <p className="text-blue-200 text-center text-lg">
          Share your stories with the world
        </p>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-8 text-center text-purple-900">
            Register Your Channel
          </h2>

          {formik.status && (
            <div className="text-red-500 text-center mb-4">{formik.status}</div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Channel Name */}
            <div>
              <input
                type="text"
                placeholder="Channel Name"
                {...formik.getFieldProps('channelName')}
                className={`w-full px-4 py-3 rounded-lg border ${
                  formik.touched.channelName && formik.errors.channelName
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {formik.touched.channelName && formik.errors.channelName && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.channelName}</div>
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
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <input
                type="tel"
                placeholder="Phone Number"
                {...formik.getFieldProps('phoneNumber')}
                className={`w-full px-4 py-3 rounded-lg border ${
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.phoneNumber}</div>
              )}
            </div>

            {/* Government ID */}
            <div>
              <input
                type="text"
                placeholder="Government ID"
                {...formik.getFieldProps('governmentId')}
                className={`w-full px-4 py-3 rounded-lg border ${
                  formik.touched.governmentId && formik.errors.governmentId
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {formik.touched.governmentId && formik.errors.governmentId && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.governmentId}</div>
              )}
            </div>

            {/* Logo URL */}
            <div className="space-y-2">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="logo"
                  className={`w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center ${
                    formik.touched.logo && formik.errors.logo
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                >
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewUrl}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm">Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 5MB)</p>
                    </div>
                  )}
                  <input
                    id="logo"
                    name="logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </label>
              </div>
              {formik.touched.logo && formik.errors.logo && (
                <div className="text-red-500 text-sm">{formik.errors.logo as string}</div>
              )}
            </div>

            {/* Website/Social Link */}
            <div>
              <input
                type="url"
                placeholder="Website or Social Media Link"
                {...formik.getFieldProps('websiteOrSocialLink')}
                className={`w-full px-4 py-3 rounded-lg border ${
                  formik.touched.websiteOrSocialLink && formik.errors.websiteOrSocialLink
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {formik.touched.websiteOrSocialLink && formik.errors.websiteOrSocialLink && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.websiteOrSocialLink}</div>
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
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                {...formik.getFieldProps('confirmPassword')}
                className={`w-full px-4 py-3 rounded-lg border ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
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
              {isLoading ? 'Registering...' : 'Register Channel'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have a channel?{' '}
              <a href="/channel/login" className="text-purple-900 hover:underline font-semibold">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelRegister;
