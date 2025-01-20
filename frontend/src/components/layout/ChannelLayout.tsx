import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  HomeIcon, NewspaperIcon, PlusCircleIcon, 
  UserCircleIcon, ChartBarIcon, Bars3Icon, XMarkIcon 
} from '@heroicons/react/24/outline';
import { useGetChannelDashboardQuery } from '../../store/slices/postApiSlice';

const ChannelLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: channelData } = useGetChannelDashboardQuery({});
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { id: 'dashboard', path: '/channel/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { id: 'articles', path: '/channel/articles', icon: NewspaperIcon, label: 'Articles' },
    { id: 'create', path: '/channel/create', icon: PlusCircleIcon, label: 'Create New' },
    { id: 'analytics', path: '/channel/analytics', icon: ChartBarIcon, label: 'Analytics' },
    { id: 'account', path: '/channel/account', icon: UserCircleIcon, label: 'Account' },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-purple-900 text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg transform 
        lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Channel Logo & Name */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              {channelData?.logo ? (
                <img 
                  src={channelData.logo}
                  alt={channelData?.channelName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-purple-900 flex items-center justify-center">
                  <NewspaperIcon className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-purple-900">
                {channelData?.channelName || 'Loading...'}
              </h1>
              <p className="text-sm text-gray-500">News Channel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            {navigationItems.map(({ id, path, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => {
                  navigate(path);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 rounded-lg ${
                  isActivePath(path)
                    ? 'bg-purple-100 text-purple-900' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 lg:p-8">
        <div className="lg:hidden mb-6 pl-16">
          <h1 className="text-xl font-bold text-purple-900">
            {channelData?.channelName || 'Loading...'}
          </h1>
        </div>
        
        {/* This is where the route content will be rendered */}
        <Outlet />
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ChannelLayout; 