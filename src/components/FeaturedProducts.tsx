import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductVideo from './ProductVideo';
import { getProducts } from '../data/products';
import type { Product } from '../data/products';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-4">
          Breathin Products
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Revolutionary magnetic nasal strips designed to improve your breathing and enhance your sleep quality naturally.
        </p>
      </div>
      
      <ProductVideo />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
        {products.map((product) => (
          <ProductCard key={product.id} product={{
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            description: product.shortDescription
          }} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;