import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Search, Truck, Loader2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const courierTrackingUrls: { [key: string]: string } = {
  'TCS': 'https://www.tcsexpress.com/tracking?cn=',
  'Leopards': 'https://leopardscourier.com/shipment_tracking_view?cn_number=',
  'M&P': 'https://mulphilog.com/tracking?tracking_id=',
};

const TrackOrderPage = () => {
  const { settings } = useSettings();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    const { data, error: dbError } = await supabase
      .from('orders')
      .select('courier')
      .eq('tracking_number', trackingNumber.trim())
      .single();

    if (dbError || !data || !data.courier) {
      setError('Tracking number not found. Please check the number and try again.');
      setLoading(false);
      return;
    }

    const courier = data.courier;
    const trackingUrl = courierTrackingUrls[courier];

    if (trackingUrl) {
      setMessage(`Order found! Redirecting you to ${courier} for tracking...`);
      setTimeout(() => {
        window.open(trackingUrl + trackingNumber.trim(), '_blank');
        setLoading(false);
      }, 2000);
    } else {
      setError(`We don't have a tracking link for the courier: ${courier}.`);
      setLoading(false);
    }
  };

  return (
    <div className="bg-warmBeige">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <section className="text-center mb-12">
          <Truck className="mx-auto h-12 w-12 text-sageGreen mb-4" />
          <h1 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
            {settings?.track_order_page_title || 'Track Your Order'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {settings?.track_order_page_subtitle || 'Enter your tracking number below to see the status of your shipment.'}
          </p>
        </section>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Tracking Number
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="trackingNumber"
                  id="trackingNumber"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  required
                  placeholder="e.g., 1234567890"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sageGreen text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center space-x-2 disabled:bg-opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Truck className="h-5 w-5" />}
              <span>{loading ? 'Searching...' : 'Track Order'}</span>
            </button>
            {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
            {message && <p className="text-green-600 text-sm mt-2 text-center">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;