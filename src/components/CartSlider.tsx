import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';

const CartSlider = () => {
  const { state, closeCart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { isCartOpen, items } = state;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      ></div>

      {/* Slider */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-serif font-semibold text-charcoal">Your Cart</h2>
            <button onClick={closeCart} className="text-gray-500 hover:text-gray-800">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Items */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-charcoal">Your cart is empty</h3>
              <p className="text-gray-500 mt-2">Add some products to get started.</p>
              <Link
                to="/shop"
                onClick={closeCart}
                className="mt-6 bg-sageGreen text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal">{item.name}</h3>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center border border-gray-200 rounded">
                        <button onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)} className="px-2 py-1 hover:bg-gray-100"><Minus className="h-3 w-3" /></button>
                        <span className="px-3 py-1 text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)} className="px-2 py-1 hover:bg-gray-100"><Plus className="h-3 w-3" /></button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 text-xs mt-2">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-charcoal">Subtotal</span>
                <span className="text-xl font-bold text-charcoal">${getCartTotal().toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 text-center mb-4">Taxes and shipping calculated at checkout.</p>
              <div className="space-y-3">
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="w-full block text-center bg-sageGreen text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200"
                >
                  Checkout
                </Link>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="w-full block text-center bg-white border border-gray-300 text-charcoal py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200"
                >
                  View Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSlider;