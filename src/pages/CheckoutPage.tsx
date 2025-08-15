import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { Lock, Tag } from 'lucide-react';

const CheckoutPage = () => {
  const { state, getCartTotal, getDiscount, getFinalTotal, clearCart } = useCart();
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showApartment, setShowApartment] = useState(false);

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
        total_amount: getFinalTotal(),
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
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">Contact information</h2>
              <p className="text-sm text-gray-600 mb-4">We'll use this email to send you details and updates about your order.</p>
              <input type="email" defaultValue={session.user.email} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Shipping address</h2>
              <p className="text-sm text-gray-600 mb-4">Enter the address where you want your order delivered.</p>
              <div className="space-y-4">
                <input type="text" placeholder="Country / Region" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  <input type="text" placeholder="Last name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <input type="text" placeholder="Street address" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                {!showApartment && <button type="button" onClick={() => setShowApartment(true)} className="text-sm text-sageGreen hover:underline">+ Add apartment, suite, unit, etc.</button>}
                {showApartment && <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />}
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Town / City" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  <input type="text" placeholder="State / County" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Postcode / ZIP" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  <input type="text" placeholder="Phone (optional)" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
            </section>
            
            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full bg-sageGreen text-white py-4 rounded-lg font-medium hover:bg-opacity-90 disabled:bg-opacity-50 flex items-center justify-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>{loading ? 'Placing Order...' : `Place Order - $${getFinalTotal().toFixed(2)}`}</span>
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
            <div className="flex justify-between"><span>Subtotal</span><span>${getCartTotal().toFixed(2)}</span></div>
            {getDiscount() > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="flex items-center gap-2"><Tag className="h-4 w-4" /> Discount ({state.coupon?.code})</span>
                <span>-${getDiscount().toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">Free</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span>${getFinalTotal().toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;