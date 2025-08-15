import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';

const CartPage = () => {
  const { state, updateQuantity, removeFromCart, getCartTotal } = useCart();

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
                  <p className="text-sageGreen font-bold mt-1">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="font-semibold text-lg w-20 text-right">
                  ${(item.price * (item.quantity || 1)).toFixed(2)}
                </p>
                <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-600">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <div className="p-6 bg-gray-50">
            <div className="flex justify-end items-center">
              <div className="text-right">
                <p className="text-gray-600">Subtotal</p>
                <p className="text-2xl font-bold text-charcoal">${getCartTotal().toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">Taxes and shipping calculated at checkout</p>
              </div>
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