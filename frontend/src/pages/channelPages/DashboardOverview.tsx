import { ChartBarIcon, NewspaperIcon, EyeIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardOverview = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('channelToken');
    if (!token) {
      navigate('/channel/login');
    }
  }, [navigate]);

  const stats = [
    { title: 'Total Articles', value: '24', icon: NewspaperIcon, change: '+12%' },
    { title: 'Total Views', value: '21.5K', icon: EyeIcon, change: '+18%' },
    { title: 'Engagement Rate', value: '68%', icon: HeartIcon, change: '+7%' },
    { title: 'Analytics Score', value: '92', icon: ChartBarIcon, change: '+4%' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-purple-600" />
            </div>
            <p className="mt-2 text-sm text-green-600">{stat.change} from last month</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">New article published</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
              <span className="text-purple-600 text-sm">View</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
