import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  UsersIcon, NewspaperIcon, BuildingOfficeIcon, 
  ChartBarIcon, Bars3Icon, XMarkIcon, Cog6ToothIcon
} from '@heroicons/react/24/outline';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { id: 'dashboard', path: '/admin/dashboard', icon: ChartBarIcon, label: 'Dashboard' },
    { id: 'users', path: '/admin/users', icon: UsersIcon, label: 'Users' },
    { id: 'channels', path: '/admin/channels', icon: NewspaperIcon, label: 'Channels' },
    { id: 'categories', path: '/admin/categories', icon: Cog6ToothIcon, label: 'Categories' },
    { id: 'advertisers', path: '/admin/advertisers', icon: BuildingOfficeIcon, label: 'Advertisers' },
    { id: 'settings', path: '/admin/settings', icon: Cog6ToothIcon, label: 'Settings' },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-gray-900 transform 
        lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Admin Logo & Title */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-white">Admin Panel</span>
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
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
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
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-gray-900 text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

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

export default AdminLayout; 