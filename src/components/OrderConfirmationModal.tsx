import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { CheckCircle, ShoppingBag, X } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { useSettings } from '../context/SettingsContext';

interface OrderItem {
  quantity: number;
  price: number;
  products: {
    name: string;
    images: string[];
  };
}

export interface ConfirmedOrderDetails {
  id: string;
  total_amount: number;
  created_at: string;
  customer_name: string;
  order_items: OrderItem[];
}

interface OrderConfirmationModalProps {
  order: ConfirmedOrderDetails | null;
  onClose: () => void;
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ order, onClose }) => {
  const { settings } = useSettings();
  const navigate = useNavigate(); // Use useNavigate hook here

  if (!order) return null;

  const whatsappNumber = settings?.whatsapp_contact_number;
  const orderSummaryText = order.order_items
    .map(item => `${item.products.name} (x${item.quantity})`)
    .join(', ');
  const whatsappMessage = `Hi! I've just placed order #${order.id.substring(0, 8)} with the following items: ${orderSummaryText}. Please prioritize it for faster dispatch. Thank you!`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleContinueShopping = () => {
    onClose(); // Close the modal
    navigate('/shop'); // Navigate to shop page
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-4 flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="px-8 pb-8 text-center overflow-y-auto">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-serif text-charcoal">Thank you, {order.customer_name}!</h1>
          <p className="mt-2 text-gray-600">Your order has been placed successfully. A confirmation email is on its way.</p>

          <div className="mt-8 text-left bg-gray-50 p-6 rounded-lg border space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Order #{order.id.substring(0, 8)}</h2>
              <span className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
              {order.order_items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <img src={item.products.images?.[0] || ''} alt={item.products.name} className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.products.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-sm">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
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

          <button 
            onClick={handleContinueShopping} 
            className="mt-4 block w-full text-center text-sageGreen hover:underline py-2"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;