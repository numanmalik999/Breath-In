import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Star, Package } from 'lucide-react';
import { getProducts, Product } from '../../data/products';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import { supabase } from '../../integrations/supabase/client';

type NewProductData = Omit<Product, 'id' | 'slug' | 'rating' | 'reviewCount'>;

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productList, setProductList] = useState<Product[]>([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const products = await getProducts();
    setProductList(products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (productData: NewProductData) => {
    const slug = productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const { error } = await supabase.from('products').insert([{ ...productData, slug, original_price: productData.originalPrice, short_description: productData.shortDescription, in_stock: productData.inStock, review_count: 0, rating: 0 }]);
    if (error) console.error('Error adding product:', error);
    else {
      await fetchProducts();
      setShowAddModal(false);
    }
  };

  const handleUpdateProduct = async (productData: Product) => {
    const { error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        price: productData.price,
        original_price: productData.originalPrice,
        short_description: productData.shortDescription,
        description: productData.description,
        features: productData.features,
        in_stock: productData.inStock,
        images: productData.images,
      })
      .eq('id', productData.id);

    if (error) {
      console.error('Error updating product:', error);
    } else {
      await fetchProducts();
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) console.error('Error deleting product:', error);
      else await fetchProducts();
    }
  };

  const filteredProducts = productList.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-sageGreen text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-200 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen focus:border-transparent" />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">Filter</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Products ({filteredProducts.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviews</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.shortDescription}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${product.price}</div>
                    {product.originalPrice && <div className="text-sm text-gray-500 line-through">${product.originalPrice}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-900">{product.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.reviewCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => navigate(`/product/${product.slug}`)} className="text-gray-600 hover:text-sageGreen transition-colors duration-200"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => setEditingProduct(product)} className="text-gray-600 hover:text-sageGreen transition-colors duration-200"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDeleteProduct(product.id, product.name)} className="text-gray-600 hover:text-red-600 transition-colors duration-200"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-sageGreen" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{productList.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{productList.length > 0 ? (productList.reduce((acc, p) => acc + p.rating, 0) / productList.length).toFixed(1) : 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{productList.reduce((acc, p) => acc + p.reviewCount, 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onAddProduct={handleAddProduct} />}
      {editingProduct && <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSave={handleUpdateProduct} />}
    </div>
  );
};

export default ProductManagement;