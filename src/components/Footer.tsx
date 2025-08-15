import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-charcoal text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="text-2xl font-serif font-semibold text-sageGreen">
              Breathin
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Revolutionary magnetic nasal strips designed to improve your breathing and enhance your sleep quality naturally.
            </p>
            <div className="flex space-x-4">
              <Instagram className="h-5 w-5 text-gray-400 hover:text-sageGreen cursor-pointer transition-colors duration-200" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-sageGreen cursor-pointer transition-colors duration-200" />
              <Facebook className="h-5 w-5 text-gray-400 hover:text-sageGreen cursor-pointer transition-colors duration-200" />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-300 hover:text-sageGreen transition-colors duration-200">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-sageGreen transition-colors duration-200">Contact</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-sageGreen transition-colors duration-200">FAQ</a></li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-sageGreen transition-colors duration-200">Shipping & Returns</a></li>
              <li><a href="#" className="text-gray-300 hover:text-sageGreen transition-colors duration-200">Size Guide</a></li>
              <li><a href="#" className="text-gray-300 hover:text-sageGreen transition-colors duration-200">Care Instructions</a></li>
              <li><a href="#" className="text-gray-300 hover:text-sageGreen transition-colors duration-200">Track Your Order</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-sageGreen" />
                <span className="text-gray-300">hello@breathin.store</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-sageGreen" />
                <span className="text-gray-300">1-800-BREATHIN</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-sageGreen" />
                <span className="text-gray-300">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Breathin. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-sageGreen transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-sageGreen transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-sageGreen transition-colors duration-200">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;