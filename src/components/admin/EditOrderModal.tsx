import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Order } from './OrderManagement';

interface EditOrderModalProps {
  order: Order;
  onClose: () => void;
  onSave: (orderId: string, status: string, trackingNumber: string, courier: string) => void;
  isSaving: boolean;
}

const orderStatuses = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
const couriers = ['TCS', 'Leopards', 'M&P'];

const EditOrderModal: React.FC<EditOrderModalProps> = ({ order, onClose, onSave, isSaving }) => {
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
  const [courier, setCourier] = useState(order.courier || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(order.id, status, trackingNumber, courier);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Edit Order #{order.id.substring(0, 6)}...</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen"
              >
                {orderStatuses.map(s => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Courier Service</label>
              <select
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen"
              >
                <option value="" disabled>Select a courier</option>
                {couriers.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen"
              />
            </div>
          </div>
          <div className="p-4 flex justify-end space-x-2 border-t bg-gray-50 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-sageGreen text-white rounded-lg text-sm font-medium hover:bg-opacity-90 disabled:bg-opacity-50 flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderModal;