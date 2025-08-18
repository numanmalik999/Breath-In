import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useSettings } from '../context/SettingsContext';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { useCart } from '../context/CartContext';

interface OrderItem {
  quantity: number;
  price: number;
  products: {
    name: string;
    images: string[];
  };
}

interface OrderDetails {
  id: string;
  total_amount: number;
  created_at: string;
  customer_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postal_code: string;
  order_items: OrderItem[];
}

const OrderConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { settings } = useSettings();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(name, images))')
        .eq('id', orderId)
        .single();
      
      if (error) {
        console.error('Error fetching order:', error);
      } else {
        setOrder(data as OrderDetails);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  const whatsappNumber = settings?.whatsapp_contact_number;
  const orderSummaryText = order?.order_items
    .map(item => `${item.products.name} (x${item.quantity})`)
    .join(', ');
  const whatsappMessage = `Hi! I've just placed order #${order?.id.substring(0, 8)} with the following items: ${orderSummaryText}. Please prioritize it for faster dispatch. Thank you!`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        {loading ? (
          <p className="text-center">Loading order details...</p>
        ) : !order ? (
          <p className="text-center">Order not found.</p>
        ) : (
          <>
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h1 className="mt-4 text-3xl font-serif text-charcoal">Thank you, {order.customer_name}!</h1>
              <p className="mt-2 text-gray-600">Your order has been placed successfully. A confirmation email is on its way.</p>
            </div>
            
            <div className="mt-8 text-left bg-gray-50 p-6 rounded-lg border space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">Order #{order.id.substring(0, 8)}</h2>
                <span className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="space-y-3">
                {order.order_items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img src={item.products.images[0]} alt={item.products.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-medium">{item.products.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
            </div>

            <div className="mt-6 text-left">
              <h3 className="font-semibold text-md mb-2">Shipping to:</h3>
              <p className="text-sm text-gray-600">{order.shipping_address}, {order.shipping_city}, {order.shipping_province}, {order.shipping_postal_code}</p>
            </div>

            {whatsappNumber && (
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 w-full flex items-center justify-center space-x-3 bg-green-500 text-white px-6 py-4 rounded-lg font-medium hover:bg-green-600 transition-all duration-200"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Send to WhatsApp for Faster Dispatch</span>
              </a>
            )}

            <Link to="/shop" className="mt-4 block text-center text-sageGreen hover:underline">
              Continue Shopping
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmationPage;