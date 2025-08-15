import { supabase } from '../integrations/supabase/client';

export interface Product {
  id: string; // Corresponds to 'slug' in the database
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
  rating: number;
  reviewCount: number;
}

// Helper to map database product to frontend product
const mapProductData = (data: any): Product => ({
  id: data.slug,
  name: data.name,
  price: data.price,
  originalPrice: data.original_price,
  images: data.images,
  shortDescription: data.short_description,
  description: data.description,
  features: data.features,
  specifications: data.specifications,
  inStock: data.in_stock,
  rating: data.rating,
  reviewCount: data.review_count,
});

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data.map(mapProductData);
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', id)
    .single();

  if (error) {
    // It's normal for single() to return an error if no row is found
    if (error.code !== 'PGRST116') {
      console.error(`Error fetching product with id ${id}:`, error);
    }
    return null;
  }

  return data ? mapProductData(data) : null;
};