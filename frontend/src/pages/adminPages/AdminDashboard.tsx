import { useGetUserStatsQuery } from '../../store/slices/adminApiSlice';
import { useGetChannelStatsQuery } from '../../store/slices/postApiSlice';
import { useGetAdvertiserStatsQuery } from '../../store/slices/adApiSlice';
import { 
  UsersIcon, NewspaperIcon, 
  BuildingOfficeIcon, ChartBarIcon,
  CurrencyDollarIcon, ChatBubbleLeftRightIcon,
  PlayIcon, FireIcon, TagIcon
} from '@heroicons/react/24/outline';
import UserChart from '../adminPages/UserChart';
import ChannelChart from '../adminPages/ChannelChart';
import AdChart from '../adminPages/AdChart';


const AdminDashboard = () => {
  const { data: userStats,  isLoading: userLoading } = useGetUserStatsQuery();
  const { data: channelStats, isLoading: channelLoading } = useGetChannelStatsQuery({});
  const { data: advertiserStats, isLoading: advertiserLoading } = useGetAdvertiserStatsQuery({});
    
  const totalRevenue = advertiserStats?.totalRevenue || 0;

  const overviewStats = [
    { title: 'Total Users', value: userStats?.totalUsers || 0, icon: UsersIcon },
    { title: 'Total Channels', value: channelStats?.totalChannel || 0, icon: NewspaperIcon },
    { title: 'Total Advertisers', value: advertiserStats?.totalAdvertisers || 0, icon: BuildingOfficeIcon },
    { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: CurrencyDollarIcon },
  ];

  const userMetrics = [
    { title: 'Active Users', value: userStats?.activeUsers || 0, icon: FireIcon },
    { title: 'Total Comments', value: channelStats?.totalComments || 0, icon: ChatBubbleLeftRightIcon },
    { title: 'Total Likes', value: channelStats?.totalLikes || 0, icon: TagIcon },
    { title: 'Live Stream Views', value: userStats?.liveStreamViews || 0, icon: PlayIcon },
  ];

  const channelMetrics = [
    { title: 'Total Posts', value: channelStats?.totalPosts || 0, icon: NewspaperIcon },
    { title: 'Live Streams', value: channelStats?.totalLives || 0, icon: PlayIcon },
    { title: 'Popular Category', value: channelStats?.popularCategory || 'N/A', icon: TagIcon },
    { title: 'Engagement Rate', value: `${channelStats?.engagementRate || 0}%`, icon: ChatBubbleLeftRightIcon },
  ];

  const advertiserMetrics = [
    { title: 'Active Ads', value: advertiserStats?.totalAds || 0, icon: TagIcon },
    { title: 'Total Advertisers', value: advertiserStats?.totalAdvertisers || 0, icon: FireIcon },
    { title: 'Total Revenue', value: `₹${advertiserStats?.adRevenue || 0}`, icon: ChartBarIcon },
    { title: 'This Month Revenue', value: `₹${advertiserStats?.monthlyRevenue || 0}`, icon: CurrencyDollarIcon },
  ];

  const isLoading = userLoading || channelLoading || advertiserLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>

      {/* Main Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
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

      {/* User Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <UsersIcon className="h-5 w-5 mr-2 text-purple-600" />
          User Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {userMetrics.map((metric) => (
            <div key={metric.title} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{metric.title}</p>
                <metric.icon className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-xl font-medium text-gray-900 mt-2">{metric.value}</p>
            </div>
          ))}
        </div>
        
        {/* User Activity Chart */}
        <div className="mt-6">
          <UserChart />
        </div>
      </div>

      {/* Channel Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <NewspaperIcon className="h-5 w-5 mr-2 text-purple-600" />
          Channel Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {channelMetrics.map((metric) => (
            <div key={metric.title} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{metric.title}</p>
                <metric.icon className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-xl font-medium text-gray-900 mt-2">{metric.value}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <ChannelChart />
        </div>
      </div>

      {/* Advertiser Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BuildingOfficeIcon className="h-5 w-5 mr-2 text-purple-600" />
          Advertiser Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {advertiserMetrics.map((metric) => (
            <div key={metric.title} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{metric.title}</p>
                <metric.icon className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-xl font-medium text-gray-900 mt-2">{metric.value}</p>
            </div>
          ))}
        </div>
         
        <div className="mt-6">
          <AdChart />
        </div>
        
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">New channel "TechNews" created</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Ad campaign "Summer Sale" started</p>
              <p className="text-sm text-gray-500">3 hours ago</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Channel "SportsCentral" started a live stream</p>
              <p className="text-sm text-gray-500">4 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;