import clsx, { type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function calculateDiscount(price: number, salePrice?: number): number {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function getImageUrl(url: string): string {
  if (url.startsWith('http')) return url;
  return `${process.env.NEXT_PUBLIC_API_URL}/images/${url}`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function parseCSVTags(tags: string): string[] {
  if (!tags) return [];
  return tags
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(Boolean);
}

export function categoryFromTags(tags: string[], mappings: any[]): { category?: string; subcategory?: string } {
  const lowerTags = tags.map(t => t.toLowerCase());
  
  for (const mapping of mappings) {
    const hasMatch = mapping.tags.some((tag: string) => 
      lowerTags.some(t => t.includes(tag.toLowerCase()))
    );
    
    if (hasMatch) {
      return {
        category: mapping.category,
        subcategory: mapping.subcategory,
      };
    }
  }
  
  return {};
}

