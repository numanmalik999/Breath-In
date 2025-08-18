import React, { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import { supabase } from '../../integrations/supabase/client';
import { Product, Category, getCategories } from '../../data/products';

type NewProductData = Omit<Product, 'id' | 'rating' | 'reviewCount' | 'slug' | 'category'>;

interface AddProductModalProps {
  onClose: () => void;
  onAddProduct: (product: NewProductData, categoryName?: string) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onAddProduct }) => {
  const [newProduct, setNewProduct] = useState<Omit<NewProductData, 'description' | 'categoryId'>>({
    name: '',
    price: 0,
    originalPrice: 0,
    images: [],
    shortDescription: '',
    features: [] as string[],
    specifications: {},
    inStock: true,
  });
  const [description, setDescription] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewProduct(prev => ({ ...prev, features: e.target.value.split('\n') }));
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setNewProduct(prev => ({ ...prev, images: [...prev.images, ...uploadedImageUrls] }));
    setIsUploading(false);
  };

  const removeMainImage = (imageUrl: string) => {
    setNewProduct(prev => ({ ...prev, images: prev.images.filter(url => url !== imageUrl) }));
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (!input.files) return;
      const file = input.files[0];
      const fileName = `description/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from('product-images').upload(fileName, file);
      if (error) {
        console.error('Error uploading description image:', error);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(data.path);
      if (publicUrl) {
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', publicUrl);
        }
      }
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct({
      ...newProduct,
      description,
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice) || undefined,
    }, categoryName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Add New Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-sageGreen hover:text-opacity-80 focus-within:outline-none">
                    <span>Upload files</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleMainImageUpload} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            {isUploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
            <div className="mt-4 grid grid-cols-4 gap-4">
              {newProduct.images.map((url) => (
                <div key={url} className="relative group">
                  <img src={url} alt="Product preview" className="h-24 w-full object-cover rounded-md" />
                  <button type="button" onClick={() => removeMainImage(url)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input type="text" name="name" value={newProduct.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input type="text" list="categories" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., Starter Kits" />
              <datalist id="categories">
                {categories.map(cat => <option key={cat.id} value={cat.name} />)}
              </datalist>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input type="number" name="price" value={newProduct.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (Optional)</label>
              <input type="number" name="originalPrice" value={newProduct.originalPrice || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <input type="text" name="shortDescription" value={newProduct.shortDescription} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
            <div className="h-48">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={description}
                onChange={setDescription}
                modules={{ toolbar: { container: [['bold', 'italic'], ['link', 'image']], handlers: { image: imageHandler } } }}
                className="h-full"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
            <textarea name="features" rows={4} value={newProduct.features.join('\n')} onChange={handleFeatureChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="inStock" checked={newProduct.inStock} onChange={(e) => setNewProduct(prev => ({ ...prev, inStock: e.target.checked }))} className="h-4 w-4 text-sageGreen border-gray-300 rounded" />
            <label className="ml-2 block text-sm text-gray-900">In Stock</label>
          </div>
          <div className="pt-4 flex justify-end space-x-2 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-sageGreen text-white rounded-lg text-sm font-medium hover:bg-opacity-90">Add Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;