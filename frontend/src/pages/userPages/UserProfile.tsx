import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../store/slices/userApiSlice';
import { FiEdit2, FiUser, FiMail, FiPhone, FiCalendar, FiSave, FiX, FiLogOut } from 'react-icons/fi';
import SavedPosts from '../../components/SavedPosts';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    console.log('Current token in localStorage:', token);
  }, []);

  const { data: profile, error, isLoading } = useGetProfileQuery(undefined);
  const [updateProfile] = useUpdateProfileMutation();

  useEffect(() => {
    console.log('Profile data:', profile);
    console.log('Profile error:', error);
    console.log('Is loading:', isLoading);
    if ((error as any)?.status === 401) {
     console.log('Unauthorized');
    }
  }, [profile, error, isLoading]);

  const handleEdit = () => {
    setFormData({
      name: profile?.name || '',
      phone: profile?.phone || ''
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
          await updateProfile(formData).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative text-center">
          {String((error as any)?.data?.message || 'Failed to load profile data')}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">User Profile</h1>
              <div className="flex gap-3">
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {profile && !isEditing && (
              <div className="space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center justify-center mb-8">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg mb-4">
                    <span className="text-4xl font-bold text-white">
                      {profile?.name ? profile.name.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">{profile?.name || 'No Name'}</h2>
                  <p className="text-gray-500">{profile?.email || 'No Email'}</p>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ProfileField icon={<FiUser />} label="Name" value={profile.name} />
                  <ProfileField icon={<FiMail />} label="Email" value={profile.email} />
                  <ProfileField icon={<FiPhone />} label="Phone" value={profile.phone} />
                  <ProfileField 
                    icon={<FiCalendar />} 
                    label="Member Since" 
                    value={new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} 
                  />
                </div>
              </div>
            )}

            {isEditing && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
                  >
                    <FiSave className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {!isEditing && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Saved Posts</h2>
                <SavedPosts />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this new component for profile fields
const ProfileField = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50">
    <div className="text-blue-500 mt-1">{icon}</div>
    <div>
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <p className="mt-1 text-lg text-gray-800">{value}</p>
    </div>
  </div>
);

export default UserProfile;