import Link from 'next/link';
import Image from 'next/image';
import { FiHeart, FiShoppingBag, FiEye } from 'react-icons/fi';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { displayTitle } from '@/lib/naming';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const discount = calculateDiscount(product.price, product.salePrice);
  const thumbnail = product.images[0]?.url || '/placeholder-product.jpg';
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock) {
      toast.error('Product is out of stock');
      return;
    }

    addToCart({
      product,
      quantity: 1,
      selectedSize: undefined,
    });
    
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from favorites');
    } else {
      addToWishlist(product.id);
      toast.success('Added to favorites');
    }
  };

  if (compact) {
    return (
      <Link
        href={`/product/${product.id}`}
        className="flex gap-3 p-3 rounded-lg hover:bg-ivory-dark transition-colors"
      >
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={thumbnail}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm line-clamp-2 text-earth-brown">
            {product.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1">{product.category.name}</p>
          <div className="flex items-center gap-2 mt-1">
            {product.salePrice ? (
              <>
                <span className="font-semibold text-saffron text-sm">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-semibold text-earth-brown text-sm">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="card overflow-hidden group animate-fade-in paisley-border">
      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-ivory frame-gold group">
        <Image
          src={thumbnail}
          alt={product.title}
          fill
          className="object-contain bg-neutral-100 group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={100}
          unoptimized
        />
        
        {/* Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2">
          {discount > 0 && (
            <span className="badge bg-turmeric text-white font-semibold px-2 sm:px-3 py-0.5 sm:py-1 shadow-gold text-xs sm:text-sm">
              {discount}% OFF
            </span>
          )}
          {product.featured && (
            <span className="badge-primary text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1">
              Featured
            </span>
          )}
          {product.tags.includes('new-arrival') && (
            <span className="badge bg-forest text-white text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1">
              New
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlistToggle}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-sm transition-colors flex items-center justify-center focus-visible-ring ${
              isWishlisted 
                ? 'bg-terracotta text-white' 
                : 'bg-white hover:bg-terracotta hover:text-white'
            }`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FiHeart className={`w-4 h-4 sm:w-5 sm:h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-sm hover:bg-terracotta hover:text-white transition-colors flex items-center justify-center focus-visible-ring"
            aria-label="Quick view"
          >
            <FiEye className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="badge bg-white text-earth-brown font-semibold px-4 py-2">
              Out of Stock
            </span>
          </div>
        )}
        {/* Hover overlay with name/price */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[#F5F2EC]/85 backdrop-blur-sm p-3">
          <div className="flex items-center justify-between text-[#2A2620]">
            <span className="text-sm font-hind font-medium truncate">{product.title}</span>
            <span className="text-sm font-semibold">{formatPrice(product.salePrice || product.price)}</span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-2 sm:p-4">
        {/* Category */}
        <Link
          href={`/category/${product.category.slug}`}
          className="text-xs text-neutral-500 hover:underline font-medium"
        >
          {product.category.name}
        </Link>

        {/* Title */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-neutral-900 mt-1 hover:text-neutral-600 transition-colors text-sm sm:text-base line-clamp-2">
            {displayTitle(product.title, product.category.slug, product.id)}
          </h3>
        </Link>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 bg-gray-100 text-neutral-700 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-terracotta/15">
          <div>
            {product.salePrice ? (
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-sm sm:text-lg font-bold text-neutral-900">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-sm sm:text-lg font-bold text-neutral-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-md bg-terracotta text-white hover:bg-terracotta-deep transition-colors focus-visible-ring disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!product.inStock}
            aria-label="Add to cart"
          >
            <FiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

