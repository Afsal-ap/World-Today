import { useGetDashboardStatsQuery } from '../../store/slices/adminApiSlice';
import { 
  UsersIcon, NewspaperIcon, 
  BuildingOfficeIcon, ChartBarIcon 
} from '@heroicons/react/24/outline';

interface Activity {
  description: string;
  time: string;
}

const AdminDashboard = () => {
  const { data, isLoading } = useGetDashboardStatsQuery({});

  const stats = [
    { title: 'Total Users', value: data?.totalUsers || 0, icon: UsersIcon },
    { title: 'Total Channels', value: data?.totalChannels || 0, icon: NewspaperIcon },
    { title: 'Total Advertisers', value: data?.totalAdvertisers || 0, icon: BuildingOfficeIcon },
    { title: 'Total Revenue', value: `$${data?.totalRevenue || 0}`, icon: ChartBarIcon },
  ];

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>

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
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {data?.recentActivity?.map((activity: Activity, index: number) => (
            <div key={index} className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">{activity.description}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 