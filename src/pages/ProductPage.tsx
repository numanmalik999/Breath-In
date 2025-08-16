import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductBySlug } from '../data/products';
import type { Product } from '../data/products';
import { ShoppingCart, CheckCircle, Star } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
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

  if (loading) {
    return <div className="text-center py-20">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center py-20">Product not found.</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="grid md:grid-cols-2 gap-12">
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
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${selectedImage === img ? 'border-sageGreen' : 'border-transparent'}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
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
          <div className="space-y-4">
            <button onClick={handleAddToCart} className="w-full bg-sageGreen text-white py-4 rounded-lg font-medium hover:bg-opacity-90 flex items-center justify-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
            <div className="text-sm text-center text-gray-600">
              {product.inStock ? (
                <span className="flex items-center justify-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" /> In Stock & Ready to Ship</span>
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </div>
          </div>
          
          {/* Description & Features */}
          <div className="space-y-6 pt-6 border-t">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">Description</h3>
              <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;