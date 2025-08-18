import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <Link to={`/product/${product.slug}`} className="block h-full">
      <div 
        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 right-4">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-warmBeige transition-colors duration-200">
              <Heart className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-300">
              <button 
                onClick={handleAddToCart}
                className="bg-sageGreen text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="p-6 flex-grow flex flex-col">
          <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 flex-grow">
            {product.description}
          </p>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-xl font-bold text-sageGreen">
              {formatCurrency(product.price)}
            </span>
            <button 
              onClick={handleAddToCart}
              className="text-dustyBlue hover:text-sageGreen transition-colors duration-200 md:opacity-0 group-hover:opacity-100"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;