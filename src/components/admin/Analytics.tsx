import React from 'react';
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Eye } from 'lucide-react';

const Analytics = () => {
  const metrics = [
    {
      title: 'Revenue',
      value: '$12,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Orders',
      value: '247',
      change: '+8.2%',
      changeType: 'positive',
      icon: ShoppingBag,
      color: 'text-blue-600'
    },
    {
      title: 'Customers',
      value: '1,429',
      change: '+15.3%',
      changeType: 'positive',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Page Views',
      value: '8,942',
      change: '-2.1%',
      changeType: 'negative',
      icon: Eye,
      color: 'text-orange-600'
    }
  ];

  const topPages = [
    { page: 'Homepage', views: 3247, percentage: 36.3 },
    { page: 'Breathin Starter Kit', views: 2156, percentage: 24.1 },
    { page: 'Breathin Refills', views: 1834, percentage: 20.5 },
    { page: 'About Us', views: 892, percentage: 10.0 },
    { page: 'Contact', views: 813, percentage: 9.1 }
  ];

  const trafficSources = [
    { source: 'Organic Search', visitors: 4521, percentage: 45.2 },
    { source: 'Direct', visitors: 2847, percentage: 28.5 },
    { source: 'Social Media', visitors: 1634, percentage: 16.3 },
    { source: 'Email', visitors: 723, percentage: 7.2 },
    { source: 'Referral', visitors: 275, percentage: 2.8 }
  ];

  const salesData = [
    { month: 'Jan', sales: 4200 },
    { month: 'Feb', sales: 3800 },
    { month: 'Mar', sales: 5200 },
    { month: 'Apr', sales: 4900 },
    { month: 'May', sales: 6100 },
    { month: 'Jun', sales: 5800 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600">Track your website performance and sales metrics</p>
      </div>

      {/* Key Metrics */}
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
              <span className="text-sm text-gray-500 ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <div className="space-y-4">
            {salesData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{data.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-sageGreen h-2 rounded-full" 
                      style={{ width: `${(data.sales / 6100) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">${data.sales}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow-sm p-6">
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

      {/* Traffic Sources */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {trafficSources.map((source, index) => (
            <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{source.visitors}</p>
              <p className="text-sm font-medium text-gray-600 mt-1">{source.source}</p>
              <p className="text-xs text-gray-500">{source.percentage}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <span className="font-medium text-gray-900">Website Visitors</span>
            <span className="text-xl font-bold text-blue-600">10,000</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <span className="font-medium text-gray-900">Product Page Views</span>
            <span className="text-xl font-bold text-yellow-600">3,990 (39.9%)</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
            <span className="font-medium text-gray-900">Add to Cart</span>
            <span className="text-xl font-bold text-orange-600">798 (8.0%)</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <span className="font-medium text-gray-900">Purchases</span>
            <span className="text-xl font-bold text-green-600">247 (2.5%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;