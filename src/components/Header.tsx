import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { getCategories, Category } from '../data/products';

const Header = () => {
  const { getCartCount, openCart } = useCart();
  const { session } = useAuth();
  const { openSearch } = useSearch();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryMenuOpen, setCategoryMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <>
      <header className="bg-offWhite shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-serif font-semibold text-sageGreen">
                Breathin
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <div 
                className="relative"
                onMouseEnter={() => setCategoryMenuOpen(true)}
                onMouseLeave={() => setCategoryMenuOpen(false)}
              >
                <Link to="/shop" className="text-charcoal hover:text-sageGreen transition-colors duration-200 flex items-center">
                  Shop <ChevronDown className="h-4 w-4 ml-1" />
                </Link>
                {isCategoryMenuOpen && categories.length > 0 && (
                  <div className="absolute top-full left-0 pt-2 w-56 z-50">
                    <div className="bg-white rounded-lg shadow-lg py-2">
                      {categories.map(category => (
                        <Link 
                          key={category.id} 
                          to={`/shop/${category.slug}`}
                          className="block px-4 py-2 text-sm text-charcoal hover:bg-gray-100"
                          onClick={() => setCategoryMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link to="/about" className="text-charcoal hover:text-sageGreen transition-colors duration-200">
                About
              </Link>
              <Link to="/contact" className="text-charcoal hover:text-sageGreen transition-colors duration-200">
                Contact
              </Link>
              <Link to="/track-order" className="text-charcoal hover:text-sageGreen transition-colors duration-200">
                Track Order
              </Link>
              <Link to="/admin" className="text-charcoal hover:text-sageGreen transition-colors duration-200">
                Admin
              </Link>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <button onClick={openSearch} className="text-charcoal hover:text-sageGreen cursor-pointer transition-colors duration-200">
                <Search className="h-5 w-5" />
              </button>
              <Link to={session ? "/account" : "/login"}>
                <User className="h-5 w-5 text-charcoal hover:text-sageGreen cursor-pointer transition-colors duration-200" />
              </Link>
              <button onClick={openCart} className="relative">
                <ShoppingBag 
                  className="h-5 w-5 text-charcoal hover:text-sageGreen cursor-pointer transition-colors duration-200"
                />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 bg-terracotta rounded-full flex items-center justify-center text-xs text-white">
                    {getCartCount()}
                  </span>
                )}
              </button>
              <Menu className="h-5 w-5 text-charcoal md:hidden cursor-pointer" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;