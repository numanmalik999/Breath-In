import { useState, useEffect } from 'react';
import { Search, Filter, Mail, ShoppingBag } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { formatCurrency } from '../../utils/currency';

interface Customer {
  user_id: string;
  email: string;
  joined_date: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string | null;
}

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_customers_with_details');
      if (error) {
        console.error('Error fetching customers:', error);
        setError('Failed to fetch customer data.');
      } else {
        setCustomers(data as Customer[]);
      }
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatus = (customer: Customer) => {
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
    if (new Date(customer.joined_date) > thirtyDaysAgo && customer.total_orders === 0) {
      return { label: 'new', color: 'bg-blue-100 text-blue-800' };
    }
    if (customer.total_spent > 100) {
      return { label: 'vip', color: 'bg-purple-100 text-purple-800' };
    }
    if (customer.total_orders > 0) {
      return { label: 'active', color: 'bg-green-100 text-green-800' };
    }
    return { label: 'prospect', color: 'bg-gray-100 text-gray-800' };
  };

  const customerStats = {
    total: customers.length,
    new: customers.filter(c => getStatus(c).label === 'new').length,
    active: customers.filter(c => getStatus(c).label === 'active').length,
    vip: customers.filter(c => getStatus(c).label === 'vip').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
        <p className="text-gray-600">Manage your customer relationships</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-2xl font-bold text-gray-900">{customerStats.total}</p>
          <p className="text-sm text-gray-600">Total Customers</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-2xl font-bold text-blue-600">{customerStats.new}</p>
          <p className="text-sm text-gray-600">New Customers</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-2xl font-bold text-green-600">{customerStats.active}</p>
          <p className="text-sm text-gray-600">Active Customers</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-2xl font-bold text-purple-600">{customerStats.vip}</p>
          <p className="text-sm text-gray-600">VIP Customers</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="text-center p-6 text-gray-500">Loading customers...</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="text-center p-6 text-red-500">{error}</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-6 text-gray-500">No customers found.</td></tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const status = getStatus(customer);
                  return (
                    <tr key={customer.user_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-sageGreen rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">{customer.email.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              <Mail className="h-3 w-3 mr-2 text-gray-400" />
                              {customer.email}
                            </div>
                            <div className="text-sm text-gray-500">Joined: {new Date(customer.joined_date).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ShoppingBag className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{customer.total_orders}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(customer.total_spent)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;