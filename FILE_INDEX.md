# SRIJAN File Index

Complete listing of all files in the project with descriptions.

## 📁 Root Configuration Files

| File | Description |
|------|-------------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.js` | Tailwind CSS theme config |
| `postcss.config.js` | PostCSS configuration |
| `next.config.js` | Next.js configuration |
| `middleware.ts` | Security headers middleware |
| `.gitignore` | Git ignore rules |

## 📖 Documentation Files

| File | Description |
|------|-------------|
| `README.md` | Main project documentation (comprehensive) |
| `QUICKSTART.md` | 5-minute quick start guide |
| `DEPLOYMENT.md` | Multi-platform deployment guide |
| `CONTRIBUTING.md` | Contribution guidelines |
| `PROJECT_SUMMARY.md` | Complete project summary |
| `FILE_INDEX.md` | This file - complete file listing |
| `styleguide.json` | Design system tokens and guidelines |

## 🎨 App Directory (Next.js Pages)

### Root
| File | Route | Description |
|------|-------|-------------|
| `app/layout.tsx` | All routes | Root layout with Header/Footer |
| `app/page.tsx` | `/` | Home page with hero and features |
| `app/globals.css` | - | Global styles and Tailwind |

### Products
| File | Route | Description |
|------|-------|-------------|
| `app/products/page.tsx` | `/products` | Product listing with filters |
| `app/product/[id]/page.tsx` | `/product/:id` | Product detail page |

### Categories
| File | Route | Description |
|------|-------|-------------|
| `app/category/[slug]/page.tsx` | `/category/:slug` | Redirects to filtered products |

### Admin
| File | Route | Description |
|------|-------|-------------|
| `app/admin/upload/page.tsx` | `/admin/upload` | CSV upload interface |

## 🧩 Components Directory

| File | Description | Props |
|------|-------------|-------|
| `Header.tsx` | Main navigation header | None |
| `Footer.tsx` | Site footer with links | None |
| `ProductCard.tsx` | Product display card | product, compact? |
| `FiltersSidebar.tsx` | Filters and search | categories, onFilterChange?, isMobile?, onClose? |
| `SearchModal.tsx` | Search overlay modal | isOpen, onClose |
| `Pagination.tsx` | Page navigation | meta, onPageChange |
| `Breadcrumbs.tsx` | Breadcrumb navigation | items |
| `SkeletonLoader.tsx` | Loading skeletons | Various skeleton types |

## 🛠️ Library Files

| File | Description |
|------|-------------|
| `lib/api.ts` | API client with Axios |
| `lib/constants.ts` | App-wide constants |
| `lib/utils.ts` | Helper functions |
| `lib/store.ts` | Zustand state management |

### lib/api.ts
Functions:
- `getProducts()` - Fetch products with filters
- `getProduct()` - Get single product
- `getProductBySlug()` - Get by slug
- `searchProducts()` - Search products
- `getCategories()` - Fetch categories
- `getCategory()` - Get single category
- `uploadCSV()` - Admin CSV upload

### lib/constants.ts
Exports:
- `SORT_OPTIONS` - Sorting options
- `PRICE_RANGES` - Price filter ranges
- `FEATURED_TAGS` - Common tags
- `CATEGORY_MAPPING_RULES` - CSV category mapping
- `DEFAULT_CSV_MAPPINGS` - CSV column mappings
- `ITEMS_PER_PAGE` - Pagination size
- `NAVIGATION_CATEGORIES` - Main nav categories

### lib/utils.ts
Functions:
- `cn()` - Conditional class names
- `formatPrice()` - Format to INR currency
- `formatDate()` - Format dates
- `slugify()` - Create URL slugs
- `calculateDiscount()` - Calculate discount %
- `debounce()` - Debounce utility
- `truncate()` - Truncate text
- `getImageUrl()` - Get full image URL
- `isValidEmail()` - Email validation
- `parseCSVTags()` - Parse CSV tags
- `categoryFromTags()` - Detect category

### lib/store.ts
State:
- `cart` - Shopping cart items
- `wishlist` - Wishlist items
- Actions for add/remove/update

## 📝 Type Definitions

| File | Description |
|------|-------------|
| `types/index.ts` | All TypeScript interfaces and types |

Types defined:
- `Product` - Product entity
- `ProductImage` - Image entity
- `Category` - Category entity
- `ProductFilters` - Filter params
- `SortOption` - Sort option
- `PaginationMeta` - Pagination info
- `ProductListResponse` - API response
- `CSVRow` - CSV data row
- `ColumnMapping` - CSV mapping
- `ImportResult` - Import result
- `ImportReport` - Import report
- `CategoryMappingRule` - Mapping rule
- `CartItem` - Cart item
- `WishlistItem` - Wishlist item
- `ApiResponse<T>` - Generic API response
- `AdminUser` - Admin user

## 📊 Sample Data

| File | Description |
|------|-------------|
| `data/sample-products.json` | 8 sample products |
| `data/sample-categories.json` | 4 sample categories |
| `data/sample-csv-mapping.json` | CSV mapping config |
| `data/sample-import.csv` | Sample CSV for testing |

## 🖼️ Public Assets

| File | Description |
|------|-------------|
| `public/placeholder-product.jpg` | Placeholder for missing images |

Additional directories (to be added):
- `public/textures/` - Background textures
- `public/patterns/` - SVG patterns
- `public/favicon.ico` - Site favicon

## 📦 Component Hierarchy

```
App Layout (layout.tsx)
├── Header
│   ├── Logo
│   ├── Navigation (Desktop)
│   ├── Search Button → SearchModal
│   ├── Wishlist Icon
│   ├── Cart Icon
│   └── Mobile Menu
├── Main Content (children)
│   ├── Home Page
│   │   ├── Hero Section
│   │   ├── Features
│   │   ├── Featured Categories
│   │   ├── New Arrivals Grid
│   │   │   └── ProductCard (multiple)
│   │   └── Newsletter CTA
│   ├── Products Page
│   │   ├── Breadcrumbs
│   │   ├── FiltersSidebar
│   │   ├── Product Grid
│   │   │   └── ProductCard (multiple)
│   │   └── Pagination
│   ├── Product Detail Page
│   │   ├── Breadcrumbs
│   │   ├── Image Gallery
│   │   ├── Product Info
│   │   ├── Add to Cart/Wishlist
│   │   └── Related Products
│   │       └── ProductCard (multiple)
│   └── Admin Upload Page
│       ├── API Key Input
│       ├── File Upload
│       ├── CSV Preview
│       ├── Column Mapping
│       └── Import Report
└── Footer
    ├── Newsletter Signup
    ├── Navigation Links
    └── Social Links
```

## 🎨 Style System

### Colors (Tailwind)
- `saffron` - #FF9933 (primary)
- `peacock` - #006994 (secondary)
- `marigold` - #F2B705 (accent)
- `ivory` - #FFF8F0 (background)
- `earth-brown` - #6B4C3B (text)
- `earth-green` - #558B6E (success)

### Custom CSS Classes
- `btn` - Base button
- `btn-primary` - Saffron button
- `btn-secondary` - Peacock button
- `btn-outline` - Outlined button
- `btn-ghost` - Ghost button
- `card` - Base card
- `input` - Form input
- `badge` - Badge/tag
- `badge-primary` - Primary badge
- `badge-success` - Success badge
- `badge-warning` - Warning badge
- `skeleton` - Loading skeleton

## 🔧 NPM Scripts

```json
{
  "dev": "Start development server",
  "build": "Build for production",
  "start": "Run production server",
  "lint": "Run ESLint",
  "type-check": "Check TypeScript types"
}
```

## 🌐 Routes Overview

| Route | Type | Component | Description |
|-------|------|-----------|-------------|
| `/` | Page | `app/page.tsx` | Home page |
| `/products` | Page | `app/products/page.tsx` | Product listing |
| `/products?category=X` | Page | Same | Filtered products |
| `/products?search=X` | Page | Same | Search results |
| `/category/:slug` | Redirect | `app/category/[slug]/page.tsx` | Redirects to products |
| `/product/:id` | Page | `app/product/[id]/page.tsx` | Product details |
| `/admin/upload` | Page | `app/admin/upload/page.tsx` | CSV upload |

## 📱 Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL |
| `NEXT_PUBLIC_ADMIN_API_KEY` | Yes | Admin API key |
| `AWS_REGION` | No | AWS region for S3 |
| `AWS_ACCESS_KEY_ID` | No | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | No | AWS secret key |
| `AWS_S3_BUCKET` | No | S3 bucket name |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics ID |

## 📊 File Statistics

- **Total Files**: ~55
- **TypeScript Files**: ~25
- **Component Files**: 8
- **Page Files**: 5
- **Utility Files**: 4
- **Config Files**: 6
- **Documentation Files**: 7
- **Data Files**: 4
- **Lines of Code**: ~6,000+ (estimated)

## 🎯 Key Files for Customization

1. **Branding**: `tailwind.config.js`, `app/globals.css`
2. **API**: `lib/api.ts`, `.env.local`
3. **Content**: `data/*.json`, page files
4. **Styling**: `app/globals.css`, component files
5. **Types**: `types/index.ts`

## 🚀 Most Important Files

1. `README.md` - Start here
2. `QUICKSTART.md` - Quick setup
3. `app/layout.tsx` - App structure
4. `lib/api.ts` - API integration
5. `types/index.ts` - Type system
6. `tailwind.config.js` - Design system
7. `app/page.tsx` - Home page example
8. `app/admin/upload/page.tsx` - CSV upload feature

---

## ✅ Project Status

**All files created and documented!**

Ready for:
- ✅ Development
- ✅ Testing
- ✅ Deployment
- ✅ Customization

---

<div align="center">

**File Index Complete** ✨

</div>

