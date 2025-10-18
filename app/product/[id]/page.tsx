'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingBag, FiShare2, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import Lightbox from './Lightbox';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import { ProductDetailSkeleton } from '@/components/SkeletonLoader';
import { api } from '@/lib/api';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { displayTitle } from '@/lib/naming';
import toast from 'react-hot-toast';
import type { Product } from '@/types';
import { useStore } from '@/lib/store';

function deriveSizesFromDimensions(dimensions?: string): string[] {
  if (!dimensions) return [];
  const allowed = ['XS','S','M','L','XL','XXL','XXXL','4XL','5XL'];
  const tokens = dimensions
    .split(/[\s,\/|]+/)
    .map((t) => t.trim().toUpperCase())
    .filter(Boolean);
  const set = new Set<string>();
  for (const size of allowed) {
    if (tokens.includes(size)) set.add(size);
  }
  return Array.from(set);
}

function getAvailableSizes(p?: Product | null): string[] {
  if (!p) return [];
  if (p.sizes && p.sizes.length > 0) return p.sizes;
  return deriveSizesFromDimensions(p.dimensions);
}

function sanitizeDescription(html: string, isHandicrafts: boolean): string {
  if (!html) return html;
  if (!isHandicrafts) return html;
  let out = html;
  // Remove "Available in ..." phrases
  out = out.replace(/Available in[^<\n]*/gi, '');
  // Remove common size listings
  out = out.replace(/\b(XS|S|M|L|XL|XXL|XXXL|4XL|5XL)(\s*,\s*(XS|S|M|L|XL|XXL|XXXL|4XL|5XL))+\b/gi, '');
  return out;
}

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const router = useRouter();

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const productData = await api.getProduct(params.id);
      setProduct(productData);
      const sizes = getAvailableSizes(productData);
      setSelectedSize(sizes.length > 0 ? sizes[0] : undefined);
      
      if (productData.category) {
        const response = await api.getProducts(
          { category: productData.category.slug },
          1,
          4
        );
        setRelatedProducts(response.products.filter(p => p.id !== productData.id));
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      router.push('/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const sizes = getAvailableSizes(product);
    const isHandicrafts = product.category?.slug === 'handicrafts';
    if (!isHandicrafts && sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart({ product, quantity, selectedSize });
    toast.success(`Added ${product.title}${selectedSize ? ` (${selectedSize})` : ''} to cart!`);
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist!');
    } else {
      addToWishlist(product.id);
      toast.success('Added to wishlist!');
    }
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.title,
          text: product.shortDescription || product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory py-8">
        <div className="container-custom">
          <ProductDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const discount = calculateDiscount(product.price, product.salePrice);
  const currentPrice = product.salePrice || product.price;
  const isHandicrafts = product.category.slug === 'handicrafts';
  const availableSizes = isHandicrafts ? [] : getAvailableSizes(product);
  const descriptionHtml = sanitizeDescription(product.description, isHandicrafts);

  return (
    <>
    <div className="min-h-screen bg-[#f6f1e7] animate-fade-in">
      <div className="container-custom py-8">
        <Breadcrumbs
          items={[
            { label: 'Products', href: '/products' },
            { label: product.category.name, href: `/category/${product.category.slug}` },
            { label: product.title },
          ]}
        />

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
              <Image
                src={product.images[selectedImage]?.url || '/placeholder-product.jpg'}
                alt={product.images[selectedImage]?.alt || product.title}
                fill
                className="object-contain bg-white"
                quality={100}
                unoptimized
                priority
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 badge bg-marigold text-white font-semibold px-4 py-2">
                  {discount}% OFF
                </div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="badge bg-white text-earth-brown font-semibold px-6 py-3 text-lg">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden bg-white transition-all ${
                      selectedImage === index
                        ? 'ring-2 ring-saffron'
                        : 'hover:ring-2 hover:ring-gray-300'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-contain bg-white"
                      quality={100}
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <Link
              href={`/category/${product.category.slug}`}
              className="inline-block text-peacock hover:underline font-medium"
            >
              {product.category.name}
            </Link>

            {/* Title */}
            <h1 className="text-4xl font-bold font-lora text-earth-brown">
              {displayTitle(product.title, product.category.slug, product.id)}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-saffron">
                {formatPrice(currentPrice)}
              </span>
              {product.salePrice && (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="badge bg-marigold text-white">
                    Save {formatPrice(product.price - product.salePrice)}
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-lg text-earth-brown/80">
                {product.shortDescription}
              </p>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge-primary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Size Selector */}
            {availableSizes.length > 0 && (
              <div className="space-y-2">
                <div className="font-medium text-earth-brown">Size:</div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 rounded border text-sm ${
                        selectedSize === size
                          ? 'border-saffron bg-saffron/10 text-earth-brown font-semibold'
                          : 'border-gray-300 hover:border-saffron'
                      }`}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              {/* Quantity */}
              {product.inStock && (
                <div className="flex items-center gap-4">
                  <label className="font-medium text-earth-brown">Quantity:</label>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-ivory-dark transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-x-2 border-gray-200 py-2 focus:outline-none"
                      min="1"
                      max={product.stock}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 hover:bg-ivory-dark transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-earth-brown/60">
                    {product.stock} available
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || (availableSizes.length > 0 && !selectedSize)}
                  className="btn-primary flex-1"
                >
                  <FiShoppingBag className="mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className={`btn-outline px-4 ${
                    product && isInWishlist(product.id) 
                      ? 'bg-terracotta text-white border-terracotta' 
                      : ''
                  }`}
                  aria-label={product && isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <FiHeart className={`w-5 h-5 ${product && isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="btn-outline px-4"
                  aria-label="Share product"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <FiTruck className="w-5 h-5 text-saffron flex-shrink-0 mt-1" />
                <div>
                  <div className="font-medium text-sm">Free Shipping</div>
                  <div className="text-xs text-earth-brown/60">Orders above ₹999</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiShield className="w-5 h-5 text-peacock flex-shrink-0 mt-1" />
                <div>
                  <div className="font-medium text-sm">Secure Payment</div>
                  <div className="text-xs text-earth-brown/60">100% protected</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiRefreshCw className="w-5 h-5 text-earth-green flex-shrink-0 mt-1" />
                <div>
                  <div className="font-medium text-sm">Easy Returns</div>
                  <div className="text-xs text-earth-brown/60">7-day return policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="card p-8 mb-16">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold font-lora text-earth-brown mb-4">
              Product Description
            </h2>
            <div
              className="text-earth-brown/80"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />

            {product.materials && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-earth-brown mb-2">Materials</h3>
                <p className="text-earth-brown/80">{product.materials}</p>
              </div>
            )}

            {product.dimensions && !isHandicrafts && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-earth-brown mb-2">Dimensions</h3>
                <p className="text-earth-brown/80">{product.dimensions}</p>
              </div>
            )}

            {product.careInstructions && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-earth-brown mb-2">Care Instructions</h3>
                <p className="text-earth-brown/80">{product.careInstructions}</p>
              </div>
            )}

            {product.artisanNote && (
              <div className="mt-6 p-6 bg-ivory-dark rounded-xl border-l-4 border-saffron">
                <h3 className="text-xl font-semibold text-earth-brown mb-2">From the Artisan</h3>
                <p className="text-earth-brown/80 italic">{product.artisanNote}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold font-lora text-earth-brown mb-8">
              You May Also Like
            </h2>
            <div className="relative">
              {/* Scrollable container */}
              <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {relatedProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className={`flex-shrink-0 snap-start ${
                      index === 0 ? 'w-72 sm:w-80' : 'w-64 sm:w-72'
                    }`}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              {/* Gradient fade indicators */}
              <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-ivory via-ivory/80 to-transparent pointer-events-none z-10"></div>
              <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-ivory via-ivory/80 to-transparent pointer-events-none z-10"></div>
            </div>
          </section>
        )}
      </div>
    </div>

    {/* Lightbox */}
    {isLightboxOpen && (
      <Lightbox
        images={product.images.map(i => ({ url: i.url, alt: i.alt }))}
        index={selectedImage}
        onClose={() => setIsLightboxOpen(false)}
      />
    )}
    </>
  );
}


