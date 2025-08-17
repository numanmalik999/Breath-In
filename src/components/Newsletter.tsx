import React, { useState } from 'react';
import { Mail, Gift, Loader2 } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setIsSubmitted(false);

    const { error: insertError } = await supabase
      .from('subscribers')
      .insert({ email });

    if (insertError) {
      if (insertError.code === '23505') { // Unique constraint violation
        setError('This email address is already subscribed.');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Error subscribing:', insertError);
    } else {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 5000);
    }
    setLoading(false);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-sageGreen to-dustyBlue">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="bg-sageGreen p-4 rounded-full">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-4">
            Join the Breathin Community
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Be the first to know about new products, special offers, and sleep wellness advice.
          </p>
          
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2 text-terracotta">
              <Gift className="h-5 w-5" />
              <span className="font-semibold">Exclusive Deals + Breathing Tips</span>
            </div>
          </div>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen focus:border-transparent"
                  required
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-sageGreen text-white px-8 py-4 rounded-lg font-medium hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200 whitespace-nowrap flex items-center justify-center disabled:bg-opacity-50"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Subscribe'}
                </button>
              </div>
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800">
                  Thank you for subscribing! Keep an eye on your inbox.
                </p>
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-500 mt-6">
            By subscribing, you agree to our privacy policy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;