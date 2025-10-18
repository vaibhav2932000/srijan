<<<<<<< HEAD
# SRIJAN — Indian Handicrafts & Clothing Storefront

<div align="center">
  <h3>✨ From India's roots — handcrafted with love ✨</h3>
  <p>A modern, production-ready Next.js e-commerce frontend for authentic Indian handicrafts and traditional clothing</p>
</div>

---

## 🎨 Project Overview

SRIJAN is a beautifully crafted e-commerce storefront that celebrates India's rich heritage of handicrafts and traditional clothing. Built with Next.js 14 and featuring an authentic Indian aesthetic, this frontend connects to a REST API backend for seamless product management.

### Key Features

- 🌟 **Modern Indian Aesthetic**: Warm earthy tones with saffron, peacock blue, and marigold accents
- 📱 **Fully Responsive**: Mobile-first design that works beautifully on all devices
- ♿ **Accessible**: WCAG-compliant with semantic HTML and keyboard navigation
- 🔍 **Advanced Filtering**: Search, category filters, price ranges, and tags
- 📄 **Pagination**: Efficient product browsing with page navigation
- 📊 **Admin CSV Upload**: Bulk import products with intelligent column mapping
- 🎭 **Rich Product Pages**: Image galleries, detailed descriptions, and artisan stories
- ⚡ **Performance Optimized**: Lazy loading, server-side rendering, and optimized images
- 🎯 **SEO Ready**: Structured data and meta tags for search engine visibility

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **State Management**: Zustand (lightweight)
- **HTTP Client**: Axios
- **CSV Parsing**: PapaParse
- **Fonts**: Poppins (headings) + Lora (brand/accent)
- **Icons**: React Icons (Feather Icons)
- **Notifications**: React Hot Toast

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A backend API that implements the product endpoints (see API Requirements below)

### Installation

1. **Clone the repository**

```bash
cd shopify  # or your project directory
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Admin API Key (for CSV uploads)
NEXT_PUBLIC_ADMIN_API_KEY=your-admin-api-key-here

# Optional: AWS S3 Configuration (for image uploads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=srijan-products

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
shopify/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home page
│   ├── products/page.tsx         # Product listing with filters
│   ├── product/[id]/page.tsx     # Product detail page
│   ├── category/[slug]/page.tsx  # Category pages (redirects to products)
│   ├── admin/upload/page.tsx     # Admin CSV upload interface
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # Reusable React components
│   ├── Header.tsx                # Main navigation header
│   ├── Footer.tsx                # Site footer
│   ├── ProductCard.tsx           # Product card component
│   ├── FiltersSidebar.tsx        # Filters and search
│   ├── Pagination.tsx            # Pagination component
│   ├── Breadcrumbs.tsx           # Breadcrumb navigation
│   ├── SearchModal.tsx           # Search modal overlay
│   └── SkeletonLoader.tsx        # Loading skeletons
├── lib/                          # Utilities and helpers
│   ├── api.ts                    # API client (Axios)
│   ├── constants.ts              # App constants and config
│   └── utils.ts                  # Helper functions
├── types/                        # TypeScript type definitions
│   └── index.ts                  # All type definitions
├── data/                         # Sample data and config
│   ├── sample-products.json      # Sample product data
│   ├── sample-categories.json    # Sample categories
│   ├── sample-csv-mapping.json   # CSV mapping config
│   └── sample-import.csv         # Sample CSV for testing
├── public/                       # Static assets
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🎨 Design System

### Color Palette

```javascript
// Primary Colors
Saffron:     #FF9933 (Primary CTAs, highlights)
Peacock:     #006994 (Links, secondary actions)
Marigold:    #F2B705 (Accents, badges)

// Neutrals
Ivory:       #FFF8F0 (Background)
Earth Brown: #6B4C3B (Text, headings)
Earth Green: #558B6E (Success states)
```

### Typography

- **Headings**: Poppins (Sans-serif) — Clean, modern, readable
- **Body**: Poppins — Consistent throughout
- **Brand/Accent**: Lora (Serif) — Elegant, artisanal feel

### Component Styles

All components follow consistent design patterns:
- **Cards**: 2xl border radius, soft shadows
- **Buttons**: Primary (saffron), Secondary (peacock), Outline, Ghost
- **Inputs**: 2px border, saffron focus states
- **Badges**: Rounded, colored by type

See `styleguide.json` for complete design tokens.

---

## 🔌 API Requirements

The frontend expects a REST API backend with the following endpoints:

### Product Endpoints

```
GET  /api/products
  Query params: page, limit, category, subcategory, minPrice, maxPrice, tags, search, inStock
  Returns: { products: Product[], meta: PaginationMeta }

GET  /api/products/:id
  Returns: Product

GET  /api/products/slug/:slug
  Returns: Product

GET  /api/products/search?q=query&limit=8
  Returns: Product[]
```

### Category Endpoints

```
GET  /api/categories
  Returns: Category[]

GET  /api/categories/:slug
  Returns: Category
```

### Admin Endpoints

```
POST /api/admin/upload
  Headers: X-API-Key: <admin-api-key>
  Body: FormData with 'file' (CSV), 'mappings' (JSON), 'categoryMappings' (JSON), 'downloadImages' (boolean)
  Returns: ImportReport

GET  /api/admin/imports/:importId
  Headers: X-API-Key: <admin-api-key>
  Returns: ImportReport
```

### Type Definitions

See `types/index.ts` for complete TypeScript interfaces for Product, Category, ImportReport, etc.

---

## 📤 CSV Upload & Mapping

### CSV Format

The admin panel supports bulk product imports via CSV. Expected columns:

| Column Name | DB Field | Required | Description |
|-------------|----------|----------|-------------|
| Name | title | Yes | Product title |
| Short description | shortDescription | No | Brief description |
| Description | description | Yes | Full description (HTML) |
| Regular price | price | Yes | Base price (INR) |
| Sale price | salePrice | No | Discounted price |
| Variant SKU / SKU | sku | Yes | Stock keeping unit |
| Stock | stock | No | Quantity available |
| In stock? | inStock | No | Boolean (1/0, yes/no) |
| Image Src / Images | images | No | Comma-separated URLs |
| Tags | tags | No | Comma-separated tags |
| Category | category | No | Category name |

### Auto-Category Mapping

If no category is specified, the system uses tag-based rules:

- **Clothing**: kurti, saree, lehenga, clothing, dress
- **Handicrafts → Home Decor**: wood, metal, brass, idol, painting
- **Handicrafts → Pottery**: pottery, ceramic, terracotta, clay
- **Jewelry**: jewelry, earring, necklace, bracelet, jhumka
- **Textiles**: textile, fabric, block print, handloom, kalamkari

See `data/sample-csv-mapping.json` for the full configuration.

### Testing CSV Upload

1. Navigate to `/admin/upload`
2. Enter your admin API key
3. Upload `data/sample-import.csv` (provided)
4. Review the preview and column mappings
5. Click "Start Import"
6. View the detailed import report

---

## 🎯 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, featured categories, new arrivals |
| `/products` | Product listing with filters, search, pagination |
| `/products?category=handicrafts` | Filtered by category |
| `/products?search=kurti` | Search results |
| `/category/:slug` | Redirects to products with category filter |
| `/product/:id` | Product detail page with gallery and full info |
| `/admin/upload` | CSV upload interface (requires API key) |

---

## 🧩 Key Components

### Header
- Sticky navigation with scroll effects
- Category navigation
- Search modal
- Cart and wishlist icons
- Mobile hamburger menu

### ProductCard
- Product image with hover effects
- Category, title, price
- Sale badge and discount percentage
- Tags and quick actions (wishlist, quick view)
- Add to cart button

### FiltersSidebar
- Category selection (radio)
- Price range filters
- Tag filters (multi-select)
- Stock availability toggle
- Mobile-friendly drawer

### Pagination
- Page numbers with ellipsis
- Previous/Next navigation
- Current page highlight
- Accessible ARIA labels

### Admin CSV Upload
- Multi-step wizard: Upload → Preview → Mapping → Report
- Auto-detect and map common columns
- Preview first 5 rows
- Detailed import report with per-row status
- Download report as text file

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in project settings
4. Deploy!

```bash
# Or use Vercel CLI
vercel --prod
```

### Other Platforms

This is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Digital Ocean App Platform
- Railway
- Render
- Your own server with Node.js

Build command:
```bash
npm run build
npm run start
```

---

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  saffron: { DEFAULT: '#FF9933', ... },
  peacock: { DEFAULT: '#006994', ... },
  // Add your custom colors
}
```

### Changing Fonts

Update `app/layout.tsx`:

```typescript
import { YourFont } from 'next/font/google';
```

### Adding New Filters

1. Add filter option to `lib/constants.ts`
2. Update `ProductFilters` type in `types/index.ts`
3. Add UI in `FiltersSidebar.tsx`
4. Update API query params in `lib/api.ts`

---

## 📊 Performance

- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic with Next.js App Router
- **Server-Side Rendering**: Product pages rendered on server for SEO
- **Caching**: API responses cached where appropriate

---

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus visible states
- Alt text for all images
- Color contrast ratios meet WCAG AA
- Screen reader friendly

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Support

For questions or issues:
- Open an issue on GitHub
- Contact: support@srijan.in (example)

---

## 🙏 Acknowledgments

- Inspired by India's rich heritage of handicrafts
- Built with ❤️ for artisans and conscious consumers
- UI influenced by traditional Indian art and modern e-commerce best practices

---

<div align="center">
  <p><strong>Made with ❤️ in India</strong></p>
  <p>✨ Handcrafted with love ✨</p>
</div>

=======
# srijan
Srijan Store code
>>>>>>> 5dba3d2a22e45f01d87bc8fff50edc19b0f918dd
