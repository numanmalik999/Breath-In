import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { supabase } from '../integrations/supabase/client';
import { Product, mapProductData } from '../data/products';
import { Search, X, Loader2 } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const SearchModal = () => {
  const { isSearchOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
      setResults([]);
      setNoResults(false);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const performSearch = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setNoResults(false);
        return;
      }

      setLoading(true);
      setNoResults(false);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .or(`name.ilike.%${query.trim()}%,short_description.ilike.%${query.trim()}%`)
        .limit(10);

      if (error) {
        console.error('Error searching products:', error);
        setResults([]);
      } else {
        const mappedData = data.map(mapProductData);
        setResults(mappedData);
        if (mappedData.length === 0) {
          setNoResults(true);
        }
      }
      setLoading(false);
    };

    const debounceSearch = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounceSearch);
  }, [query]);
  
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
  }

  if (!isSearchOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 transition-opacity"
        onClick={closeSearch}
      ></div>
      <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-center">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh]">
          <div className="p-4 border-b">
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-sageGreen"
                autoFocus
              />
              {loading && <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />}
              <button 
                type="button"
                onClick={closeSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </form>
          </div>
          <div className="overflow-y-auto">
            {results.length > 0 && (
              <ul className="divide-y divide-gray-100 p-4">
                {results.map(product => (
                  <li key={product.id}>
                    <Link
                      to={`/product/${product.slug}`}
                      onClick={closeSearch}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                      <div className="flex-1">
                        <p className="font-semibold text-charcoal">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.shortDescription}</p>
                      </div>
                      <p className="font-semibold text-sageGreen">{formatCurrency(product.price)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {noResults && (
              <div className="p-8 text-center text-gray-500">
                <p>No results found for "{query}"</p>
              </div>
            )}
            {!query && (
                 <div className="p-8 text-center text-gray-400">
                    <p>Start typing to search for products.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchModal;