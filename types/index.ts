// Core Product Types
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  price: number;
  salePrice?: number;
  sku: string;
  stock: number;
  inStock: boolean;
  images: ProductImage[];
  thumbnail?: string;
  category: Category;
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  materials?: string;
  dimensions?: string;
  careInstructions?: string;
  artisanNote?: string;
  externalId?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  // New: available sizes for apparel (e.g., ["S","M","L","XL"]) 
  sizes?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  icon?: string;
}

// Filters & Search
export interface ProductFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
  inStock?: boolean;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListResponse {
  products: Product[];
  meta: PaginationMeta;
}

// CSV Upload Types
export interface CSVRow {
  [key: string]: string | number | undefined;
}

export interface ColumnMapping {
  csvColumn: string;
  dbField: string;
  transform?: (value: any) => any;
}

export interface ImportResult {
  success: boolean;
  rowNumber: number;
  productId?: string;
  action: 'created' | 'updated' | 'skipped';
  errors?: string[];
}

export interface ImportReport {
  totalRows: number;
  created: number;
  updated: number;
  failed: number;
  results: ImportResult[];
  startedAt: string;
  completedAt: string;
}

export interface CSVUploadRequest {
  file: File;
  mappings: ColumnMapping[];
  categoryMappings: CategoryMappingRule[];
  downloadImages: boolean;
}

// Category Mapping Configuration
export interface CategoryMappingRule {
  tags: string[];
  category: string;
  subcategory?: string;
}

// Cart & Wishlist (for future use)
export interface CartItem {
  product: Product;
  quantity: number;
  // New: selected size for apparel items
  selectedSize?: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Admin Types
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  apiKey?: string;
}

