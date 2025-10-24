'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { PRICE_RANGES, FEATURED_TAGS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import type { Category, ProductFilters } from '@/types';

interface FiltersSidebarProps {
  categories: Category[];
  onFilterChange?: (filters: ProductFilters) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function FiltersSidebar({
  categories,
  onFilterChange,
  isMobile = false,
  onClose,
}: FiltersSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    subcategory: true,
    price: true,
    tags: true,
    stock: true,
  });

  const [selectedFilters, setSelectedFilters] = useState<ProductFilters>({
    category: searchParams.get('category') || undefined,
    subcategory: searchParams.get('subcategory') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    tags: searchParams.get('tags')?.split(',') || [],
    inStock: searchParams.get('inStock') === 'true' || undefined,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    const updated = { ...selectedFilters, ...newFilters };
    setSelectedFilters(updated);
    
    if (onFilterChange) {
      onFilterChange(updated);
    }

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updated).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else {
        params.set(key, String(value));
      }
    });
    
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (categorySlug: string) => {
    updateFilters({
      category: categorySlug === selectedFilters.category ? undefined : categorySlug,
      subcategory: undefined,
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    updateFilters({ minPrice: min, maxPrice: max === Infinity ? undefined : max });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = selectedFilters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    updateFilters({ tags: newTags });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
    router.push(window.location.pathname);
  };

  const hasActiveFilters =
    selectedFilters.category ||
    selectedFilters.minPrice ||
    selectedFilters.maxPrice ||
    (selectedFilters.tags && selectedFilters.tags.length > 0) ||
    selectedFilters.inStock;

  const FilterSection = ({
    title,
    section,
    children,
  }: {
    title: string;
    section: keyof typeof expandedSections;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between py-4 text-left focus-visible-ring"
      >
        <span className="font-semibold text-earth-brown">{title}</span>
        {expandedSections[section] ? (
          <FiChevronUp className="w-5 h-5" />
        ) : (
          <FiChevronDown className="w-5 h-5" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="pb-4 space-y-3">{children}</div>
      )}
    </div>
  );

  const content = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-earth-brown">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-saffron hover:text-saffron-dark font-medium"
            >
              Clear All
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-2 text-earth-brown hover:text-saffron transition-colors"
              aria-label="Close filters"
            >
              <FiX className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <FilterSection title="Category" section="category">
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                checked={selectedFilters.category === category.slug}
                onChange={() => handleCategoryChange(category.slug)}
                className="w-4 h-4 text-saffron focus:ring-saffron border-gray-300"
              />
              <span className="text-sm text-earth-brown group-hover:text-saffron transition-colors">
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Subcategories - only show for handicrafts */}
      {selectedFilters.category === 'handicrafts' && (
        <FilterSection title="Subcategory" section="subcategory">
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="subcategory"
                checked={!selectedFilters.subcategory}
                onChange={() => updateFilters({ subcategory: undefined })}
                className="w-4 h-4 text-saffron focus:ring-saffron border-gray-300"
              />
              <span className="text-sm text-earth-brown group-hover:text-saffron transition-colors">
                All Handicrafts
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="subcategory"
                checked={selectedFilters.subcategory === '5-piece-wall-painting'}
                onChange={() => updateFilters({ subcategory: '5-piece-wall-painting' })}
                className="w-4 h-4 text-saffron focus:ring-saffron border-gray-300"
              />
              <span className="text-sm text-earth-brown group-hover:text-saffron transition-colors">
                5 Piece Wall Painting
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="subcategory"
                checked={selectedFilters.subcategory === 'pichwai-round-wall-hanging'}
                onChange={() => updateFilters({ subcategory: 'pichwai-round-wall-hanging' })}
                className="w-4 h-4 text-saffron focus:ring-saffron border-gray-300"
              />
              <span className="text-sm text-earth-brown group-hover:text-saffron transition-colors">
                Pichwai Round Wall Hanging
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="subcategory"
                checked={selectedFilters.subcategory === 'tea-coaster'}
                onChange={() => updateFilters({ subcategory: 'tea-coaster' })}
                className="w-4 h-4 text-saffron focus:ring-saffron border-gray-300"
              />
              <span className="text-sm text-earth-brown group-hover:text-saffron transition-colors">
                Tea Coaster
              </span>
            </label>
          </div>
        </FilterSection>
      )}

      {/* Subcategories - only show for clothing */}
      {selectedFilters.category === 'clothing' && (
        <FilterSection title="Subcategory" section="subcategory">
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="subcategory"
                checked={!selectedFilters.subcategory}
                onChange={() => updateFilters({ subcategory: undefined })}
                className="w-4 h-4 text-saffron focus:ring-saffron border-gray-300"
              />
              <span className="text-sm text-earth-brown group-hover:text-saffron transition-colors">
                All Clothing
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="subcategory"
                checked={selectedFilters.subcategory === '2-piece-dress-set'}
                onChange={() => updateFilters({ subcategory: '2-piece-dress-set' })}
                className="w-4 h-4 text-saffron focus:ring-saffron border-gray-300"
              />
              <span className="text-sm text-earth-brown group-hover:text-saffron transition-colors">
                2 Piece Dress Set
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="subcategory"
                checked={selectedFilters.subcategory === '3-piece-dress-set'}
                onChange={() => updateFilters({ subcategory: '3-piece-dress-set' })}
                className="w-4 h-4 text-saffron focus:ring-saffron border-gray-300"
              />
              <span className="text-sm text-earth-brown group-hover:text-saffron transition-colors">
                3 Piece Dress Set
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="subcategory"
                checked={selectedFilters.subcategory === 'aawari-kurti-collection'}
                onChange={() => updateFilters({ subcategory: 'aawari-kurti-collection' })}
                className="w-4 h-4 text-saffron focus:ring-saffron border-gray-300"
              />
              <span className="text-sm text-earth-brown group-hover:text-saffron transition-colors">
                Aawari Kurti Collection
              </span>
            </label>
          </div>
        </FilterSection>
      )}

      {/* Price Range */}
      <FilterSection title="Price Range" section="price">
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => {
            const isSelected =
              selectedFilters.minPrice === range.min &&
              (selectedFilters.maxPrice === range.max ||
                (range.max === Infinity && !selectedFilters.maxPrice));

            return (
              <label
                key={range.label}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="price"
                  checked={isSelected}
                  onChange={() => handlePriceRangeChange(range.min, range.max)}
                  className="w-4 h-4 text-saffron focus:ring-saffron border-gray-300"
                />
                <span className="text-sm text-earth-brown group-hover:text-saffron transition-colors">
                  {range.label}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Tags */}
      <FilterSection title="Tags" section="tags">
        <div className="flex flex-wrap gap-2">
          {FEATURED_TAGS.map((tag) => {
            const isSelected = selectedFilters.tags?.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-saffron text-white'
                    : 'bg-ivory-dark text-earth-brown hover:bg-saffron/10'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" section="stock">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={selectedFilters.inStock === true}
            onChange={(e) => updateFilters({ inStock: e.target.checked || undefined })}
            className="w-4 h-4 text-saffron focus:ring-saffron border-gray-300 rounded"
          />
          <span className="text-sm text-earth-brown group-hover:text-saffron transition-colors">
            In Stock Only
          </span>
        </label>
      </FilterSection>
    </>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <div
          className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto animate-slide-right"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">{content}</div>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="card p-6 sticky top-24">{content}</div>
    </aside>
  );
}

