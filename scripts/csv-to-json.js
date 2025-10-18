#!/usr/bin/env node

/**
 * Convert WooCommerce CSV to SRIJAN Product JSON format
 * Usage: node scripts/csv-to-json.js <input.csv> [output.json]
 */

const fs = require('fs');
const path = require('path');

// Proper CSV parser that handles quoted fields
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const rows = [];
  
  for (let line of lines) {
    if (!line.trim()) continue;
    
    const row = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"' && nextChar === '"' && inQuotes) {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else if (char === '"') {
        // Toggle quote mode
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        // Field separator
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    rows.push(row);
  }
  
  const headers = rows[0];
  const dataRows = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
  
  return { headers, rows: dataRows };
}

// Generate slug from title
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Detect category from tags and description
function detectCategory(tags, categories = [], description = '') {
  const tagLower = tags.toLowerCase();
  const descLower = description.toLowerCase();
  
  const categoryRules = [
    {
      keywords: ['bedsheet', 'bed sheet', 'bedding', 'quilt', 'comforter', 'duvet'],
      category: 'Bedsheets',
      slug: 'bedsheets'
    },
    {
      keywords: ['3 piece', '3-piece', 'three piece', 'three-piece', '3 Piece', '3-Piece'],
      category: 'Clothing',
      slug: 'clothing',
      subcategory: '3-piece-dress-set'
    },
    {
      keywords: ['kurti', 'kurtis', 'kurta', 'clothing', 'dress', 'saree', 'lehenga', 'dupatta'],
      category: 'Clothing',
      slug: 'clothing',
      subcategory: '2-piece-dress-set'
    },
    {
      keywords: ['wood', 'wooden', 'metal', 'brass', 'copper', 'painting', 'idol', 'statue'],
      category: 'Handicrafts',
      slug: 'handicrafts',
      subcategory: 'Home Decor'
    },
    {
      keywords: ['pottery', 'ceramic', 'terracotta', 'clay'],
      category: 'Handicrafts',
      slug: 'handicrafts',
      subcategory: 'Pottery'
    },
    {
      keywords: ['jewelry', 'jewellery', 'necklace', 'earring', 'bracelet', 'jhumka'],
      category: 'Jewelry',
      slug: 'jewelry'
    },
    {
      keywords: ['textile', 'fabric', 'block print', 'handloom', 'kalamkari'],
      category: 'Textiles',
      slug: 'textiles'
    }
  ];

  for (const rule of categoryRules) {
    if (rule.keywords.some(keyword => tagLower.includes(keyword) || descLower.includes(keyword))) {
      return {
        category: rule.category,
        slug: rule.slug,
        subcategory: rule.subcategory
      };
    }
  }

  return {
    category: 'Handicrafts',
    slug: 'handicrafts'
  };
}

function parseSizesFromRow(row) {
  // Prefer explicit attribute columns if present
  const attrName = (row['Attribute 1 name'] || '').toString().toLowerCase();
  const attrValues = (row['Attribute 1 value(s)'] || '').toString();
  let sizes = [];
  if (attrName.includes('size') && attrValues) {
    sizes = attrValues.split(',').map(s => s.trim()).filter(Boolean);
  }

  // Fallback: attempt to parse from Swatches Attributes JSON if present
  if (sizes.length === 0 && row['Swatches Attributes']) {
    try {
      const json = JSON.parse(row['Swatches Attributes']);
      const terms = json?.size?.terms || {};
      sizes = Object.keys(terms);
    } catch (_) {
      // ignore malformed JSON
    }
  }

  // Normalize sizes (uppercase common sizes)
  sizes = sizes.map(s => s.replace(/\s+/g, '').toUpperCase());
  // De-duplicate
  sizes = Array.from(new Set(sizes));
  return sizes.length > 0 ? sizes : undefined;
}

// Convert WooCommerce CSV row to Product JSON
function convertToProduct(row, index) {
  // Skip variation rows, only process parent/variable products
  const type = row.Type || '';
  if (type === 'variation') {
    return null;
  }
  
  const title = row.Name || `Product ${index + 1}`;
  if (!title || title.trim() === '') {
    return null;
  }
  
  const tags = (row.Tags || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
  const categoryName = row.Categories || 'Clothing';
  
  const categoryInfo = detectCategory(tags.length > 0 ? row.Tags : categoryName, categoryName, row.Description || '');
  
  // Parse images - WooCommerce uses "Images" column with comma-separated URLs
  const imageUrls = (row.Images || '').split(',').map(url => url.trim()).filter(Boolean);
  const images = imageUrls.map((url, idx) => ({
    id: `img-${index + 1}-${idx + 1}`,
    url: url,
    alt: `${title}`,
    position: idx
  }));

  // Parse prices
  const regularPrice = parseFloat(row['Regular price'] || '0') || 0;
  const salePrice = row['Sale price'] && parseFloat(row['Sale price']) > 0 ? parseFloat(row['Sale price']) : undefined;
  
  // Parse stock
  let inStock = true;
  let stock = 100;
  
  if (row['In stock?']) {
    inStock = ['1', 'true', 'yes', 'y'].includes(row['In stock?'].toString().toLowerCase());
  }
  
  if (row.Stock) {
    stock = parseInt(row.Stock) || 100;
    inStock = stock > 0;
  }

  // Parse sizes
  const sizes = parseSizesFromRow(row);

  return {
    id: (index + 1).toString(),
    title: title,
    slug: slugify(title),
    shortDescription: row['Short description'] || title,
    description: row.Description || `<p>${title}</p>`,
    price: regularPrice,
    salePrice: salePrice,
    sku: row.SKU || `SKU-${index + 1}`,
    stock: stock,
    inStock: inStock,
    images: images.length > 0 ? images : [{
      id: `img-${index + 1}-1`,
      url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
      alt: title,
      position: 0
    }],
    category: {
      id: `cat-${categoryInfo.slug}`,
      name: categoryInfo.category,
      slug: categoryInfo.slug
    },
    subcategory: categoryInfo.subcategory,
    tags: tags.length > 0 ? tags : ['kurti', 'clothing', 'women'],
    materials: 'Cotton/Rayon blend',
    dimensions: 'Available in S, M, L, XL, XXL',
    careInstructions: 'Machine wash cold, tumble dry low',
    artisanNote: 'Handcrafted with care by skilled artisans',
    externalId: row.ID || '',
    featured: tags.includes('featured') || tags.includes('bestseller'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sizes,
  };
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node scripts/csv-to-json.js <input.csv> [output.json]');
    console.error('Example: node scripts/csv-to-json.js my-products.csv data/sample-products.json');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1] || 'data/sample-products.json';

  // Read CSV
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File not found - ${inputFile}`);
    process.exit(1);
  }

  console.log(`Reading CSV from: ${inputFile}`);
  const csvContent = fs.readFileSync(inputFile, 'utf-8');
  
  // Parse CSV
  const { headers, rows } = parseCSV(csvContent);
  console.log(`Found ${rows.length} products with columns: ${headers.join(', ')}`);

  // Convert to products (filter out nulls from variations)
  const products = rows
    .map((row, index) => convertToProduct(row, index))
    .filter(product => product !== null);
  
  // Write JSON
  const outputPath = path.resolve(outputFile);
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf-8');
  
  console.log(`\n✅ Success!`);
  console.log(`Created ${products.length} products`);
  console.log(`Output saved to: ${outputPath}`);
  console.log(`\nCategories found:`);
  
  const categories = [...new Set(products.map(p => p.category.name))];
  categories.forEach(cat => {
    const count = products.filter(p => p.category.name === cat).length;
    console.log(`  - ${cat}: ${count} products`);
  });
  
  console.log(`\nNext steps:`);
  console.log(`1. Review the generated JSON file`);
  console.log(`2. Restart your dev server: npm run dev`);
  console.log(`3. Visit http://localhost:3000 to see your products!`);
}

main();

