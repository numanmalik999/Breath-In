import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { UploadCloud, Trash2, Save, ArrowLeft } from 'lucide-react';
import ReactQuill from 'react-quill';
import { supabase } from '../../integrations/supabase/client';
import { Product, Category, getCategories, getProductBySlug } from '../../data/products';

const ProductFormPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEditMode = !!slug;

  const [formData, setFormData] = useState<Omit<Product, 'id' | 'slug' | 'rating' | 'reviewCount' | 'category'>>({
    name: '',
    price: 0,
    originalPrice: 0,
    images: [],
    shortDescription: '',
    description: '',
    features: [],
    specifications: {},
    inStock: true,
    is_published: true,
    categoryId: null,
  });
  const [description, setDescription] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const categoryData = await getCategories();
      setCategories(categoryData);

      if (isEditMode && slug) {
        const productData = await getProductBySlug(slug, true);
        if (productData) {
          setFormData(productData);
          setDescription(productData.description);
          setCategoryName(productData.category?.name || '');
        } else {
          // Handle product not found
          navigate('/admin');
        }
      }
      setIsLoading(false);
    };
    fetchInitialData();
  }, [slug, isEditMode, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };

  const handleFeatureChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, features: e.target.value.split('\n') }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedImageUrls: string[] = [];
    for (const file of Array.from(files)) {
      const fileName = `public/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from('product-images').upload(fileName, file);
      if (error) {
        console.error('Error uploading image:', error);
        continue;
      }
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(data.path);
      if (publicUrl) uploadedImageUrls.push(publicUrl);
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedImageUrls] }));
    setIsUploading(false);
  };

  const removeImage = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter(url => url !== imageUrl) }));
  };

  const handleCategory = async (categoryName?: string): Promise<string | null> => {
    if (!categoryName || categoryName.trim() === '') return null;
    const trimmedName = categoryName.trim();
    const slug = trimmedName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    let { data: existingCategory } = await supabase.from('categories').select('id').eq('name', trimmedName).single();
    if (existingCategory) return existingCategory.id;
    const { data: newCategory, error } = await supabase.from('categories').insert({ name: trimmedName, slug }).select('id').single();
    if (error) {
      console.error('Error creating category:', error);
      return null;
    }
    return newCategory.id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const categoryId = await handleCategory(categoryName);
    const newSlug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const productPayload = {
      name: formData.name,
      slug: newSlug,
      price: Number(formData.price),
      original_price: Number(formData.originalPrice) || null,
      images: formData.images,
      short_description: formData.shortDescription,
      description: description,
      features: formData.features,
      specifications: formData.specifications,
      in_stock: formData.inStock,
      is_published: formData.is_published,
      category_id: categoryId,
    };

    if (isEditMode && slug) {
      const { error } = await supabase.from('products').update(productPayload).eq('slug', slug);
      if (error) console.error('Error updating product:', error);
    } else {
      const { error } = await supabase.from('products').insert({ ...productPayload, review_count: 0, rating: 0 });
      if (error) console.error('Error adding product:', error);
    }

    setIsSaving(false);
    navigate('/admin'); // Navigate back to the dashboard
  };

  if (isLoading) {
    return <div className="p-6">Loading product form...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/admin" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
              
              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-sageGreen hover:text-opacity-80">
                        <span>Upload files</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleImageUpload} />
                      </label>
                    </div>
                  </div>
                </div>
                {isUploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {formData.images.map((url) => (
                    <div key={url} className="relative group">
                      <img src={url} alt="Product preview" className="h-24 w-full object-cover rounded-md" />
                      <button type="button" onClick={() => removeImage(url)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Name & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" list="categories" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  <datalist id="categories">{categories.map(cat => <option key={cat.id} value={cat.name} />)}</datalist>
                </div>
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (Optional)</label>
                  <input type="number" name="originalPrice" value={formData.originalPrice || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                <div className="h-48">
                  <ReactQuill theme="snow" value={description} onChange={setDescription} className="h-full" />
                </div>
              </div>

              {/* Features & Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                <textarea name="features" rows={4} value={formData.features.join('\n')} onChange={handleFeatureChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input id="inStock" type="checkbox" name="inStock" checked={formData.inStock} onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))} className="h-4 w-4 text-sageGreen border-gray-300 rounded" />
                  <label htmlFor="inStock" className="ml-2 block text-sm text-gray-900">In Stock</label>
                </div>
                <div className="flex items-center">
                  <input id="is_published" type="checkbox" name="is_published" checked={formData.is_published} onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))} className="h-4 w-4 text-sageGreen border-gray-300 rounded" />
                  <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">Published</label>
                </div>
              </div>
            </div>
            <div className="p-4 flex justify-end space-x-2 border-t bg-gray-50 rounded-b-lg">
              <Link to="/admin" className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100">Cancel</Link>
              <button type="submit" disabled={isSaving} className="px-4 py-2 bg-sageGreen text-white rounded-lg text-sm font-medium hover:bg-opacity-90 flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Saving...' : 'Save Product'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductFormPage;