import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProductBySlug } from '../data/products';
import type { Product } from '../data/products';
import { ShoppingCart, CheckCircle, Star, Minus, Plus, Shield, Truck, RotateCcw } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import SocialShare from '../components/SocialShare';

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();
  const { settings } = useSettings();

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

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
    });
  };

  const handleBuyNow = async () => {
    if (!product) return;
    await addToCart({
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
    <>
      <Helmet>
        <title>{`${product.name} - Breathin`}</title>
        <meta name="description" content={product.shortDescription} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.shortDescription} />
        <meta property="og:image" content={product.images[0]} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="bg-warmBeige py-12">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
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

              <div className="pt-4 border-t space-y-4">
                <SocialShare url={window.location.href} title={product.name} />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="text-xs text-gray-600 flex flex-col items-center space-y-1">
                    <Shield className="h-5 w-5 text-sageGreen" />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="text-xs text-gray-600 flex flex-col items-center space-y-1">
                    <Truck className="h-5 w-5 text-sageGreen" />
                    <span>Free Shipping Over Rs {settings?.shipping_free_threshold || 1499}</span>
                  </div>
                  <div className="text-xs text-gray-600 flex flex-col items-center space-y-1">
                    <RotateCcw className="h-5 w-5 text-sageGreen" />
                    <span>30-Day Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex border-b mb-4">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-2 font-medium transition-colors duration-200 ${
                  activeTab === 'description'
                    ? 'border-b-2 border-sageGreen text-sageGreen'
                    : 'text-gray-500 hover:text-charcoal'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`px-6 py-2 font-medium transition-colors duration-200 ${
                  activeTab === 'features'
                    ? 'border-b-2 border-sageGreen text-sageGreen'
                    : 'text-gray-500 hover:text-charcoal'
                }`}
              >
                Features
              </button>
            </div>
            <div>
              {activeTab === 'description' && (
                <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: product.description }} />
              )}
              {activeTab === 'features' && (
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;