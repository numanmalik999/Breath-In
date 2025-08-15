import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };

  return (
    <div className="bg-warmBeige">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question about our products, need assistance, or just want to say hello, please feel free to reach out.
          </p>
        </section>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            {isSubmitted ? (
              <div className="text-center flex flex-col items-center justify-center h-full">
                <Send className="h-12 w-12 text-sageGreen mb-4" />
                <h2 className="text-2xl font-semibold text-charcoal mb-2">Thank You!</h2>
                <p className="text-gray-600">Your message has been sent. We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="name" id="name" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" name="email" id="email" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea name="message" id="message" rows={5} required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen"></textarea>
                </div>
                <button type="submit" className="w-full bg-sageGreen text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-2xl font-serif text-charcoal">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-sageGreen p-3 rounded-full mt-1">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal">Email Us</h4>
                  <p className="text-gray-600">hello@breathin.store</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-sageGreen p-3 rounded-full mt-1">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal">Call Us</h4>
                  <p className="text-gray-600">1-800-BREATHIN</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-sageGreen p-3 rounded-full mt-1">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal">Find Us</h4>
                  <p className="text-gray-600">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;