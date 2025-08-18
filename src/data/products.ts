import { supabase } from '../integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string; // This is the UUID from the database
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  shortDescription: string;
  description: string;
  features: string[];
  specifications: {
    [key: string]: string;
  };
  inStock: boolean;
  is_published: boolean;
  rating: number;
  reviewCount: number;
  category?: {
    name: string;
    slug: string;
  };
  categoryId?: string | null;
}

// Helper to map database product to frontend product
export const mapProductData = (data: any): Product => ({
  id: data.id,
  slug: data.slug,
  name: data.name,
  price: data.price,
  originalPrice: data.original_price,
  images: data.images,
  shortDescription: data.short_description,
  description: data.description,
  features: data.features,
  specifications: data.specifications,
  inStock: data.in_stock,
  is_published: data.is_published,
  rating: data.rating,
  reviewCount: data.review_count,
  category: data.categories ? { name: data.categories.name, slug: data.categories.slug } : undefined,
  categoryId: data.category_id,
});

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data;
};

export const getProducts = async (categorySlug?: string, includeUnpublished = false): Promise<Product[]> => {
  let query = supabase.from('products').select('*, categories(name, slug)');

  if (!includeUnpublished) {
    query = query.eq('is_published', true);
  }

  if (categorySlug) {
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (categoryError || !categoryData) {
      console.error(`Category with slug ${categorySlug} not found:`, categoryError);
      return [];
    }
    query = query.eq('category_id', categoryData.id);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data.map(mapProductData);
};

export const getProductBySlug = async (slug: string, includeUnpublished = false): Promise<Product | null> => {
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug);

  if (!includeUnpublished) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query.single();

  if (error) {
    if (error.code !== 'PGRST116') { // Ignore 'not found' errors
      console.error(`Error fetching product with slug ${slug}:`, error);
    }
    return null;
  }

  return data ? mapProductData(data) : null;
};