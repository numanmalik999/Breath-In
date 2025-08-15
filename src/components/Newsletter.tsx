import React, { useState } from 'react';
import { Mail, Gift } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
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
            Get 10% off your first order and breathing tips in your inbox. 
            Plus, be the first to know about new products and sleep wellness advice.
          </p>
          
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2 text-terracotta">
              <Gift className="h-5 w-5" />
              <span className="font-semibold">10% OFF + Free Shipping on First Order</span>
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
                  className="bg-sageGreen text-white px-8 py-4 rounded-lg font-medium hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800">
                  Thank you for subscribing! Check your email for your discount code.
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