import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Eye } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';

interface Metric {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ElementType;
  color: string;
}

interface SalesData {
  month: string;
  sales: number;
}

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      const { data: analyticsData, error: functionError } = await supabase.functions.invoke('get-analytics-data');
      
      if (functionError || !analyticsData) {
        console.error('Error fetching analytics:', functionError);
        setError('Failed to load analytics data. This is expected if there are no orders or customers yet.');
      } else {
        const newMetrics: Metric[] = [
          {
            title: 'Revenue',
            value: `$${analyticsData.revenue.value.toFixed(2)}`,
            change: `${analyticsData.revenue.change.toFixed(1)}%`,
            changeType: analyticsData.revenue.change >= 0 ? 'positive' : 'negative',
            icon: DollarSign,
            color: 'text-green-600'
          },
          {
            title: 'Orders',
            value: analyticsData.orders.value.toString(),
            change: `${analyticsData.orders.change.toFixed(1)}%`,
            changeType: analyticsData.orders.change >= 0 ? 'positive' : 'negative',
            icon: ShoppingBag,
            color: 'text-blue-600'
          },
          {
            title: 'Customers',
            value: analyticsData.customers.value.toString(),
            change: `${analyticsData.customers.change.toFixed(1)}%`,
            changeType: analyticsData.customers.change >= 0 ? 'positive' : 'negative',
            icon: Users,
            color: 'text-purple-600'
          },
          {
            title: 'Page Views',
            value: 'N/A',
            change: '0%',
            changeType: 'positive',
            icon: Eye,
            color: 'text-orange-600'
          }
        ];
        setMetrics(newMetrics);
        setSalesData(analyticsData.salesData);
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  const topPages = [
    { page: 'Homepage', views: 3247, percentage: 36.3 },
    { page: 'Breathin Starter Kit', views: 2156, percentage: 24.1 },
    { page: 'Breathin Refills', views: 1834, percentage: 20.5 },
    { page: 'About Us', views: 892, percentage: 10.0 },
    { page: 'Contact', views: 813, percentage: 9.1 }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600">Displaying real-time sales and customer data</p>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              </div>
              <metric.icon className={`h-8 w-8 ${metric.color}`} />
            </div>
            <div className="mt-4 flex items-center">
              {metric.changeType === 'positive' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ml-1 ${
                metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last 30 days</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend (Last 6 Months)</h3>
          <div className="space-y-4">
            {salesData.length > 0 ? salesData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{data.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-sageGreen h-2 rounded-full" 
                      style={{ width: `${(data.sales / Math.max(...salesData.map(s => s.sales), 1)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">${data.sales.toFixed(2)}</span>
                </div>
              </div>
            )) : <p className="text-sm text-gray-500">No sales data yet.</p>}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 relative">
          <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-sm flex items-center justify-center z-10">
            <p className="text-sm font-semibold text-gray-500">Requires Analytics Service</p>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{page.page}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-dustyBlue h-2 rounded-full" 
                      style={{ width: `${page.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-sm font-medium text-gray-900">{page.views}</p>
                  <p className="text-xs text-gray-500">{page.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;