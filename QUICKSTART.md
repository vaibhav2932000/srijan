# SRIJAN Quick Start Guide

Get SRIJAN up and running in 5 minutes! 🚀

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_ADMIN_API_KEY=demo-api-key
```

## Step 3: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 4: Explore the App

### Public Pages
- **Home**: `/` - Hero, featured categories, new arrivals
- **Products**: `/products` - Browse all products with filters
- **Product Detail**: `/product/1` - View product details
- **Category**: `/category/handicrafts` - Browse by category

### Admin
- **CSV Upload**: `/admin/upload` - Bulk import products
  - Use API key: `demo-api-key` (or your actual key)
  - Try uploading `data/sample-import.csv`

## Step 5: Connect Your Backend

Update `.env.local` with your actual API URL:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

Your backend should implement these endpoints:
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product by ID
- `GET /api/categories` - List categories
- `POST /api/admin/upload` - CSV upload (with X-API-Key header)

See `README.md` for complete API documentation.

## Sample Data

The project includes sample data in `data/`:
- `sample-products.json` - 8 sample products
- `sample-categories.json` - 4 categories
- `sample-import.csv` - CSV for testing uploads
- `sample-csv-mapping.json` - Column mapping configuration

## Common Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Run production build
npm run type-check # Check TypeScript types
npm run lint       # Lint code
```

## Next Steps

1. **Customize Branding**: Edit colors in `tailwind.config.js`
2. **Add Your Products**: Use admin CSV upload or API
3. **Configure Analytics**: Add GA ID in `.env.local`
4. **Deploy**: See `DEPLOYMENT.md` for deployment guides

## Need Help?

- 📖 Full documentation: `README.md`
- 🚀 Deployment guide: `DEPLOYMENT.md`
- 🎨 Design system: `styleguide.json`
- 🐛 Issues: Open a GitHub issue

---

**Happy Building! ✨**

