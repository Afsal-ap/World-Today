import React, { useState } from 'react';
import { FiHome, FiPlus, FiLogOut, FiUser, FiEdit, FiTrash2, FiEye, FiPause, FiPlay } from 'react-icons/fi';
import { HiOutlineSpeakerphone } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const MyAds = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([
    { 
      id: 1, 
      name: 'Summer Sale Promotion', 
      status: 'active', 
      budget: 5000, 
      spent: 2340, 
      impressions: 45600, 
      clicks: 1230, 
      ctr: 2.7,
      startDate: '2023-06-01',
      endDate: '2023-08-31',
      image: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Summer+Sale'
    },
    { 
      id: 2, 
      name: 'New Product Launch', 
      status: 'pending', 
      budget: 3000, 
      spent: 0, 
      impressions: 0, 
      clicks: 0, 
      ctr: 0,
      startDate: '2023-09-15',
      endDate: '2023-10-15',
      image: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=New+Product'
    },
    { 
      id: 3, 
      name: 'Holiday Special', 
      status: 'draft', 
      budget: 7500, 
      spent: 0, 
      impressions: 0, 
      clicks: 0, 
      ctr: 0,
      startDate: '2023-11-20',
      endDate: '2023-12-31',
      image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Holiday+Special'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const handleLogout = () => {
    localStorage.removeItem('advertiserToken');
    localStorage.removeItem('advertiserRefreshToken');
    navigate('/advertiser/login');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteAd = (id: number) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      setAds(ads.filter(ad => ad.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setAds(ads.map(ad => {
      if (ad.id === id) {
        const newStatus = ad.status === 'active' ? 'paused' : 'active';
        return { ...ad, status: newStatus };
      }
      return ad;
    }));
  };

  const filteredAds = filter === 'all' ? ads : ads.filter(ad => ad.status === filter);

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
            className="flex items-center px-6 py-3 cursor-pointer bg-indigo-900"
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
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Ads</h1>
            <button
              onClick={() => navigate('/advertiser/create-ad')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
            >
              <FiPlus className="mr-2" />
              Create New Ad
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
            >
              All Ads
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-md ${filter === 'active' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-md ${filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-4 py-2 rounded-md ${filter === 'draft' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
            >
              Draft
            </button>
            <button
              onClick={() => setFilter('paused')}
              className={`px-4 py-2 rounded-md ${filter === 'paused' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
            >
              Paused
            </button>
          </div>

          {/* Ad Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAds.map(ad => (
              <div key={ad.id} className="bg-white rounded-lg shadow overflow-hidden">
                <img src={ad.image} alt={ad.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{ad.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ad.status)}`}>
                      {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {ad.startDate} to {ad.endDate}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="font-medium">${ad.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Spent</p>
                      <p className="font-medium">${ad.spent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Impressions</p>
                      <p className="font-medium">{ad.impressions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Clicks</p>
                      <p className="font-medium">{ad.clicks.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleToggleStatus(ad.id)}
                      className={`p-2 rounded-md ${ad.status === 'active' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
                      title={ad.status === 'active' ? 'Pause Ad' : 'Activate Ad'}
                    >
                      {ad.status === 'active' ? <FiPause /> : <FiPlay />}
                    </button>
                    <button
                      onClick={() => navigate(`/advertiser/ad/${ad.id}`)}
                      className="p-2 rounded-md bg-blue-50 text-blue-600"
                      title="View Details"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => navigate(`/advertiser/edit-ad/${ad.id}`)}
                      className="p-2 rounded-md bg-yellow-50 text-yellow-600"
                      title="Edit Ad"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteAd(ad.id)}
                      className="p-2 rounded-md bg-red-50 text-red-600"
                      title="Delete Ad"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredAds.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 mb-4">No ads found with the selected filter.</p>
              <button
                onClick={() => navigate('/advertiser/create-ad')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 inline-flex items-center"
              >
                <FiPlus className="mr-2" />
                Create New Ad
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyAds;