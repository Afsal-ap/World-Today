import React, { useState, useEffect } from 'react';
import { FiHome, FiPieChart, FiDollarSign, FiSettings, FiLogOut, FiPlus, FiEdit, FiTrash2, FiEye, FiUser } from 'react-icons/fi';
import { HiOutlineDocumentReport, HiOutlineSpeakerphone } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const AdvertiserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [campaigns, setCampaigns] = useState([
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
      endDate: '2023-08-31'
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
      endDate: '2023-10-15'
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
      endDate: '2023-12-31'
    }
  ]);

  // Mock data for charts and metrics
  const metrics = {
    totalBudget: 15500,
    totalSpent: 2340,
    totalImpressions: 45600,
    totalClicks: 1230,
    averageCTR: 2.7,
    revenueGenerated: 8750
  };

  const recentActivity = [
    { id: 1, action: 'Campaign created', campaign: 'Holiday Special', date: '2023-08-10 14:23' },
    { id: 2, action: 'Budget increased', campaign: 'Summer Sale Promotion', date: '2023-08-08 09:45' },
    { id: 3, action: 'Campaign scheduled', campaign: 'New Product Launch', date: '2023-08-05 16:30' }
  ];

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
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
                  <p className="text-2xl font-semibold text-gray-900 mt-2">${metrics.totalBudget.toLocaleString()}</p>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="text-green-600 font-medium">+5.2%</span> from last month
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-500 text-sm font-medium">Total Spent</h3>
                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">${metrics.totalSpent.toLocaleString()}</p>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="text-green-600 font-medium">+12.3%</span> from last month
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-500 text-sm font-medium">Total Impressions</h3>
                    <FiPieChart className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">{metrics.totalImpressions.toLocaleString()}</p>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="text-green-600 font-medium">+8.1%</span> from last month
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-500 text-sm font-medium">Total Clicks</h3>
                    <FiPieChart className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">{metrics.totalClicks.toLocaleString()}</p>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="text-green-600 font-medium">+3.7%</span> from last month
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-500 text-sm font-medium">Average CTR</h3>
                    <FiPieChart className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">{metrics.averageCTR}%</p>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="text-red-600 font-medium">-0.5%</span> from last month
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-500 text-sm font-medium">Revenue Generated</h3>
                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">${metrics.revenueGenerated.toLocaleString()}</p>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="text-green-600 font-medium">+15.3%</span> from last month
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-500">Campaign: {activity.campaign}</p>
                        </div>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View all activity
                  </a>
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