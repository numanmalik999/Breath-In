import { Truck, RotateCcw, Package, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const ShippingReturnsPage = () => {
  const { settings } = useSettings();

  return (
    <div className="bg-offWhite">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
            {settings?.shipping_page_title || 'Shipping & Returns'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {settings?.shipping_page_subtitle || 'Everything you need to know about our shipping process and how to make a return.'}
          </p>
        </section>

        {/* Shipping Policy Section */}
        <section className="mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-sageGreen p-3 rounded-full">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-serif text-charcoal ml-4">Shipping Policy</h2>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
            <div className="flex items-start space-x-4">
              <Clock className="h-5 w-5 text-terracotta mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-charcoal">Processing Time</h3>
                <p className="text-gray-600">{settings?.shipping_processing_text || 'Orders are processed within 1-2 business days. You will receive a notification when your order has shipped.'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Package className="h-5 w-5 text-terracotta mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-charcoal">Shipping Rates & Delivery Estimates</h3>
                <p className="text-gray-600">{settings?.shipping_rates_text || 'Shipping charges for your order will be calculated and displayed at checkout.'}</p>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                  <li><span className="font-medium">Punjab:</span> 2-3 business days (Rs {settings?.shipping_cost_punjab || 200}, free over Rs {settings?.shipping_free_threshold || 1499})</li>
                  <li><span className="font-medium">Other Provinces:</span> 3-5 business days (Rs {settings?.shipping_cost_other || 300}, free over Rs {settings?.shipping_free_threshold || 1499})</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Return Policy Section */}
        <section>
          <div className="flex items-center justify-center mb-6">
            <div className="bg-dustyBlue p-3 rounded-full">
              <RotateCcw className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-serif text-charcoal ml-4">Return Policy</h2>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
            <p className="text-gray-600">{settings?.shipping_returns_text || 'We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.'}</p>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">Eligibility for a Return</h3>
              <p className="text-gray-600">To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.</p>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">How to Start a Return</h3>
              <p className="text-gray-600">To start a return, you can contact us at <a href={`mailto:${settings?.contact_email || 'hello@breathin.store'}`} className="text-sageGreen hover:underline">{settings?.contact_email || 'hello@breathin.store'}</a>. If your return is accepted, we’ll send you instructions on how and where to send your package.</p>
            </div>
             <div>
              <h3 className="font-semibold text-charcoal mb-2">Refunds</h3>
              <p className="text-gray-600">We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShippingReturnsPage;