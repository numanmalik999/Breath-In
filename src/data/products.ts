export interface Product {
  id: string;
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

export const products: Product[] = [
  {
    id: 'breathin-starter-kit',
    name: 'Breathin Magnetic Nasal Strip Starter Kit',
    price: 29.99,
    originalPrice: 39.99,
    images: [
      'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg',
      'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg',
      'https://images.pexels.com/photos/6692928/pexels-photo-6692928.jpeg',
      'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg'
    ],
    shortDescription: 'Revolutionary magnetic nasal strips for better breathing and sleep',
    description: 'Experience the breakthrough in breathing technology with our Breathin Magnetic Nasal Strip Starter Kit. Unlike traditional adhesive strips that can irritate your skin, our innovative magnetic design gently opens your nasal passages for improved airflow and better sleep quality.',
    features: [
      'Magnetic technology - no adhesives needed',
      'Comfortable for all-night wear',
      'Clinically proven to improve breathing',
      'Reusable and eco-friendly design',
      'Includes magnetic base and 30 strips',
      'Works instantly upon application',
      'Suitable for sensitive skin',
      'Reduces snoring naturally'
    ],
    specifications: {
      'Kit Contents': 'Magnetic base + 30 nasal strips',
      'Material': 'Medical-grade silicone and neodymium magnets',
      'Size': 'One size fits most',
      'Duration': '30-night supply',
      'Warranty': '30-day money-back guarantee'
    },
    inStock: true,
    rating: 4.8,
    reviewCount: 1247
  },
  {
    id: 'breathin-refills',
    name: 'Breathin Refills',
    price: 19.99,
    originalPrice: 24.99,
    images: [
      'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg',
      'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg',
      'https://images.pexels.com/photos/6692928/pexels-photo-6692928.jpeg'
    ],
    shortDescription: 'Refill pack for your Breathin magnetic nasal strips',
    description: 'Keep your breathing improvement journey going with our convenient refill packs. Each pack contains 60 premium nasal strips designed to work perfectly with your existing Breathin magnetic base system.',
    features: [
      '60 high-quality nasal strips',
      'Compatible with Breathin magnetic base',
      'Made from medical-grade materials',
      'Hypoallergenic and skin-safe',
      '2-month supply for nightly use',
      'Individually packaged for freshness',
      'Eco-friendly packaging',
      'Same proven effectiveness as starter kit'
    ],
    specifications: {
      'Pack Contents': '60 nasal strips',
      'Material': 'Medical-grade silicone',
      'Compatibility': 'Breathin Magnetic Base (sold separately)',
      'Duration': '60-night supply',
      'Storage': 'Store in cool, dry place'
    },
    inStock: true,
    rating: 4.9,
    reviewCount: 892
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};