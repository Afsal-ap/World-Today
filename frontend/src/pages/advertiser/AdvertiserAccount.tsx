import React, { useState } from 'react';
import { FiHome, FiPlus, FiLogOut, FiUser, FiEdit, FiSave } from 'react-icons/fi';
import { HiOutlineSpeakerphone } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const AdvertiserAccount = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: 'Acme Corporation',
    email: 'marketing@acmecorp.com',
    phone: '+1 (555) 123-4567',
    website: 'https://www.acmecorp.com',
    industry: 'Technology',
    address: '123 Business Ave, Suite 100',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    country: 'United States',
    logo: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=ACME'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Form submitted:', formData);
    setIsEditing(false);
    alert('Account information updated successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('advertiserToken');
    localStorage.removeItem('advertiserRefreshToken');
    navigate('/advertiser/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Ad Manager</h2>
          <p className="text-indigo-200 text-sm">Advertiser Portal</p>
        </div>
        <nav className="mt-6">
          <div 
            className="flex items-center px-6 py-3 cursor-pointer hover:bg-indigo-700"
            onClick={() => navigate('/advertiser/dashboard')}
          >
            <FiHome className="mr-3" />
            <span>Overview</span>
          </div>
          <div 
            className="flex items-center px-6 py-3 cursor-pointer hover:bg-indigo-700"
            onClick={() => navigate('/advertiser/my-ads')}
          >
            <HiOutlineSpeakerphone className="mr-3" />
            <span>My Ads</span>
          </div>
          <div 
            className="flex items-center px-6 py-3 cursor-pointer hover:bg-indigo-700"
            onClick={() => navigate('/advertiser/create-ad')}
          >
            <FiPlus className="mr-3" />
            <span>Create New Ad</span>
          </div>
          <div 
            className="flex items-center px-6 py-3 cursor-pointer bg-indigo-900"
            onClick={() => navigate('/advertiser/account')}
          >
            <FiUser className="mr-3" />
            <span>Account</span>
          </div>
          <div 
            className="flex items-center px-6 py-3 cursor-pointer hover:bg-indigo-700 mt-auto"
            onClick={handleLogout}
          >
            <FiLogOut className="mr-3" />
            <span>Logout</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
            >
              {isEditing ? <FiSave className="mr-2" /> : <FiEdit className="mr-2" />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row items-center">
                <img 
                  src={formData.logo} 
                  alt="Company Logo" 
                  className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
                />
                <div>
                  <h2 className="text-xl font-semibold">{formData.companyName}</h2>
                  <p className="text-gray-500">{formData.industry}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
                    <input
                      type="text"
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-medium mt-8 mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Street Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">State/Province</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP/Postal Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="px-6 py-4 bg-gray-50 text-right">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white mr-3 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdvertiserAccount;