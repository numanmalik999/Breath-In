import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../data/products';
import type { Product } from '../data/products';

const ShopPage = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('Our Collection');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProducts(categorySlug);
      setProducts(data);
      if (categorySlug && data.length > 0 && data[0].category) {
        setCategoryName(data[0].category.name);
      } else if (!categorySlug) {
        setCategoryName('Our Collection');
      } else {
        setCategoryName('Products');
      }
      setLoading(false);
    };
    fetchProducts();
  }, [categorySlug]);

  return (
    <div className="bg-warmBeige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-charcoal mb-4">{categoryName}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our range of products designed to help you breathe better and live well.
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images[0],
                description: product.shortDescription
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;