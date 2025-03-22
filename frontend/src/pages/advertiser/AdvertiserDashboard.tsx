import { useState } from 'react';
import { FiHome, FiPieChart, FiDollarSign, FiLogOut, FiPlus, FiUser } from 'react-icons/fi';
import { HiOutlineSpeakerphone } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const AdvertiserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    localStorage.removeItem('advertiserToken');
    localStorage.removeItem('advertiserRefreshToken');
    navigate('/advertiser/login');
  };

  const handleNavigation = (tab: string) => {
    if (tab === 'myads') {
      navigate('/advertiser/my-ads');
    } else if (tab === 'createad') {
      navigate('/advertiser/create-new-ad');
    } else if (tab === 'account') {
      navigate('/advertiser/account');
    } else {
      setActiveTab(tab);
    }
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
            className={`flex items-center px-6 py-3 cursor-pointer ${activeTab === 'overview' ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
            onClick={() => handleNavigation('overview')}
          >
            <FiHome className="mr-3" />
            <span>Overview</span>
          </div>
          <div 
            className={`flex items-center px-6 py-3 cursor-pointer hover:bg-indigo-700`}
            onClick={() => handleNavigation('myads')}
          >
            <HiOutlineSpeakerphone className="mr-3" />
            <span>My Ads</span>
          </div>
          <div 
            className={`flex items-center px-6 py-3 cursor-pointer hover:bg-indigo-700`}
            onClick={() => handleNavigation('createad')}
          >
            <FiPlus className="mr-3" />
            <span>Create New Ad</span>
          </div>
          <div 
            className={`flex items-center px-6 py-3 cursor-pointer hover:bg-indigo-700`}
            onClick={() => handleNavigation('account')}
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
            <h1 className="text-lg font-semibold text-gray-900">
              {activeTab === 'overview' && 'Dashboard Overview'}
            </h1>
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-500 text-sm font-medium">Total Budget</h3>
                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">$15,500</p>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="text-green-600 font-medium">+5.2%</span> from last month
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-500 text-sm font-medium">Total Spent</h3>
                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">$2,340</p>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="text-green-600 font-medium">+12.3%</span> from last month
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-500 text-sm font-medium">Total Impressions</h3>
                    <FiPieChart className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">45,600</p>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="text-green-600 font-medium">+8.1%</span> from last month
                  </div>
                </div>
              </div>

              {/* Performance Tips */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Performance Tips</h3>
                </div>
                <div className="p-6">
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          Increase your CTR by optimizing your ad creative and targeting. Need help? Contact our support team.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdvertiserDashboard;