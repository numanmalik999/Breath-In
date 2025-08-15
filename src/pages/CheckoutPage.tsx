import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { Lock, Tag } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const provinces = [
  'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 
  'Gilgit-Baltistan', 'Islamabad Capital Territory', 'Azad Jammu and Kashmir'
];

const CheckoutPage = () => {
  const { state, getCartTotal, getDiscount, getFinalTotal, clearCart, setShippingProvince } = useCart();
  const { session, profile, refreshProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
  });

  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/login?redirect=/checkout');
    }
    if (!authLoading && state.items.length === 0) {
      navigate('/cart');
    }
  }, [session, authLoading, state.items, navigate]);

  useEffect(() => {
    if (profile) {
      setShippingInfo(prev => ({
        ...prev,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phoneNumber: profile.phone_number || '',
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (selectedProvince) {
      setShippingProvince(selectedProvince);
    }
  }, [selectedProvince, state.items, state.coupon, setShippingProvince]);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || state.items.length === 0 || !selectedProvince) {
      alert('Please fill out all required fields and select a province.');
      return;
    }

    setLoading(true);

    // 1. Update user profile with shipping info
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: shippingInfo.firstName,
        last_name: shippingInfo.lastName,
        phone_number: shippingInfo.phoneNumber,
      })
      .eq('id', session.user.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      // Non-critical, so we don't stop the order, but we won't refresh the profile state
    } else {
      await refreshProfile();
    }

    // 2. Create the order
    const subtotal = getCartTotal();
    const discount = getDiscount();
    const shippingCost = state.shippingCost;
    const totalAmount = getFinalTotal();

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: session.user.id,
        total_amount: totalAmount,
        subtotal: subtotal,
        discount: discount,
        shipping_cost: shippingCost,
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

    await clearCart();
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
              <input type="email" defaultValue={session.user.email} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Shipping address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="firstName" value={shippingInfo.firstName} onChange={handleShippingChange} placeholder="First name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  <input type="text" name="lastName" value={shippingInfo.lastName} onChange={handleShippingChange} placeholder="Last name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <input type="tel" name="phoneNumber" value={shippingInfo.phoneNumber} onChange={handleShippingChange} placeholder="Phone number" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="text" name="address" value={shippingInfo.address} onChange={handleShippingChange} placeholder="Street address" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="text" name="apartment" value={shippingInfo.apartment} onChange={handleShippingChange} placeholder="Apartment, suite, etc. (optional)" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="text" name="city" value={shippingInfo.city} onChange={handleShippingChange} placeholder="Town / City" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="" disabled>Select Province</option>
                  {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input type="text" name="postalCode" value={shippingInfo.postalCode} onChange={handleShippingChange} placeholder="Postcode / ZIP" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </section>
            
            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full bg-sageGreen text-white py-4 rounded-lg font-medium hover:bg-opacity-90 disabled:bg-opacity-50 flex items-center justify-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>{loading ? 'Placing Order...' : `Place Order - ${formatCurrency(getFinalTotal())}`}</span>
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
                <p className="font-medium">{formatCurrency(item.price * (item.quantity || 1))}</p>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(getCartTotal())}</span></div>
            {getDiscount() > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="flex items-center gap-2"><Tag className="h-4 w-4" /> Discount ({state.coupon?.code})</span>
                <span>-{formatCurrency(getDiscount())}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{state.shippingCost > 0 ? formatCurrency(state.shippingCost) : 'Free'}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(getFinalTotal())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;