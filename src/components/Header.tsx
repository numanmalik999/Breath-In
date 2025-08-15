import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Cart from './Cart';

const Header = () => {
  const { toggleCart, getCartCount } = useCart();
  const { session } = useAuth();

  return (
    <>
      <header className="bg-offWhite shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-serif font-semibold text-sageGreen">
                Breathe
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-charcoal hover:text-sageGreen transition-colors duration-200">
                Shop
              </a>
              <a href="#" className="text-charcoal hover:text-sageGreen transition-colors duration-200">
                About
              </a>
              <a href="#" className="text-charcoal hover:text-sageGreen transition-colors duration-200">
                Blog
              </a>
              <a href="#" className="text-charcoal hover:text-sageGreen transition-colors duration-200">
                Contact
              </a>
              <Link to="/admin" className="text-charcoal hover:text-sageGreen transition-colors duration-200">
                Admin
              </Link>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <Search className="h-5 w-5 text-charcoal hover:text-sageGreen cursor-pointer transition-colors duration-200" />
              <Link to={session ? "/account" : "/login"}>
                <User className="h-5 w-5 text-charcoal hover:text-sageGreen cursor-pointer transition-colors duration-200" />
              </Link>
              <div className="relative">
                <ShoppingBag 
                  className="h-5 w-5 text-charcoal hover:text-sageGreen cursor-pointer transition-colors duration-200"
                  onClick={toggleCart}
                />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 bg-terracotta rounded-full flex items-center justify-center text-xs text-white">
                    {getCartCount()}
                  </span>
                )}
              </div>
              <Menu className="h-5 w-5 text-charcoal md:hidden cursor-pointer" />
            </div>
          </div>
        </div>
      </header>
      <Cart />
    </>
  );
};

export default Header;