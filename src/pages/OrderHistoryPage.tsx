import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { Package, Calendar, Hash } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
}

const OrderHistoryPage = () => {
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/login');
    }
  }, [session, authLoading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user) {
        setLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select('id, created_at, status, total_amount')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching orders:', error);
        } else {
          setOrders(data || []);
        }
        setLoading(false);
      }
    };

    if (session) {
      fetchOrders();
    }
  }, [session]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p>Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-serif text-charcoal mb-8">Order History</h1>
      {orders.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">No Orders Yet</h2>
          <p className="mt-2 text-gray-600">You haven't placed any orders with us yet. When you do, they'll appear here.</p>
          <Link to="/" className="mt-6 inline-block bg-sageGreen text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {orders.map(order => (
              <li key={order.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Hash className="h-4 w-4" />
                      <span>Order #{order.id.substring(0, 8)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Status</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                        {order.status}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-semibold text-gray-800">{formatCurrency(order.total_amount)}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;