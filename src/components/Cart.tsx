import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { state, toggleCart, removeFromCart, getCartTotal } = useCart();

  if (!state.isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={toggleCart}></div>
      <div className="fixed right-0 top-0 h-full w-96 bg-offWhite shadow-xl z-50 transform transition-transform duration-300">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-serif font-semibold">Shopping Cart</h2>
          <X className="h-5 w-5 cursor-pointer" onClick={toggleCart} />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 bg-white p-3 rounded-lg">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sageGreen font-semibold">${item.price}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button className="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span>{item.quantity}</span>
                      <button className="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {state.items.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total: ${getCartTotal().toFixed(2)}</span>
            </div>
            <button className="w-full bg-sageGreen text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors duration-200">
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;