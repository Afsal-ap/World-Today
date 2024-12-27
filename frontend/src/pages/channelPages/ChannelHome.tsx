import { useState, useEffect } from 'react';
import { 
  HomeIcon,
  NewspaperIcon, 
  PlusCircleIcon, 
  UserCircleIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useGetChannelDashboardQuery } from '../../store/slices/channelApiSlice';

const ChannelDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: channelData } = useGetChannelDashboardQuery({});

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'articles':
        return <ArticlesList />;
      case 'create':
        return <CreateArticle />;
      case 'analytics':
        return <Analytics />;
      case 'account':
        return <AccountSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  // Close sidebar on mobile when section changes
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setIsSidebarOpen(false);
  };

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
                  src={`http://localhost:3001/public/uploads/logos/${channelData.logo}`}
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
            {[
              { id: 'dashboard', icon: HomeIcon, label: 'Dashboard' },
              { id: 'articles', icon: NewspaperIcon, label: 'Articles' },
              { id: 'create', icon: PlusCircleIcon, label: 'Create New' },
              { id: 'analytics', icon: ChartBarIcon, label: 'Analytics' },
              { id: 'account', icon: UserCircleIcon, label: 'Account' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => handleSectionChange(id)}
                className={`flex items-center w-full px-4 py-2 rounded-lg ${
                  activeSection === id 
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
        {/* Mobile Header */}
        <div className="lg:hidden mb-6 pl-16">
          <h1 className="text-xl font-bold text-purple-900">
            {channelData?.channelName || 'Loading...'}
          </h1>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Update DashboardOverview for responsiveness
const DashboardOverview = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
        <h3 className="text-gray-500 text-sm font-medium">Total Articles</h3>
        <p className="text-2xl lg:text-3xl font-bold text-purple-900">24</p>
      </div>
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
        <h3 className="text-gray-500 text-sm font-medium">Total Views</h3>
        <p className="text-2xl lg:text-3xl font-bold text-purple-900">1.2K</p>
      </div>
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
        <h3 className="text-gray-500 text-sm font-medium">Engagement Rate</h3>
        <p className="text-2xl lg:text-3xl font-bold text-purple-900">8.5%</p>
      </div>
    </div>
  </div>
);

// Placeholder components
const ArticlesList = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Your Articles</h2>
    {/* Add your articles list component here */}
  </div>
);

const CreateArticle = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Create New Article</h2>
    {/* Add your article creation form here */}
  </div>
);

const Analytics = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Analytics</h2>
    {/* Add your analytics component here */}
  </div>
);

const AccountSettings = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
    {/* Add your account settings component here */}
  </div>
);

export default ChannelDashboard; 