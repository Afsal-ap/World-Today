import React, { useState } from 'react';
import { FiHome, FiPlus, FiLogOut, FiUser } from 'react-icons/fi';
import { HiOutlineSpeakerphone } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const CreateNewAd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    startDate: '',
    endDate: '',
    targetAudience: '',
    adType: 'banner',
    imageFile: null as File | null,
    imagePreview: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Form submitted:', formData);
    alert('Ad created successfully!');
    // Redirect to My Ads page after submission
    navigate('/advertiser/my-ads');
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
            className="flex items-center px-6 py-3 cursor-pointer bg-indigo-900"
            onClick={() => navigate('/advertiser/create-ad')}
          >
            <FiPlus className="mr-3" />
            <span>Create New Ad</span>
          </div>
          <div 
            className="flex items-center px-6 py-3 cursor-pointer hover:bg-indigo-700"
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
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-900">Create New Ad</h1>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">Welcome, Advertiser</span>
              <img 
                className="h-8 w-8 rounded-full" 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Profile" 
              />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <h2 className="text-xl font-semibold mb-4">Ad Details</h2>
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Ad Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="adType" className="block text-sm font-medium text-gray-700">Ad Type</label>
                  <select
                    id="adType"
                    name="adType"
                    value={formData.adType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="banner">Banner Ad</option>
                    <option value="video">Video Ad</option>
                    <option value="native">Native Ad</option>
                    <option value="popup">Popup Ad</option>
                  </select>
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Ad Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget (USD)</label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">Target Audience</label>
                  <input
                    type="text"
                    id="targetAudience"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    placeholder="e.g., Males 18-34, Tech enthusiasts"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">Ad Creative</label>
                  <input
                    type="file"
                    id="imageFile"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {formData.imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Preview:</p>
                      <img src={formData.imagePreview} alt="Ad preview" className="max-h-40 rounded-md" />
                    </div>
                  )}
                </div>
                
                <div className="col-span-2 mt-6">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Ad
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateNewAd;
