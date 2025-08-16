import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { CheckCircle } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

interface OrderDetails {
  id: string;
  total_amount: number;
  created_at: string;
}

const OrderConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('id, total_amount, created_at')
        .eq('id', orderId)
        .single();
      
      if (error) {
        console.error('Error fetching order:', error);
      } else {
        setOrder(data);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        {loading ? (
          <p>Loading order details...</p>
        ) : !order ? (
          <p>Order not found.</p>
        ) : (
          <>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h1 className="mt-4 text-3xl font-serif text-charcoal">Thank you for your order!</h1>
            <p className="mt-2 text-gray-600">Your order has been placed successfully. A confirmation email has been sent, and the store admin has been notified.</p>
            
            <div className="mt-8 text-left bg-gray-50 p-6 rounded-lg border">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium text-gray-800">#{order.id.substring(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium text-gray-800">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Total:</span>
                  <span className="font-medium text-gray-800">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>

            <Link to="/shop" className="mt-6 inline-block bg-sageGreen text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200">
              Continue Shopping
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmationPage;