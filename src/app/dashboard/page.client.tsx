"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Users,
  Building2,
  Package,
  Trees,
  MapPin,
  Calendar,
  RefreshCw,
  Plus,
  FileText,
  Download,
  ChevronRight,
  Activity,
  Droplets,
  Wind,
  TrendingUp,
  UserPlus,
} from "lucide-react";

// Chart components
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";

// Import components
import Navbar from "~/ui/components/header/header";
import Sidebar from "~/ui/components/sidebar/sidebar";

// Content Loading component
const ContentLoading = () => (
  <div className="flex h-64 items-center justify-center bg-gray-50 dark:bg-gray-950 rounded-xl">
    <div className="flex flex-col items-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2e7d32] border-t-transparent"></div>
      <p className="mt-4 text-gray-700 dark:text-gray-400">
        Loading dashboard content...
      </p>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "primary",
  trend = null,
}: { 
  title: string; 
  value: string | number; 
  icon: any;
  color?: "primary" | "success" | "warning" | "danger" | "info";
  trend?: { value: number; isPositive: boolean } | null;
}) => {
  const colorClasses = {
    primary: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800",
    success: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800",
    danger: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800",
    info: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-800",
  };

  return (
    <div className={`rounded-xl border p-4 transition-all duration-300 ${colorClasses[color]} hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="rounded-full p-2 bg-white/50 dark:bg-gray-800/50">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <div className={`mt-2 flex items-center text-xs ${
            trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            <TrendingUp className={`mr-1 h-3 w-3 ${!trend.isPositive && 'rotate-180'}`} />
            <span>{trend.value}% from last period</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Weather Widget Component
const WeatherWidget = () => {
  const [weather] = useState({
    temperature: 25,
    humidity: 80,
    pressure: 1012,
    condition: "Sunny",
    icon: "☀️",
  });

  return (
    <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          <h3 className="font-medium">Weather Forecast</h3>
        </div>
        <div className="text-2xl">{weather.icon}</div>
      </div>
      <div className="mb-6">
        <div className="text-3xl font-bold mb-1">{weather.temperature}°C</div>
        <div className="text-sm opacity-90">{weather.condition}</div>
        <div className="mt-2 text-sm">
          <div className="flex items-center mb-1">
            <Droplets className="mr-2 h-4 w-4" />
            Humidity: {weather.humidity}%
          </div>
          <div className="flex items-center">
            <Wind className="mr-2 h-4 w-4" />
            Pressure: {weather.pressure} hPa
          </div>
        </div>
      </div>
    </div>
  );
};

// Farmers by State Chart Component - Simplified Bar Chart
const FarmersByStateChart = ({ 
  title, 
  data 
}: { 
  title: string; 
  data: Array<{
    state: string;
    farmer_count: number;
    registration_date?: string;
  }>;
}) => {
  // Ensure data is properly formatted and farmer_count is a number
  const chartData = (data || [])
    .map(item => ({
      state: item.state || 'Unknown',
      count: Number(item.farmer_count) || 0 // Convert to number
    }))
    .filter(item => item.count > 0) // Remove zero counts
    .sort((a, b) => b.count - a.count); // Sort by count descending

  const totalFarmers = chartData.reduce((sum, item) => sum + item.count, 0);
  
  // Colors for bars
  const COLORS = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#6366F1', // indigo
    '#14B8A6', // teal
    '#F97316', // orange
    '#6B7280', // gray
  ];

  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 lg:col-span-2">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">{title}</h3>
          <p className="text-sm text-gray-700 dark:text-gray-400">No farmer data available</p>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No farmers found by state</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">{title}</h3>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Farmer distribution across states
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-xs text-gray-700 dark:text-gray-400">Total Farmers</div>
            <div className="text-lg font-bold text-[#2e7d32]">{totalFarmers.toLocaleString()}</div>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
          <div className="text-right">
            <div className="text-xs text-gray-700 dark:text-gray-400">States/Regions</div>
            <div className="text-lg font-bold text-[#2e7d32]">{chartData.length}</div>
          </div>
          <button 
            onClick={() => {
              // Export to CSV functionality
              const csv = chartData.map(item => `${item.state},${item.count}`).join('\n');
              const blob = new Blob([`State,Farmers\n${csv}`], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'farmers_by_state.csv';
              a.click();
            }}
            className="rounded-lg border border-gray-300 bg-white p-1.5 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Simple Bar Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#6B7280" />
            <YAxis 
              type="category" 
              dataKey="state" 
              stroke="#6B7280"
              width={90}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                borderColor: '#374151', 
                color: '#F9FAFB' 
              }}
              formatter={(value: number) => [`${value.toLocaleString()} farmers`, 'Count']}
            />
            <Bar 
              dataKey="count" 
              name="Number of Farmers" 
              radius={[0, 4, 4, 0]}
              fill="#3B82F6"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* State-wise Distribution Table */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
          State-wise Distribution
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="pb-2 text-left text-xs font-medium text-gray-700 dark:text-gray-400">State</th>
                <th className="pb-2 text-right text-xs font-medium text-gray-700 dark:text-gray-400">Farmers</th>
                <th className="pb-2 text-right text-xs font-medium text-gray-700 dark:text-gray-400">Percentage</th>
                <th className="pb-2 text-right text-xs font-medium text-gray-700 dark:text-gray-400">Distribution</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, index) => (
                <tr key={item.state} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-2 text-sm text-gray-900 dark:text-gray-300">
                    <div className="flex items-center">
                      <span 
                        className="w-2 h-2 rounded-full mr-2" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      {item.state}
                    </div>
                  </td>
                  <td className="py-2 text-sm text-right text-gray-900 dark:text-gray-300">
                    {item.count.toLocaleString()}
                  </td>
                  <td className="py-2 text-sm text-right text-gray-900 dark:text-gray-300">
                    {((item.count / totalFarmers) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 text-right">
                    <div className="flex items-center justify-end">
                      <div className="w-24 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                        <div 
                          className="h-1.5 rounded-full" 
                          style={{ 
                            width: `${(item.count / totalFarmers) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                      <span className="ml-2 text-xs text-gray-700 dark:text-gray-400">
                        {((item.count / totalFarmers) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
          <div className="text-xs text-blue-600 dark:text-blue-400">Highest Concentration</div>
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {chartData[0]?.state || 'N/A'}
          </div>
          <div className="text-xs text-gray-700 dark:text-gray-400">
            {chartData[0]?.count.toLocaleString()} farmers ({((chartData[0]?.count / totalFarmers) * 100).toFixed(1)}%)
          </div>
        </div>
        <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
          <div className="text-xs text-green-600 dark:text-green-400">Average per State</div>
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {Math.round(totalFarmers / chartData.length).toLocaleString()}
          </div>
          <div className="text-xs text-gray-700 dark:text-gray-400">farmers per state</div>
        </div>
        <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
          <div className="text-xs text-purple-600 dark:text-purple-400">Coverage</div>
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {chartData.length} states
          </div>
          <div className="text-xs text-gray-700 dark:text-gray-400">
            {((chartData.length / 37) * 100).toFixed(1)}% of country
          </div>
        </div>
      </div>
    </div>
  );
};

// Interface for DashboardPage props
interface DashboardPageProps {
  user: any;
  farms: number;
  farmers: number;
  supply: number;
  farmersByState: Array<{
    state: string;
    farmer_count: number;
    registration_date?: string;
  }>;
  totalFarmers: number;
}

// Main Dashboard Component
export default function DashboardPage({
  user,
  farms,
  farmers,
  supply,
  farmersByState,
  totalFarmers,
}: DashboardPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Format farmers by state data - handle the field names from your query
  const formattedStateData = (farmersByState || []).map(item => ({
    state: item.state || 'Unknown',
    farmer_count: Number(item.farmer_count) || 0, // Convert to number
    registration_date: item.registration_date || ''
  }));

  // Debug log to check data
  useEffect(() => {
    console.log("Farmers by state data:", formattedStateData);
  }, [formattedStateData]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-0' : ''} lg:ml-64`}>
        <div className="p-4 md:p-6 pt-20 lg:pt-24">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-gray-50">
                  Welcome back, {user?.name || "Admin"}
                </h1>
                <p className="text-gray-700 dark:text-gray-400 mt-1">
                  Monitor farmer distribution and platform growth across states
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="flex items-center space-x-2">
                  <button className="flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </button>
                  <button 
                    onClick={() => setIsLoading(true)}
                    className="rounded-lg bg-[#2e7d32] p-2 text-white hover:bg-[#1b5e20]"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <ContentLoading />
          ) : (
            <>
              {/* Stats Grid */}
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Total Farmers"
                  value={farmers.toLocaleString()}
                  icon={Users}
                  color="success"
                />
                <StatCard
                  title="Total Farms"
                  value={farms.toLocaleString()}
                  icon={Building2}
                  color="primary"
                />
                <StatCard
                  title="Approved Suppliers"
                  value={supply.toLocaleString()}
                  icon={Package}
                  color="info"
                />
                <StatCard
                  title="States Covered"
                  value={formattedStateData.length}
                  icon={MapPin}
                  color="warning"
                />
              </div>

              {/* Main Content Area */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column - Farmers by State Chart */}
                <div className="lg:col-span-2">
                  <FarmersByStateChart 
                    title="Farmers by State Distribution"
                    data={formattedStateData}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Weather Widget */}
            /

                  {/* State Summary */}
                  <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">Top States</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-400">
                        States with highest farmer concentration
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {formattedStateData.slice(0, 5).map((item, index) => {
                        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
                        return (
                          <div key={item.state}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700 dark:text-gray-400">{item.state}</span>
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {item.farmer_count.toLocaleString()} farmers
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                              <div 
                                className="h-2 rounded-full"
                                style={{ 
                                  width: `${(item.farmer_count / Math.max(...formattedStateData.map(d => d.farmer_count))) * 100}%`,
                                  backgroundColor: colors[index]
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                        <div className="text-xs text-blue-600 dark:text-blue-400">Most Farmers</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {formattedStateData[0]?.state || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-400">
                          {formattedStateData[0]?.farmer_count.toLocaleString()} farmers
                        </div>
                      </div>
                      <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                        <div className="text-xs text-green-600 dark:text-green-400">States Active</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {formattedStateData.length}
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-400">
                          regions covered
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">Quick Actions</h3>
                    </div>
                    <div className="space-y-2">
                      <Link 
                        href="/dashboard/farmers/add" 
                        className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                            <UserPlus className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Add New Farmer</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                      
                      <Link 
                        href="/dashboard/reports" 
                        className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Generate Report</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                      
                      <Link 
                        href="/dashboard/farmers" 
                        className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">View All Farmers</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>

                      <Link 
                        href="/dashboard/states" 
                        className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3">
                            <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">View State Details</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* State-wise Farmer Distribution Table */}
              <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">State-wise Farmer Distribution</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      Complete breakdown by state/region
                    </p>
                  </div>
                  <Link 
                    href="/dashboard/farmers" 
                    className="text-sm text-[#2e7d32] hover:text-[#1b5e20] flex items-center"
                  >
                    View all farmers
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="pb-3 text-left text-sm font-medium text-gray-700 dark:text-gray-400">State</th>
                        <th className="pb-3 text-left text-sm font-medium text-gray-700 dark:text-gray-400">Farmers</th>
                        <th className="pb-3 text-left text-sm font-medium text-gray-700 dark:text-gray-400">Percentage</th>
                        <th className="pb-3 text-left text-sm font-medium text-gray-700 dark:text-gray-400">vs National Avg</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formattedStateData
                        .sort((a, b) => b.farmer_count - a.farmer_count)
                        .map((item, index, array) => {
                          const avg = farmers / array.length;
                          const vsAvg = ((item.farmer_count - avg) / avg) * 100;
                          
                          return (
                            <tr key={item.state} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="py-3 font-medium text-gray-900 dark:text-gray-300">{item.state}</td>
                              <td className="py-3 text-gray-900 dark:text-gray-300">{item.farmer_count.toLocaleString()}</td>
                              <td className="py-3">
                                <div className="flex items-center">
                                  <span className="text-gray-900 dark:text-gray-300 mr-2">
                                    {((item.farmer_count / farmers) * 100).toFixed(1)}%
                                  </span>
                                  <div className="w-16 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                    <div 
                                      className="h-1.5 rounded-full bg-blue-500"
                                      style={{ width: `${(item.farmer_count / farmers) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="py-3">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                  vsAvg > 0 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : vsAvg < 0
                                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                }`}>
                                  {vsAvg > 0 ? '+' : ''}{vsAvg.toFixed(1)}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}