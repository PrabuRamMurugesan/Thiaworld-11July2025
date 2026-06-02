import React, { useState, useEffect } from "react";
import { FaChartLine, FaUsers, FaShoppingCart, FaDollarSign, FaEye, FaClock } from "react-icons/fa";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState({
    visitors: 0,
    orders: 0,
    revenue: 0,
    conversionRate: 0,
    avgOrderValue: 0
  });

  const salesData = [
    { name: "Mon", sales: 4000, orders: 24 },
    { name: "Tue", sales: 3000, orders: 18 },
    { name: "Wed", sales: 5000, orders: 30 },
    { name: "Thu", sales: 4500, orders: 27 },
    { name: "Fri", sales: 6000, orders: 36 },
    { name: "Sat", sales: 8000, orders: 48 },
    { name: "Sun", sales: 7500, orders: 45 }
  ];

  const categoryData = [
    { name: "Necklaces", value: 35, color: "#f4c542" },
    { name: "Rings", value: 25, color: "#0B0B0B" },
    { name: "Earrings", value: 20, color: "#888888" },
    { name: "Bangles", value: 12, color: "#666666" },
    { name: "Pendants", value: 8, color: "#444444" }
  ];

  const trafficSources = [
    { name: "Organic Search", value: 40, color: "#10B981" },
    { name: "Direct", value: 25, color: "#3B82F6" },
    { name: "Social Media", value: 20, color: "#F59E0B" },
    { name: "Referral", value: 10, color: "#8B5CF6" },
    { name: "Email", value: 5, color: "#EC4899" }
  ];

  const topProducts = [
    { name: "Gold Necklace Set", sales: 156, revenue: 468000, trend: "+12%" },
    { name: "Diamond Ring", sales: 142, revenue: 426000, trend: "+8%" },
    { name: "Pearl Earrings", sales: 128, revenue: 256000, trend: "+15%" },
    { name: "Silver Bangle", sales: 98, revenue: 147000, trend: "-3%" },
    { name: "Gold Pendant", sales: 87, revenue: 174000, trend: "+5%" }
  ];

  useEffect(() => {
    // Simulate fetching analytics data
    setAnalyticsData({
      visitors: 12543,
      orders: 234,
      revenue: 456789,
      conversionRate: 1.87,
      avgOrderValue: 1953
    });
  }, [timeRange]);

  const StatCard = ({ title, value, icon, trend, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Visitors"
          value={analyticsData.visitors}
          icon={<FaEye className="text-white text-xl" />}
          trend="+15.3%"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Orders"
          value={analyticsData.orders}
          icon={<FaShoppingCart className="text-white text-xl" />}
          trend="+8.2%"
          color="bg-green-500"
        />
        <StatCard
          title="Total Revenue"
          value={analyticsData.revenue}
          icon={<FaDollarSign className="text-white text-xl" />}
          trend="+12.5%"
          color="bg-[#f4c542]"
        />
        <StatCard
          title="Conversion Rate"
          value={`${analyticsData.conversionRate}%`}
          icon={<FaChartLine className="text-white text-xl" />}
          trend="+2.1%"
          color="bg-purple-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#f4c542" strokeWidth={2} />
              <Line type="monotone" dataKey="orders" stroke="#0B0B0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Traffic Sources</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trafficSources}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#f4c542" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Product Name</th>
                <th className="text-right py-3 px-4">Sales</th>
                <th className="text-right py-3 px-4">Revenue</th>
                <th className="text-right py-3 px-4">Trend</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="text-right py-3 px-4">{product.sales}</td>
                  <td className="text-right py-3 px-4">₹{product.revenue.toLocaleString()}</td>
                  <td className={`text-right py-3 px-4 ${product.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {product.trend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: "New order placed", time: "2 minutes ago", type: "order" },
            { action: "User registered", time: "5 minutes ago", type: "user" },
            { action: "Product review submitted", time: "8 minutes ago", type: "review" },
            { action: "Payment received", time: "12 minutes ago", type: "payment" },
            { action: "Support ticket created", time: "15 minutes ago", type: "support" }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${
                activity.type === 'order' ? 'bg-green-100 text-green-600' :
                activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'review' ? 'bg-purple-100 text-purple-600' :
                activity.type === 'payment' ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
              }`}>
                <FaClock className="text-sm" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
