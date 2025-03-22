import  { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import { RadioGroup } from '@headlessui/react';
import { useGetAdChartQuery } from '../../store/slices/adApiSlice';

interface ChartDataPoint {
  date: string;
  count: number;
}

const AdChart = () => {
  const [period, setPeriod] = useState<"daily" | "weekly">("daily");

  // Fetch post data
  const { data, error, isLoading } = useGetAdChartQuery(period);

  console.log("Fetched chart data: addd", data);

  // Format the data for display
  const formatChartData = (data: ChartDataPoint[] | undefined) => {
    if (!data || data.length === 0) return [];
    
    return data.map(item => ({
      date: formatDateLabel(item.date, period),
      ads: item.count
    }));
  };

  // Format date labels based on period
  const formatDateLabel = (dateString: string, period: "daily" | "weekly"): string => {
    if (period === "weekly") {
      const [year, week] = dateString.split('-');
      return `Week ${week}, ${year}`;
    }
    
    // For daily data, format as MMM DD
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = formatChartData(data);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-medium text-gray-900">Ads Over Time</h4>

        <RadioGroup value={period} onChange={setPeriod} className="flex space-x-4">
          <RadioGroup.Option value="daily">
            {({ checked }) => (
              <span className={`px-3 py-1 rounded-md cursor-pointer ${
                checked ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              }`}>
                Daily
              </span>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="weekly">
            {({ checked }) => (
              <span className={`px-3 py-1 rounded-md cursor-pointer ${
                checked ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              }`}>
                Weekly
              </span>
            )}
          </RadioGroup.Option>
        </RadioGroup>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="h-64 flex items-center justify-center text-red-500">
          Error fetching data
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} Ads`} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="ads" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
              name="Ads" 
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AdChart;
