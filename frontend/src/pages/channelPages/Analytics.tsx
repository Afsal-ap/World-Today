const Analytics = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>

      {/* Performance Overview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">Chart will be implemented here</p>
        </div>
      </div>

      {/* Top Articles */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Articles</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">Article Title {item}</p>
                <p className="text-sm text-gray-500">1.2K views • 45 shares</p>
              </div>
              <span className="text-green-600">↑ 12%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
