# 📥 Import Your CSV Products (Local Development)

Two ways to import your CSV and replace the sample data:

---

## Method 1: Automated Script (Recommended) ⚡

### Step 1: Place Your CSV File

Put your CSV file in the shopify directory. For example:
```
shopify/
  ├── my-products.csv  ← Your CSV here
  ├── scripts/
  └── data/
```

### Step 2: Run the Conversion Script

```bash
# Convert CSV to JSON
node scripts/csv-to-json.js my-products.csv data/sample-products.json

# The script will:
# ✅ Parse your CSV
# ✅ Auto-detect categories from tags
# ✅ Generate proper JSON format
# ✅ Save to data/sample-products.json
```

### Step 3: Restart Dev Server

```bash
npm run dev
```

Visit http://localhost:3000 - Your products are now live! 🎉

---

## Method 2: Manual Conversion 🔧

If you prefer to convert manually or the script doesn't work:

### Step 1: Understand the JSON Format

Your CSV should have these columns:
- `Name` - Product title
- `Short description` - Brief description
- `Description` - Full description (HTML supported)
- `Regular price` - Price in INR
- `Sale price` - Discounted price (optional)
- `Variant SKU` or `SKU` - Product SKU
- `Stock` - Quantity available
- `In stock?` - 1/0 or true/false
- `Image Src` - Image URL(s), comma-separated for multiple
- `Tags` - Comma-separated tags
- `Category` - Category name (optional if tags contain category keywords)

### Step 2: Convert to JSON Format

Edit `data/sample-products.json` and structure it like this:

```json
[
  {
    "id": "1",
    "title": "Your Product Name",
    "slug": "your-product-name",
    "shortDescription": "Brief description",
    "description": "<p>Full description here</p>",
    "price": 1999,
    "salePrice": 1499,
    "sku": "SKU-001",
    "stock": 10,
    "inStock": true,
    "images": [
      {
        "id": "1-1",
        "url": "https://your-image-url.com/image.jpg",
        "alt": "Product image",
        "position": 0
      }
    ],
    "category": {
      "id": "cat-1",
      "name": "Handicrafts",
      "slug": "handicrafts"
    },
    "subcategory": "Home Decor",
    "tags": ["handmade", "brass", "gift"],
    "materials": "Pure brass",
    "dimensions": "6 x 4 inches",
    "careInstructions": "Clean with soft cloth",
    "artisanNote": "Handcrafted by artisan from Jaipur",
    "featured": true,
    "createdAt": "2024-01-15T00:00:00Z",
    "updatedAt": "2024-01-15T00:00:00Z"
  }
]
```

### Step 3: Restart Dev Server

```bash
npm run dev
```

---

## Category Auto-Detection Rules

The script automatically detects categories based on tags:

| Tags Contain | → Category | Subcategory |
|--------------|------------|-------------|
| kurti, saree, clothing, dress | Clothing | - |
| wood, metal, brass, idol, painting | Handicrafts | Home Decor |
| pottery, ceramic, terracotta | Handicrafts | Pottery |
| jewelry, earring, necklace | Jewelry | - |
| textile, fabric, handloom | Textiles | - |

**Example:**
- Tags: `kurti, cotton, handmade` → Category: **Clothing**
- Tags: `brass, idol, handmade` → Category: **Handicrafts**, Subcategory: **Home Decor**

---

## CSV Format Example

Your CSV should look like this:

```csv
Name,Short description,Description,Regular price,Sale price,Variant SKU,Stock,In stock?,Image Src,Tags,Category
"Brass Ganesha Idol","Beautiful brass idol","<p>Handcrafted brass Ganesha</p>",2499,1999,BRASS-001,15,1,https://example.com/image.jpg,"handmade,brass,religious",Handicrafts
"Cotton Kurti","Block print kurti","<p>Traditional block print</p>",1799,1399,KURTI-001,25,1,https://example.com/kurti.jpg,"kurti,cotton,clothing",Clothing
```

---

## Image Handling

### Multiple Images
Separate multiple image URLs with commas:
```csv
Image Src
https://example.com/image1.jpg,https://example.com/image2.jpg,https://example.com/image3.jpg
```

### No Images?
If you don't have image URLs, the script will use placeholder images. You can add real images later.

### Image URL Requirements
- Must be publicly accessible URLs
- Supported formats: JPG, PNG, WebP
- Recommended size: 800x800px or larger

---

## Troubleshooting

### Script Error: "Cannot find module"
Make sure you're in the shopify directory:
```bash
cd /Users/vaibhav.shekhar/shopify
node scripts/csv-to-json.js your-file.csv
```

### "File not found"
Check your CSV file path:
```bash
# Check if file exists
ls -la my-products.csv

# Use absolute path if needed
node scripts/csv-to-json.js /full/path/to/your-file.csv
```

### Products Not Showing
1. Check the JSON is valid:
```bash
cat data/sample-products.json
```

2. Restart dev server:
```bash
# Stop server (Ctrl+C)
npm run dev
```

3. Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)

### Wrong Categories
Edit the category detection in the script or add a `Category` column to your CSV.

---

## Testing Your Import

After importing:

1. **Home Page** - Should show your products in "New Arrivals"
2. **Products Page** - All your products should appear
3. **Filters** - Test category filters
4. **Search** - Search for your product names
5. **Product Detail** - Click a product to see full details

---

## Sample CSV Files

We've included sample CSVs you can reference:
- `data/sample-import.csv` - 5 sample products
- See the format and copy it for your products

---

## Need More Categories?

Edit `data/sample-categories.json`:

```json
[
  {
    "id": "cat-5",
    "name": "Your New Category",
    "slug": "your-new-category",
    "description": "Description here",
    "image": "https://image-url.com/category.jpg",
    "icon": "🎨"
  }
]
```

Then update the category detection rules in `scripts/csv-to-json.js`.

---

## Quick Command Reference

```bash
# Convert CSV to JSON
node scripts/csv-to-json.js my-products.csv

# Convert and save to specific location
node scripts/csv-to-json.js my-products.csv data/sample-products.json

# View current products
cat data/sample-products.json | grep "title"

# Restart dev server
npm run dev
```

---

## 🎉 All Done!

Your products should now appear in the app. If you need to add more products later, just:
1. Update your CSV
2. Re-run the conversion script
3. Restart the dev server

**Happy selling! ✨**

