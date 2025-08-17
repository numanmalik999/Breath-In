import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductBySlug } from '../data/products';
import type { Product } from '../data/products';
import { ShoppingCart, CheckCircle, Star, Minus, Plus, Shield, Truck, RotateCcw } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { useCart } from '../context/CartContext';
import FaqAccordion from '../components/FaqAccordion';

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      const data = await getProductBySlug(slug);
      setProduct(data);
      if (data && data.images.length > 0) {
        setSelectedImage(data.images[0]);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
    });
    navigate('/checkout');
  };

  if (loading) {
    return <div className="text-center py-20">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center py-20">Product not found.</div>;
  }

  return (
    <div className="bg-warmBeige py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl grid md:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div>
            <div className="mb-4">
              <img src={selectedImage} alt={product.name} className="w-full h-auto object-cover rounded-2xl shadow-lg" />
            </div>
            <div className="flex space-x-2">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 ${selectedImage === img ? 'border-sageGreen' : 'border-transparent hover:border-gray-300'}`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {product.category && (
              <Link to={`/shop/${product.category.slug}`} className="text-sm font-medium text-sageGreen hover:underline">{product.category.name}</Link>
            )}
            <h1 className="text-4xl font-serif text-charcoal">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(Math.round(product.rating))].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                {[...Array(5 - Math.round(product.rating))].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-gray-300" />
                ))}
              </div>
              <span className="text-gray-600">{product.reviewCount} reviews</span>
            </div>
            <p className="text-lg text-gray-700">{product.shortDescription}</p>
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-sageGreen">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-gray-100 rounded-l-lg"><Minus className="h-4 w-4" /></button>
                <span className="px-6 py-2 border-x border-gray-300 font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 hover:bg-gray-100 rounded-r-lg"><Plus className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={handleBuyNow} className="w-full bg-sageGreen text-white py-4 rounded-lg font-medium hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2">
                <span>Buy Now</span>
              </button>
              <button onClick={handleAddToCart} className="w-full bg-dustyBlue text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>
            
            <div className="flex items-center justify-center text-sm text-gray-600">
              {product.inStock ? (
                <span className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" /> In Stock & Ready to Ship</span>
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t">
              <div className="text-xs text-gray-600 flex flex-col items-center space-y-1">
                <Shield className="h-5 w-5 text-sageGreen" />
                <span>Secure Checkout</span>
              </div>
              <div className="text-xs text-gray-600 flex flex-col items-center space-y-1">
                <Truck className="h-5 w-5 text-sageGreen" />
                <span>Free Shipping Over Rs 2500</span>
              </div>
              <div className="text-xs text-gray-600 flex flex-col items-center space-y-1">
                <RotateCcw className="h-5 w-5 text-sageGreen" />
                <span>30-Day Returns</span>
              </div>
            </div>
            
            <div className="space-y-2 pt-6">
              <FaqAccordion title="Description">
                <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: product.description }} />
              </FaqAccordion>
              <FaqAccordion title="Features">
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </FaqAccordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;