'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiX } from 'react-icons/fi';
import { api } from '@/lib/api';
import { debounce } from '@/lib/utils';
import type { Product } from '@/types';
import ProductCard from './ProductCard';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const searchProducts = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const products = await api.searchProducts(searchQuery);
      setResults(products);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useRef(
    debounce((query: string) => searchProducts(query), 300)
  ).current;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="container-custom pt-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl animate-slide-down">
          {/* Search Input */}
          <form onSubmit={handleSubmit} className="p-6 border-b border-gray-200">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for handicrafts, clothing, jewelry..."
                className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20"
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-earth-brown transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </form>

          {/* Search Results */}
          <div className="max-h-[60vh] overflow-y-auto scrollbar-thin p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-gray-500">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Found {results.length} {results.length === 1 ? 'result' : 'results'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.map((product) => (
                    <div key={product.id} onClick={onClose}>
                      <ProductCard product={product} compact />
                    </div>
                  ))}
                </div>
              </div>
            ) : query.trim() ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-500">
                  Try searching with different keywords or browse our categories
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-2">Start searching</h3>
                <p className="text-gray-500">
                  Discover handcrafted treasures from across India
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

