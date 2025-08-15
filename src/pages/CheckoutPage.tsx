import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { Lock } from 'lucide-react';

const CheckoutPage = () => {
  const { state, getCartTotal, clearCart } = useCart();
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/login?redirect=/checkout');
    }
    if (!authLoading && state.items.length === 0) {
      navigate('/cart');
    }
  }, [session, authLoading, state.items, navigate]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || state.items.length === 0) return;

    setLoading(true);

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: session.user.id,
        total_amount: getCartTotal(),
        status: 'pending',
      })
      .select()
      .single();

    if (orderError || !orderData) {
      console.error('Error creating order:', orderError);
      alert('There was an error placing your order. Please try again.');
      setLoading(false);
      return;
    }

    const orderItems = state.items.map(item => ({
      order_id: orderData.id,
      product_id: item.id,
      quantity: item.quantity || 1,
      price: item.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      await supabase.from('orders').delete().eq('id', orderData.id);
      alert('There was an error saving your order items. Please try again.');
      setLoading(false);
      return;
    }

    clearCart();
    navigate(`/order-confirmation/${orderData.id}`);
  };

  if (authLoading || !session) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-serif text-charcoal mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" defaultValue={session.user.email} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="pt-6">
              <button type="submit" disabled={loading} className="w-full bg-sageGreen text-white py-4 rounded-lg font-medium hover:bg-opacity-90 disabled:bg-opacity-50 flex items-center justify-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>{loading ? 'Placing Order...' : `Place Order - $${getCartTotal().toFixed(2)}`}</span>
              </button>
            </div>
          </form>
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4 divide-y divide-gray-200">
            {state.items.map(item => (
              <div key={item.id} className="flex items-center space-x-4 pt-4 first:pt-0">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;