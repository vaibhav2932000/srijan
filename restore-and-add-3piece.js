#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('Restoring all products and adding 3-piece dress sets...\n');

// Step 1: Save current products (clothing)
const currentProducts = JSON.parse(fs.readFileSync('data/sample-products.json', 'utf-8'));
console.log('Current products:', currentProducts.length);

// Step 2: Process handicrafts
console.log('Processing handicrafts...');
try {
  execSync('node scripts/csv-to-json.js combined-handicrafts.csv', { stdio: 'inherit' });
  const handicraftProducts = JSON.parse(fs.readFileSync('data/sample-products.json', 'utf-8'));
  const handicrafts = handicraftProducts.filter(p => p.category.slug === 'handicrafts');
  console.log('Handicraft products found:', handicrafts.length);
  
  // Update handicraft product IDs
  const maxId = Math.max(...currentProducts.map(p => parseInt(p.id)));
  let newId = maxId + 1;
  
  const updatedHandicrafts = handicrafts.map(product => ({
    ...product,
    id: (newId++).toString()
  }));
  
  // Add handicrafts to current products
  const productsWithHandicrafts = [...currentProducts, ...updatedHandicrafts];
  fs.writeFileSync('data/sample-products.json', JSON.stringify(productsWithHandicrafts, null, 2));
  console.log('Added handicrafts. Total products:', productsWithHandicrafts.length);
  
} catch (error) {
  console.error('Error adding handicrafts:', error.message);
}

// Step 3: Process bedsheets
console.log('Processing bedsheets...');
try {
  // Recreate bedsheet CSV
  execSync('head -1 "components/BedSheet Part - 1.csv" > combined-bedsheets.csv', { stdio: 'inherit' });
  execSync('tail -n +2 "components/BedSheet Part - 1.csv" >> combined-bedsheets.csv', { stdio: 'inherit' });
  execSync('tail -n +2 "components/BedSheet Part - 2.csv" >> combined-bedsheets.csv', { stdio: 'inherit' });
  execSync('tail -n +2 "components/BedSheet Part - 3.csv" >> combined-bedsheets.csv', { stdio: 'inherit' });
  execSync('tail -n +2 "components/BedSheet Part - 4.csv" >> combined-bedsheets.csv', { stdio: 'inherit' });
  execSync('tail -n +2 "components/BedSheet Part - 5.csv" >> combined-bedsheets.csv', { stdio: 'inherit' });
  
  execSync('node scripts/csv-to-json.js combined-bedsheets.csv', { stdio: 'inherit' });
  const bedsheetProducts = JSON.parse(fs.readFileSync('data/sample-products.json', 'utf-8'));
  const bedsheets = bedsheetProducts.filter(p => p.category.slug === 'bedsheets');
  console.log('Bedsheet products found:', bedsheets.length);
  
  // Read current products (with handicrafts)
  const currentProductsWithHandicrafts = JSON.parse(fs.readFileSync('data/sample-products.json', 'utf-8'));
  
  // Update bedsheet product IDs
  const maxId = Math.max(...currentProductsWithHandicrafts.map(p => parseInt(p.id)));
  let newId = maxId + 1;
  
  const updatedBedsheets = bedsheets.map(product => ({
    ...product,
    id: (newId++).toString()
  }));
  
  // Add bedsheets to current products
  const productsWithBedsheets = [...currentProductsWithHandicrafts, ...updatedBedsheets];
  fs.writeFileSync('data/sample-products.json', JSON.stringify(productsWithBedsheets, null, 2));
  console.log('Added bedsheets. Total products:', productsWithBedsheets.length);
  
} catch (error) {
  console.error('Error adding bedsheets:', error.message);
}

// Step 4: Process 2-piece dress sets
console.log('Processing 2-piece dress sets...');
try {
  execSync('node scripts/csv-to-json.js "2PIC PART 1 NEW.csv"', { stdio: 'inherit' });
  const dressProducts = JSON.parse(fs.readFileSync('data/sample-products.json', 'utf-8'));
  const twoPieceDresses = dressProducts.filter(p => p.category.slug === 'clothing' && p.subcategory === '2-piece-dress-set');
  console.log('2-piece dress products found:', twoPieceDresses.length);
  
  // Read current products (with handicrafts and bedsheets)
  const currentProductsWithAll = JSON.parse(fs.readFileSync('data/sample-products.json', 'utf-8'));
  
  // Update 2-piece dress product IDs
  const maxId = Math.max(...currentProductsWithAll.map(p => parseInt(p.id)));
  let newId = maxId + 1;
  
  const updatedTwoPieceDresses = twoPieceDresses.map(product => ({
    ...product,
    id: (newId++).toString()
  }));
  
  // Add 2-piece dress sets to current products
  const productsWithTwoPiece = [...currentProductsWithAll, ...updatedTwoPieceDresses];
  fs.writeFileSync('data/sample-products.json', JSON.stringify(productsWithTwoPiece, null, 2));
  console.log('Added 2-piece dress sets. Total products:', productsWithTwoPiece.length);
  
} catch (error) {
  console.error('Error adding 2-piece dress products:', error.message);
}

// Step 5: Process 3-piece dress sets
console.log('Processing 3-piece dress sets...');
try {
  // Combine 3-piece CSV files
  execSync('head -1 "3 PIECE PART 1.csv" > combined-3piece.csv', { stdio: 'inherit' });
  execSync('tail -n +2 "3 PIECE PART 1.csv" >> combined-3piece.csv', { stdio: 'inherit' });
  execSync('tail -n +2 "3 PIECE PART 2.csv" >> combined-3piece.csv', { stdio: 'inherit' });
  
  execSync('node scripts/csv-to-json.js combined-3piece.csv', { stdio: 'inherit' });
  const threePieceProducts = JSON.parse(fs.readFileSync('data/sample-products.json', 'utf-8'));
  const threePieceDresses = threePieceProducts.filter(p => p.category.slug === 'clothing' && p.subcategory === '3-piece-dress-set');
  console.log('3-piece dress products found:', threePieceDresses.length);
  
  // Read current products (with all previous products)
  const currentProductsWithAll = JSON.parse(fs.readFileSync('data/sample-products.json', 'utf-8'));
  
  // Update 3-piece dress product IDs
  const maxId = Math.max(...currentProductsWithAll.map(p => parseInt(p.id)));
  let newId = maxId + 1;
  
  const updatedThreePieceDresses = threePieceDresses.map(product => ({
    ...product,
    id: (newId++).toString()
  }));
  
  // Add 3-piece dress sets to current products
  const allProducts = [...currentProductsWithAll, ...updatedThreePieceDresses];
  fs.writeFileSync('data/sample-products.json', JSON.stringify(allProducts, null, 2));
  
  console.log(`\n✅ Successfully restored all products and added 3-piece dress sets!`);
  console.log(`\nTotal products: ${allProducts.length}`);
  
  console.log(`\nCategories:`);
  const categories = {};
  allProducts.forEach(p => {
    categories[p.category.name] = (categories[p.category.name] || 0) + 1;
  });
  for (const cat in categories) {
    console.log(`  - ${cat}: ${categories[cat]} products`);
  }
  
  console.log(`\nClothing subcategories:`);
  const clothingProducts = allProducts.filter(p => p.category.slug === 'clothing');
  const subcategories = {};
  clothingProducts.forEach(p => {
    const subcat = p.subcategory || 'no-subcategory';
    subcategories[subcat] = (subcategories[subcat] || 0) + 1;
  });
  for (const subcat in subcategories) {
    console.log(`  - ${subcat}: ${subcategories[subcat]} products`);
  }
  
  // Clean up
  fs.unlinkSync('combined-bedsheets.csv');
  fs.unlinkSync('combined-3piece.csv');
  console.log('\n✅ Cleaned up temporary files');
  
} catch (error) {
  console.error('Error adding 3-piece dress products:', error.message);
}
