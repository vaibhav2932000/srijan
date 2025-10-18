# 🚀 Local Setup - See UI Without Backend

Follow these simple steps to see the SRIJAN UI running locally with sample data!

## Step 1: Create Environment File

Create a file named `.env.local` in the shopify directory:

```bash
# From the shopify directory, run:
cat > .env.local << 'EOF'
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_ADMIN_API_KEY=demo-key
EOF
```

**Or manually create `.env.local` with these contents:**

```env
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_ADMIN_API_KEY=demo-key
```

The key setting is `NEXT_PUBLIC_USE_MOCK_API=true` - this tells the app to use the 8 sample products we've included!

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (Next.js, React, Tailwind, etc.)

## Step 3: Run the Development Server

```bash
npm run dev
```

## Step 4: Open in Browser

Navigate to: **http://localhost:3000**

---

## 🎨 What You'll See

### Home Page (/)
- Beautiful hero section with Indian aesthetic
- Featured categories grid (Handicrafts, Clothing, Jewelry, Textiles)
- New arrivals section with sample products
- Artisan story section
- Newsletter signup

### Products Page (/products)
- Grid of 8 sample products
- Working filters (category, price, tags)
- Search functionality
- Responsive layout

### Product Detail (/product/1)
- Click any product card to see details
- Image gallery
- Full product information
- Add to cart/wishlist buttons
- Related products

### Try These Links:
- Home: http://localhost:3000
- All Products: http://localhost:3000/products
- Handicrafts: http://localhost:3000/category/handicrafts
- Clothing: http://localhost:3000/category/clothing
- Product Detail: http://localhost:3000/product/1

---

## 🎯 Sample Data Included

The app includes 8 beautiful sample products:
1. Handcrafted Brass Ganesha Idol (₹1,999)
2. Block Print Cotton Kurti (₹1,399)
3. Terracotta Handpainted Vase (₹899)
4. Handwoven Silk Saree (₹12,999)
5. Oxidized Silver Jhumka Earrings (₹599)
6. Wooden Wall Art Panel (₹5,499)
7. Kalamkari Cotton Dupatta (₹1,299)
8. Blue Pottery Decorative Plate (₹1,199)

All with images, descriptions, prices, and categories!

---

## ✨ Features You Can Test

### ✅ Working Features (with mock data):
- ✅ Browse all products
- ✅ Filter by category
- ✅ Filter by price range
- ✅ Filter by tags
- ✅ Search products
- ✅ View product details
- ✅ Pagination
- ✅ Responsive design
- ✅ Add to cart (state only)
- ✅ Add to wishlist (state only)

### ⚠️ Not Working (needs backend):
- ❌ Admin CSV upload
- ❌ Actual checkout
- ❌ Order management

---

## 🎨 Try Customizing!

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  saffron: {
    DEFAULT: '#FF9933',  // Change this!
  }
}
```

### Change Content
Edit sample data in `data/sample-products.json`

### Change Fonts
Edit `app/layout.tsx` and update font imports

---

## 🔄 Switch to Real Backend Later

When you're ready to connect to a real backend:

1. Update `.env.local`:
```env
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_URL=https://your-api.com/api
```

2. Restart dev server:
```bash
npm run dev
```

---

## 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

**Module not found errors?**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**Changes not showing?**
```bash
# Hard refresh in browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
# Or clear Next.js cache:
rm -rf .next
npm run dev
```

---

## 📱 Test Responsive Design

Open Chrome DevTools (F12) and click the device icon to test:
- Mobile (320px - 640px)
- Tablet (768px - 1024px)
- Desktop (1280px+)

---

## 🎉 That's It!

You now have a fully functional e-commerce UI running locally with beautiful Indian aesthetics!

**Enjoy exploring! ✨**

---

Need help? Check:
- README.md - Full documentation
- PROJECT_SUMMARY.md - Complete feature list
- DEPLOYMENT.md - When ready to deploy

