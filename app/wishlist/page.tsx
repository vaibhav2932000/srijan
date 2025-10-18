'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { api } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';
import type { Product } from '@/types';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const productPromises = wishlist.map(item => 
          api.getProduct(item.productId).catch(() => null)
        );
        const results = await Promise.all(productPromises);
        const validProducts = results.filter((product): product is Product => product !== null);
        setProducts(validProducts);
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      product,
      quantity: 1,
      selectedSize: undefined,
    });
  };

  if (loading) {
    return (
      <div className="container-custom py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="aspect-[4/5] bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <span className="text-gray-600">
            {products.length} {products.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FiHeart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding items you love to your wishlist by clicking the heart icon on any product.
            </p>
            <Link
              href="/products"
              className="btn-primary inline-flex items-center gap-2"
            >
              <FiShoppingBag className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow-sm hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center focus-visible-ring z-10"
                    aria-label="Remove from wishlist"
                  >
                    <FiHeart className="w-5 h-5 fill-current text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/products"
                className="btn-outline inline-flex items-center gap-2"
              >
                <FiShoppingBag className="w-5 h-5" />
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


