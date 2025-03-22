import { ChartBarIcon, NewspaperIcon, EyeIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetChannelDashboardStatsQuery } from '../../store/slices/postApiSlice';
import { jwtDecode } from 'jwt-decode';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



const DashboardOverview = () => {
  const navigate = useNavigate();
  
  const token = localStorage.getItem("channelToken");
  const decodedToken = jwtDecode<{ channelId?: string }>(token!);
  const channelId = decodedToken.channelId;

  const { data, error, isLoading } = useGetChannelDashboardStatsQuery(channelId!);

  useEffect(() => {
    const token = localStorage.getItem('channelToken');
    if (!token) {
      navigate('/channel/login');
    }
  }, [navigate]);

  const stats = data?.totalPosts ? [
    { title: 'Total Articles', value: data.totalPosts, icon: NewspaperIcon, change: '+12%' },
    { title: 'Total Likes', value: data.totalLikes, icon: EyeIcon, change: '+18%' },
    { title: 'Total Comments', value: data.totalComments, icon: HeartIcon, change: '+7%' },
    { title: 'Analytics Score', value: '92', icon: ChartBarIcon, change: '+4%' },
  ] : [];

  const chartData = {
    labels: data?.postCounts?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Posts Over Time',
        data: data?.postCounts?.map(item => item.count) || [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Posts Per Period' },
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Number of Posts' }, beginAtZero: true },
    },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      
      {isLoading && <p>Loading dashboard stats...</p>}
      {error && <p className="text-red-500">Error loading stats</p>}

      {!isLoading && !error && stats.length > 0 && (
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
      )}

      {!isLoading && !error && data?.postCounts && (
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Posts Over Time</h3>
          <div className="w-full h-96">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

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