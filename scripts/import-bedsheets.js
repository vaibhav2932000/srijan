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

// List of bedsheet CSV files to process
const bedsheetFiles = [
  'BedSheet Part - 1 (1).csv',
  'BedSheet Part - 2 (1).csv', 
  'BedSheet Part - 3 (1).csv',
  'BedSheet Part - 4 (1).csv',
  'BedSheet Part - 5 (1).csv',
  'BedSheet Part - 6.csv'
];

// Function to process a single CSV file
function processCSVFile(fileName) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, 'bedsheets', fileName);
    const fileProducts = [];
    
    console.log(`Processing ${fileName}...`);
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Skip empty rows or rows without SKU
        if (!row.SKU || row.SKU.trim() === '') return;
        
        // Extract images from the Images column
        const imageUrls = row.Images ? row.Images.split(', ').map(url => url.trim()) : [];
        
        // Create product object in the same format as existing products
        const product = {
          id: `product-${nextId++}`,
          title: row.Name || 'Bedsheet Set',
          slug: row.Name ? row.Name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : `bedsheet-${nextId}`,
          shortDescription: row['Short description'] || 'Beautiful bedsheet set from our exclusive collection',
          description: row.Description || 'Premium quality bedsheet set made from soft, breathable cotton. Features traditional prints and comes with matching pillow covers for a complete bedroom set.',
          price: parseFloat(row['Regular price']) || 0,
          salePrice: row['Sale price'] ? parseFloat(row['Sale price']) : undefined,
          sku: row.SKU,
          stock: parseInt(row.Stock) || 100,
          inStock: row['In stock?'] === '1' || row['In stock?'] === 'yes',
          images: imageUrls.map((url, index) => ({
            id: `img-${nextId}-${index + 1}`,
            url: url,
            alt: row.Name || 'Bedsheet Set',
            position: index
          })),
          thumbnail: imageUrls[0] || '',
          category: {
            id: 'cat-5', // Bedsheets category
            name: 'Bedsheets',
            slug: 'bedsheets'
          },
          subcategory: 'Cotton Bedsheet Sets',
          tags: ['bedsheet', 'bedsheets', 'bedding', 'cotton', 'traditional', 'printed', 'pillow-covers', 'home-decor'],
          materials: '100% Cotton',
          dimensions: 'Double Bed Size',
          careInstructions: 'Machine wash cold, gentle cycle, tumble dry low',
          artisanNote: 'Handcrafted with traditional techniques by skilled artisans',
          featured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sizes: ['Double Bed']
        };
        
        fileProducts.push(product);
        newProducts.push(product);
      })
      .on('end', () => {
        console.log(`✅ Processed ${fileName}: ${fileProducts.length} products`);
        resolve(fileProducts);
      })
      .on('error', (error) => {
        console.error(`❌ Error processing ${fileName}:`, error);
        reject(error);
      });
  });
}

// Process all bedsheet files
async function importAllBedsheets() {
  try {
    console.log('🚀 Starting bedsheet import process...');
    console.log(`📁 Processing ${bedsheetFiles.length} CSV files from bedsheets folder`);
    
    // Process each file sequentially
    for (const fileName of bedsheetFiles) {
      await processCSVFile(fileName);
    }
    
    // Add new products to existing products
    const allProducts = [...existingProducts, ...newProducts];
    
    // Write back to the file
    fs.writeFileSync(existingProductsPath, JSON.stringify(allProducts, null, 2));
    
    console.log('\n🎉 Bedsheet import completed successfully!');
    console.log(`📊 Total new products added: ${newProducts.length}`);
    console.log(`📊 Total products now: ${allProducts.length}`);
    console.log(`🏷️ Category: Bedsheets > Cotton Bedsheet Sets`);
    console.log(`📝 Products added with SKUs: ${newProducts.slice(0, 10).map(p => p.sku).join(', ')}${newProducts.length > 10 ? '...' : ''}`);
    console.log(`\n✨ Next steps:`);
    console.log(`1. Restart your dev server: npm run dev`);
    console.log(`2. Visit http://localhost:3000/products?category=bedsheets to see the bedsheets`);
    console.log(`3. Check that filters work correctly for the bedsheets category`);
    
  } catch (error) {
    console.error('❌ Error during bedsheet import:', error);
  }
}

// Run the import
importAllBedsheets();




