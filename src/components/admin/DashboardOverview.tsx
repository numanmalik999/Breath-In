import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  Star,
  AlertCircle,
  Eye,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { Product, mapProductData } from '../../data/products';

interface StatCard {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  note?: string;
}

const DashboardOverview = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: products, error } = await supabase
        .from('products')
        .select('*');

      if (error || !products) {
        console.error("Error fetching dashboard data", error);
        return;
      }

      const totalProducts = products.length;
      const productsInStock = products.filter(p => p.in_stock).length;
      const totalReviews = products.reduce((acc, p) => acc + (p.review_count || 0), 0);

      const newStats: StatCard[] = [
        { title: 'Total Products', value: totalProducts.toString(), icon: Package, color: 'bg-blue-500' },
        { title: 'Products In Stock', value: productsInStock.toString(), icon: CheckCircle, color: 'bg-green-500' },
        { title: 'Total Reviews', value: totalReviews.toString(), icon: Star, color: 'bg-yellow-500' },
        { title: 'Revenue / Orders', value: 'N/A', icon: DollarSign, color: 'bg-gray-400', note: 'Requires orders table' },
      ];
      setStats(newStats);

      const sortedProducts = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setTopProducts(sortedProducts.slice(0, 4).map(mapProductData));
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            {stat.note && (
              <p className="text-xs text-gray-400 mt-4">{stat.note}</p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Rated Products</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topProducts.length > 0 ? topProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.reviewCount} reviews</p>
                </div>
                <div className="text-right flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium text-gray-900">{product.rating}</span>
                </div>
              </div>
            )) : (
              <p className="text-gray-500">No products found.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => alert('Please go to the Products tab to add a new product.')} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Package className="h-5 w-5 text-sageGreen" />
            <span className="font-medium text-gray-700">Add New Product</span>
          </button>
          <button onClick={() => navigate('/')} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Eye className="h-5 w-5 text-sageGreen" />
            <span className="font-medium text-gray-700">View Website</span>
          </button>
          <button onClick={() => alert('No new alerts.')} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <AlertCircle className="h-5 w-5 text-sageGreen" />
            <span className="font-medium text-gray-700">Check Alerts</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;