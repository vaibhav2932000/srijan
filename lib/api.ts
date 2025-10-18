import axios, { AxiosInstance } from 'axios';
import type {
  Product,
  ProductListResponse,
  ProductFilters,
  Category,
  ImportReport,
  CSVUploadRequest,
} from '@/types';
import { mockApi } from './mock-api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const USE_MOCK_API = true; // Force mock API usage for development

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Products
  async getProducts(
    filters: ProductFilters = {},
    page: number = 1,
    limit: number = 12
  ): Promise<ProductListResponse> {
    if (USE_MOCK_API) {
      return mockApi.getProducts(filters, page, limit);
    }

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (filters.category) params.append('category', filters.category);
    if (filters.subcategory) params.append('subcategory', filters.subcategory);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.tags && filters.tags.length > 0) {
      params.append('tags', filters.tags.join(','));
    }
    if (filters.inStock !== undefined) {
      params.append('inStock', filters.inStock.toString());
    }

    const response = await this.client.get<ProductListResponse>(`/products?${params.toString()}`);
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    if (USE_MOCK_API) {
      return mockApi.getProduct(id);
    }

    const response = await this.client.get<Product>(`/products/${id}`);
    return response.data;
  }

  async getProductBySlug(slug: string): Promise<Product> {
    if (USE_MOCK_API) {
      return mockApi.getProductBySlug(slug);
    }

    const response = await this.client.get<Product>(`/products/slug/${slug}`);
    return response.data;
  }

  async searchProducts(query: string, limit: number = 8): Promise<Product[]> {
    if (USE_MOCK_API) {
      return mockApi.searchProducts(query, limit);
    }

    const response = await this.client.get<Product[]>(`/products/search?q=${query}&limit=${limit}`);
    return response.data;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    if (USE_MOCK_API) {
      return mockApi.getCategories();
    }

    const response = await this.client.get<Category[]>('/categories');
    return response.data;
  }

  async getCategory(slug: string): Promise<Category> {
    if (USE_MOCK_API) {
      return mockApi.getCategory(slug);
    }

    const response = await this.client.get<Category>(`/categories/${slug}`);
    return response.data;
  }

  // Admin - CSV Upload
  async uploadCSV(formData: FormData, apiKey: string): Promise<ImportReport> {
    const response = await this.client.post<ImportReport>('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-API-Key': apiKey,
      },
    });
    return response.data;
  }

  async getImportStatus(importId: string, apiKey: string): Promise<ImportReport> {
    const response = await this.client.get<ImportReport>(`/admin/imports/${importId}`, {
      headers: {
        'X-API-Key': apiKey,
      },
    });
    return response.data;
  }
}

export const api = new ApiClient();

