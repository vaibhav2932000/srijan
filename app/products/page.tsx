'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiSliders } from 'react-icons/fi';
import ProductCard from '@/components/ProductCard';
import FiltersSidebar from '@/components/FiltersSidebar';
import Pagination from '@/components/Pagination';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ProductGridSkeleton } from '@/components/SkeletonLoader';
import { api } from '@/lib/api';
import { SORT_OPTIONS, ITEMS_PER_PAGE } from '@/lib/constants';
import type { Product, Category, ProductFilters, PaginationMeta } from '@/types';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const currentFilters: ProductFilters = {
    category: searchParams.get('category') || undefined,
    subcategory: searchParams.get('subcategory') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
    search: searchParams.get('search') || undefined,
    inStock: searchParams.get('inStock') === 'true' || undefined,
  };


  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchParams]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.getProducts(currentFilters, currentPage, ITEMS_PER_PAGE);
      setProducts(response.products);
      setMeta(response.meta);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Use sample data for development
      const sampleProducts = await import('@/data/sample-products.json');
      const allProducts = sampleProducts.default;
      
      // Apply filters manually
      let filtered = [...allProducts];
      if (currentFilters.category) {
        filtered = filtered.filter(p => p.category.slug === currentFilters.category);
      }
      if (currentFilters.subcategory) {
        filtered = filtered.filter(p => p.subcategory === currentFilters.subcategory);
      }
      if (currentFilters.search) {
        const search = currentFilters.search.toLowerCase();
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.tags.some(tag => tag.toLowerCase().includes(search))
        );
      }
      if (currentFilters.minPrice !== undefined) {
        filtered = filtered.filter(p => {
          const price = p.salePrice || p.price;
          return price >= currentFilters.minPrice!;
        });
      }
      if (currentFilters.maxPrice !== undefined) {
        filtered = filtered.filter(p => {
          const price = p.salePrice || p.price;
          return price <= currentFilters.maxPrice!;
        });
      }
      if (currentFilters.tags && currentFilters.tags.length > 0) {
        filtered = filtered.filter(p =>
          currentFilters.tags!.some(tag => p.tags.includes(tag))
        );
      }
      if (currentFilters.inStock) {
        filtered = filtered.filter(p => p.inStock);
      }
      
      // Pagination
      const total = filtered.length;
      const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const paginatedProducts = filtered.slice(start, end);
      
      setProducts(paginatedProducts);
      setMeta({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        total,
        totalPages,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await api.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([
        { id: '1', name: 'Handicrafts', slug: 'handicrafts' },
        { id: '2', name: 'Clothing', slug: 'clothing' },
        { id: '3', name: 'Jewelry', slug: 'jewelry' },
        { id: '4', name: 'Textiles', slug: 'textiles' },
      ]);
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    window.history.pushState(null, '', `?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (filters: ProductFilters) => {
    // Filters are already handled by the FiltersSidebar component
    // This is just for any additional logic if needed
  };

  const breadcrumbItems = [
    { label: 'Products', href: '/products' },
  ];

  if (currentFilters.category) {
    const category = categories.find(c => c.slug === currentFilters.category);
    if (category) {
      breadcrumbItems.push({ label: category.name, href: `/category/${category.slug}` });
    }
  }

  return (
    <div className="min-h-screen bg-ivory animate-fade-in">
      <div className="container-custom py-8">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold font-lora text-earth-brown mb-2">
              {currentFilters.category
                ? categories.find(c => c.slug === currentFilters.category)?.name || 'Products'
                : 'All Products'}
            </h1>
            {currentFilters.search && (
              <p className="text-earth-brown/70">
                Search results for "{currentFilters.search}"
              </p>
            )}
            {!isLoading && (
              <p className="text-earth-brown/70">
                {meta.total} {meta.total === 1 ? 'product' : 'products'} found
              </p>
            )}
          </div>

          {/* Sort & Filter Toggle */}
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input py-2 text-sm hidden sm:block"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="btn-outline lg:hidden"
            >
              <FiSliders className="mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <FiltersSidebar
              categories={categories}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <ProductGridSkeleton count={ITEMS_PER_PAGE} />
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mb-12">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {meta.totalPages > 1 && (
                  <Pagination meta={meta} onPageChange={handlePageChange} />
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-8xl mb-6">🎨</div>
                <h3 className="text-2xl font-bold font-lora text-earth-brown mb-3">
                  We're brewing something beautiful
                </h3>
                <p className="text-earth-brown/70 mb-6">
                  No products found matching your criteria
                </p>
                <button
                  onClick={() => window.location.href = '/products'}
                  className="btn-primary"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      {isMobileFilterOpen && (
        <FiltersSidebar
          categories={categories}
          onFilterChange={handleFilterChange}
          isMobile
          onClose={() => setIsMobileFilterOpen(false)}
        />
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductsPageContent />
    </Suspense>
  );
}

