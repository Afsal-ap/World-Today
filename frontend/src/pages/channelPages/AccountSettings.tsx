import { useState, useEffect } from 'react';
import { useGetChannelProfileQuery, useUpdateChannelProfileMutation } from '../../store/slices/postApiSlice';
import { toast } from 'react-hot-toast';

const AccountSettings = () => {
  const { data: profileData, isLoading } = useGetChannelProfileQuery({});
  const [updateProfile] = useUpdateChannelProfileMutation();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    channelName: '',
    email: '',
    bio: '',
    websiteOrSocialLink: '',
    phoneNumber: ''
  });

  useEffect(() => {
    if (profileData?.data) {
      setFormData({
        channelName: profileData.data.channelName || '',
        email: profileData.data.email || '',
        bio: profileData.data.bio || '',
        websiteOrSocialLink: profileData.data.websiteOrSocialLink || '',
        phoneNumber: profileData.data.phoneNumber || ''
      });
    }
  }, [profileData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>;
  }

  return (
    <div className="flex gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Left Side - Channel Details */}
      <div className="w-1/3 space-y-6">
        <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-purple-900">Channel Profile</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                isEditing 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-icons text-xl">
                  {isEditing ? 'edit_off' : 'edit'}
                </span>
                {isEditing ? 'Cancel' : 'Edit'}
              </div>
            </button>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="group">
                <label className="block text-sm font-semibold text-purple-900 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {key === 'bio' ? (
                  <textarea
                    name={key}
                    value={value}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                    className={`w-full rounded-lg shadow-sm transition-all duration-200 ${
                      isEditing
                        ? 'border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white'
                        : 'bg-purple-50/50 border-0'
                    }`}
                  />
                ) : (
                  <input
                    type={key === 'email' ? 'email' : key === 'websiteOrSocialLink' ? 'url' : 'text'}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    disabled={!isEditing || key === 'email'}
                    className={`w-full rounded-lg shadow-sm transition-all duration-200 ${
                      isEditing && key !== 'email'
                        ? 'border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white'
                        : 'bg-purple-50/50 border-0'
                    }`}
                  />
                )}
              </div>
            ))}

            {isEditing && (
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 
                           transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Right Side - Password Settings */}
      <div className="w-2/3">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Change Password</h3>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 
                         transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
