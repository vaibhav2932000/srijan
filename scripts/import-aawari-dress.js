const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Read existing products to get the next ID
const existingProductsPath = path.join(__dirname, '../data/sample-products.json');
const existingProducts = JSON.parse(fs.readFileSync(existingProductsPath, 'utf8'));

// Find the highest existing ID
let maxId = 0;
existingProducts.forEach(product => {
  const idNum = parseInt(product.id.replace('product-', ''));
  if (idNum > maxId) maxId = idNum;
});

let nextId = maxId + 1;
const newProducts = [];

// Process the CSV file
fs.createReadStream(path.join(__dirname, '../Aawari Midi Dress.csv'))
  .pipe(csv())
  .on('data', (row) => {
    // Skip empty rows or rows without SKU
    if (!row.SKU || row.SKU.trim() === '') return;
    
    // Extract images from the Images column
    const imageUrls = row.Images ? row.Images.split(', ').map(url => url.trim()) : [];
    
    // Create product object in the same format as existing products
    const product = {
      id: `product-${nextId++}`,
      title: row.Name || 'Aawari Midi Dress',
      slug: row.Name ? row.Name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : `aawari-midi-dress-${nextId}`,
      shortDescription: row['Short description'] || 'Beautiful Aawari Midi Dress from our exclusive collection',
      description: row.Description || 'Women\'s Cotton Printed Midi Dress featuring a flattering V-neck and a fit & flare silhouette. Made from soft, breathable cotton, this dress offers all-day comfort and a charming printed design.',
      price: parseFloat(row['Regular price']) || 0,
      salePrice: row['Sale price'] ? parseFloat(row['Sale price']) : undefined,
      sku: row.SKU,
      stock: parseInt(row.Stock) || 100,
      inStock: row['In stock?'] === '1' || row['In stock?'] === 'yes',
      images: imageUrls.map((url, index) => ({
        id: `img-${nextId}-${index + 1}`,
        url: url,
        alt: row.Name || 'Aawari Midi Dress',
        position: index
      })),
      thumbnail: imageUrls[0] || '',
      category: {
        id: 'cat-2', // Clothing category
        name: 'Clothing',
        slug: 'clothing'
      },
      subcategory: 'Aawari Kurti Collection',
      tags: ['aawari', 'kurti', 'midi-dress', 'cotton', 'printed', 'women', 'traditional'],
      materials: 'Cotton',
      dimensions: 'Fit & Flare',
      careInstructions: 'Machine wash cold, gentle cycle',
      artisanNote: 'Handcrafted with love by skilled artisans',
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sizes: ['M', 'L', 'XL', 'XXL']
    };
    
    newProducts.push(product);
  })
  .on('end', () => {
    // Add new products to existing products
    const allProducts = [...existingProducts, ...newProducts];
    
    // Write back to the file
    fs.writeFileSync(existingProductsPath, JSON.stringify(allProducts, null, 2));
    
    console.log(`✅ Successfully added ${newProducts.length} Aawari Midi Dress products to the Clothing category`);
    console.log(`📊 Total products now: ${allProducts.length}`);
    console.log(`🏷️ Category: Clothing > Aawari Kurti Collection`);
    console.log(`📝 Products added with SKUs: ${newProducts.map(p => p.sku).join(', ')}`);
  })
  .on('error', (error) => {
    console.error('❌ Error processing CSV:', error);
  });
