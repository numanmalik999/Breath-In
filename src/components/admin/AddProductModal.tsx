import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Product } from '../../data/products';

interface AddProductModalProps {
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onAddProduct }) => {
  const [newProduct, setNewProduct] = useState({
    id: `new-product-${Date.now()}`,
    name: '',
    price: 0,
    originalPrice: 0,
    images: ['https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg'], // Placeholder image
    shortDescription: '',
    description: '',
    features: [],
    specifications: {},
    inStock: true,
    rating: 0,
    reviewCount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewProduct(prev => ({ ...prev, features: e.target.value.split('\n') }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct({
      ...newProduct,
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice) || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Add New Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (Optional)</label>
              <input
                type="number"
                name="originalPrice"
                value={newProduct.originalPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <input
              type="text"
              name="shortDescription"
              value={newProduct.shortDescription}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
            <textarea
              name="description"
              rows={3}
              value={newProduct.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
            <textarea
              name="features"
              rows={4}
              value={newProduct.features.join('\n')}
              onChange={handleFeatureChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="inStock"
              checked={newProduct.inStock}
              onChange={(e) => setNewProduct(prev => ({ ...prev, inStock: e.target.checked }))}
              className="h-4 w-4 text-sageGreen border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">In Stock</label>
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-sageGreen text-white rounded-lg text-sm font-medium hover:bg-opacity-90">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;