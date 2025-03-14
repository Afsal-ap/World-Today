import React, { useState } from 'react';
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
import { useGetUserChartQuery } from '../../store/slices/adminApiSlice';

// Define TypeScript types
interface ChartData {
  date: string;
  users: number;
}

const UserChart = () => {
  const [period, setPeriod] = useState<"daily" | "weekly">("daily");

  // Fetch user chart data
  const { data, error, isLoading } = useGetUserChartQuery(period);

  // Log data to check its structure
  console.log("Fetched data:", data);

  // Helper function to format dates based on period
  const formatDate = (id: string | number, period: "daily" | "weekly"): string => {
    if (period === "daily") {
      const date = new Date(id);
      return isNaN(date.getTime()) ? `Invalid Date (${id})` : date.toLocaleDateString();
    }
    return `Week ${id}`;
  };

  // Ensure data is an array before mapping
  const chartData: ChartData[] = Array.isArray(data?.data)
    ? data.data.map((item: { _id: string | number; count: number }) => ({
        date: formatDate(item._id, period),
        users: item.count
      }))
    : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">User Activity</h4>

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
          Error fetching data!
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => value}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => `${value} users`} 
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} name="Active Users" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default UserChart;
