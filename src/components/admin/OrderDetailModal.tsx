import React from 'react';
import { X, User, Mail, Phone, MapPin } from 'lucide-react';
import { Order } from './OrderManagement';
import { formatCurrency } from '../../utils/currency';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Order Details #{order.id.substring(0, 6)}...</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Customer & Shipping Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Customer Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center"><User className="h-4 w-4 mr-2" />{order.customer_name || 'N/A'}</p>
                <p className="flex items-center"><Mail className="h-4 w-4 mr-2" />{order.customer_email}</p>
                <p className="flex items-center"><Phone className="h-4 w-4 mr-2" />{order.customer_phone || 'N/A'}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Shipping Address</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-start"><MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                  <span>
                    {order.shipping_address}<br />
                    {order.shipping_city}, {order.shipping_province} {order.shipping_postal_code}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Order Summary</h3>
            <div className="border rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Order Date</span><span>{new Date(order.created_at).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Status</span><span className="capitalize">{order.status}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Items</span><span>{order.item_count}</span></div>
              <div className="flex justify-between font-semibold pt-2 border-t"><span className="text-gray-800">Total Amount</span><span>{formatCurrency(order.total_amount)}</span></div>
            </div>
          </div>

          {/* Items - This part requires fetching order items, which is not included in the current 'Order' type */}
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Items in Order</h3>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Displaying individual items requires fetching them separately. This feature can be added next.
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 flex justify-end border-t bg-gray-50 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;