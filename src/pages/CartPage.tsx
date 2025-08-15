import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../integrations/supabase/client';
import { Plus, Minus, Trash2, ShoppingCart, Tag } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const CartPage = () => {
  const { state, updateQuantity, removeFromCart, getCartTotal, applyCoupon, removeCoupon, getDiscount, getFinalTotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidating(true);
    setCouponError('');
    setCouponSuccess('');

    const { data, error } = await supabase.functions.invoke('validate-coupon', {
      body: { couponCode: couponCode.trim() },
    });

    if (error || data.error) {
      setCouponError(error?.message || data.error);
    } else {
      applyCoupon(data);
      setCouponSuccess(`Coupon "${data.code}" applied!`);
      setCouponCode('');
    }
    setIsValidating(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-serif text-charcoal mb-8">Your Shopping Cart</h1>
      
      {state.items.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Your cart is empty</h2>
          <p className="mt-2 text-gray-600">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/shop" className="mt-6 inline-block bg-sageGreen text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {state.items.map(item => (
              <div key={item.id} className="p-6 flex items-center space-x-6">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-charcoal">{item.name}</h3>
                  <p className="text-sageGreen font-bold mt-1">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)} className="px-3 py-2 hover:bg-gray-100"><Minus className="h-4 w-4" /></button>
                  <span className="px-4 py-2 border-x border-gray-300">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)} className="px-3 py-2 hover:bg-gray-100"><Plus className="h-4 w-4" /></button>
                </div>
                <p className="font-semibold text-lg w-24 text-right">{formatCurrency(item.price * (item.quantity || 1))}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-600"><Trash2 className="h-5 w-5" /></button>
              </div>
            ))}
          </div>
          <div className="p-6 bg-gray-50 space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Have a coupon?</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  disabled={!!state.coupon}
                />
                <button onClick={handleApplyCoupon} disabled={isValidating || !!state.coupon} className="bg-dustyBlue text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 disabled:bg-opacity-50">
                  {isValidating ? 'Applying...' : 'Apply'}
                </button>
              </div>
              {couponError && <p className="text-red-600 text-sm mt-1">{couponError}</p>}
              {couponSuccess && <p className="text-green-600 text-sm mt-1">{couponSuccess}</p>}
            </div>
            <div className="text-right space-y-2">
              <div className="flex justify-end items-center space-x-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-xl font-semibold text-charcoal w-32 text-right">{formatCurrency(getCartTotal())}</span>
              </div>
              {state.coupon && (
                <div className="flex justify-end items-center space-x-4">
                  <span className="text-green-600 flex items-center gap-2">
                    <Tag className="h-4 w-4" /> Discount ({state.coupon.code})
                    <button onClick={removeCoupon} className="text-red-500 hover:underline text-xs">(Remove)</button>
                  </span>
                  <span className="text-xl font-semibold text-green-600 w-32 text-right">-{formatCurrency(getDiscount())}</span>
                </div>
              )}
              <div className="flex justify-end items-center space-x-4 border-t pt-2">
                <span className="text-lg font-bold text-charcoal">Total</span>
                <span className="text-2xl font-bold text-charcoal w-32 text-right">{formatCurrency(getFinalTotal())}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Shipping calculated at checkout</p>
            </div>
            <div className="mt-6 flex justify-end">
              <Link to="/checkout" className="bg-sageGreen text-white px-8 py-4 rounded-lg font-medium hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;