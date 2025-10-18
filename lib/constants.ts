import type { SortOption, CategoryMappingRule } from '@/types';

export const SORT_OPTIONS: SortOption[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 - ₹2,500', min: 1000, max: 2500 },
  { label: '₹2,500 - ₹5,000', min: 2500, max: 5000 },
  { label: 'Above ₹5,000', min: 5000, max: Infinity },
];

export const FEATURED_TAGS = [
  'handmade',
  'eco-friendly',
  'gift',
  'bestseller',
  'new-arrival',
  'artisan-crafted',
];

// Category Mapping Rules for CSV Import
export const CATEGORY_MAPPING_RULES: CategoryMappingRule[] = [
  {
    tags: ['kurti', 'kurtis', 'kurta', 'clothing', 'dress', 'saree', 'lehenga', 'dupatta'],
    category: 'Clothing',
  },
  {
    tags: ['wood', 'wooden', 'metal', 'brass', 'copper', 'painting', 'idol', 'idols', 'statue'],
    category: 'Handicrafts',
    subcategory: 'Home Decor',
  },
  {
    tags: ['pottery', 'ceramic', 'terracotta', 'clay'],
    category: 'Handicrafts',
    subcategory: 'Pottery',
  },
  {
    tags: ['jewelry', 'jewellery', 'necklace', 'earring', 'bracelet'],
    category: 'Jewelry',
  },
  {
    tags: ['bedsheet', 'bedsheets', 'bed sheet', 'bedding', 'cotton', 'linen'],
    category: 'Bedsheets',
  },
];

// Default CSV Column Mappings
export const DEFAULT_CSV_MAPPINGS = [
  { csvColumn: 'Name', dbField: 'title' },
  { csvColumn: 'Short description', dbField: 'shortDescription' },
  { csvColumn: 'Description', dbField: 'description' },
  { csvColumn: 'Regular price', dbField: 'price' },
  { csvColumn: 'Sale price', dbField: 'salePrice' },
  { csvColumn: 'Variant SKU', dbField: 'sku' },
  { csvColumn: 'SKU', dbField: 'sku' },
  { csvColumn: 'In stock?', dbField: 'inStock' },
  { csvColumn: 'Stock', dbField: 'stock' },
  { csvColumn: 'Image Src', dbField: 'images' },
  { csvColumn: 'Images', dbField: 'images' },
  { csvColumn: 'Tags', dbField: 'tags' },
  { csvColumn: 'ID', dbField: 'externalId' },
  { csvColumn: 'Categories', dbField: 'category' },
  { csvColumn: 'Category', dbField: 'category' },
];

export const ITEMS_PER_PAGE = 12;

export const NAVIGATION_CATEGORIES = [
  { name: 'Clothing', slug: 'clothing', icon: '👘' },
  { name: 'Handicrafts', slug: 'handicrafts', icon: '🎨' },
  { name: 'Jewelry', slug: 'jewelry', icon: '💍' },
  { name: 'Bedsheets', slug: 'bedsheets', icon: '🛏️' },
];

