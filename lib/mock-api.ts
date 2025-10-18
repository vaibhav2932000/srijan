/**
 * Mock API for local development
 * Uses sample data from /data directory
 */

import sampleProducts from '@/data/sample-products.json';
import sampleCategories from '@/data/sample-categories.json';
import type {
  Product,
  ProductListResponse,
  ProductFilters,
  Category,
} from '@/types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockApi {
  private products: Product[] = sampleProducts as Product[];
  private categories: Category[] = sampleCategories as Category[];

  async getProducts(
    filters: ProductFilters = {},
    page: number = 1,
    limit: number = 12
  ): Promise<ProductListResponse> {
    await delay(300); // Simulate network delay

    let filtered = [...this.products];

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(p => p.category.slug === filters.category);
    }

    if (filters.subcategory) {
      filtered = filtered.filter(p => p.subcategory === filters.subcategory);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => {
        const price = p.salePrice || p.price;
        return price >= filters.minPrice!;
      });
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => {
        const price = p.salePrice || p.price;
        return price <= filters.maxPrice!;
      });
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(p =>
        filters.tags!.some(tag => p.tags.includes(tag))
      );
    }

    if (filters.inStock) {
      filtered = filtered.filter(p => p.inStock);
    }

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = filtered.slice(start, end);

    return {
      products: paginatedProducts,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getProduct(id: string): Promise<Product> {
    await delay(200);
    
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product> {
    await delay(200);
    
    const product = this.products.find(p => p.slug === slug);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async searchProducts(query: string, limit: number = 8): Promise<Product[]> {
    await delay(200);
    
    const search = query.toLowerCase();
    const results = this.products.filter(p =>
      p.title.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.tags.some(tag => tag.toLowerCase().includes(search))
    );
    
    return results.slice(0, limit);
  }

  async getCategories(): Promise<Category[]> {
    await delay(100);
    return this.categories;
  }

  async getCategory(slug: string): Promise<Category> {
    await delay(100);
    
    const category = this.categories.find(c => c.slug === slug);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }
}

export const mockApi = new MockApi();

