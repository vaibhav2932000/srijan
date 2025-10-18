#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

(function main() {
  const projectRoot = process.cwd();
  const dataFile = path.join(projectRoot, 'data', 'sample-products.json');
  const backupFile = path.join(projectRoot, 'data', 'sample-products-backup.json');
  const csvFile = path.join(projectRoot, 'AAWARI SHORT KURTI.csv');

  console.log('Adding AAWARI Short Kurti products safely...');

  if (!fs.existsSync(csvFile)) {
    console.error(`❌ CSV not found: ${csvFile}`);
    process.exit(1);
  }

  // 1) Read existing products and backup
  if (!fs.existsSync(dataFile)) {
    console.error(`❌ Data file not found: ${dataFile}`);
    process.exit(1);
  }
  const existingProducts = readJson(dataFile);
  writeJson(backupFile, existingProducts);
  console.log(`✅ Backed up existing products (${existingProducts.length}) → ${backupFile}`);

  // 2) Process CSV (this overwrites data file temporarily)
  console.log('▶ Processing CSV with csv-to-json.js ...');
  try {
    execSync(`node scripts/csv-to-json.js "${csvFile}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Failed to process CSV:', err.message);
    process.exit(1);
  }

  if (!fs.existsSync(dataFile)) {
    console.error('❌ Expected output JSON missing after CSV processing.');
    process.exit(1);
  }

  // 3) Load new products from processed file
  const rawNewProducts = readJson(dataFile);
  console.log(`✅ Parsed ${rawNewProducts.length} products from CSV`);

  // 4) Force category and subcategory for all new products
  const normalizedNewProducts = rawNewProducts.map((p) => ({
    ...p,
    category: { id: 'cat-2', name: 'Clothing', slug: 'clothing' },
    subcategory: 'aawari-short-kurti'
  }));

  // 5) Restore original products in memory and compute new IDs
  let maxId = 0;
  for (const prod of existingProducts) {
    const idNum = parseInt(prod.id, 10);
    if (!Number.isNaN(idNum)) maxId = Math.max(maxId, idNum);
  }

  const reIdNewProducts = normalizedNewProducts.map((p) => ({
    ...p,
    id: String(++maxId)
  }));

  // 6) Merge and write final data
  const merged = [...existingProducts, ...reIdNewProducts];
  writeJson(dataFile, merged);

  // 7) Summary
  console.log('\n🎉 SUCCESS - AAWARI Short Kurti appended without overwriting');
  console.log(`Added: ${reIdNewProducts.length} products`);
  console.log(`Total products: ${merged.length}`);

  // Category summary
  const byCategory = merged.reduce((acc, p) => {
    const key = p.category?.name || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  console.log('\nCategories:');
  Object.entries(byCategory).forEach(([k, v]) => console.log(`  - ${k}: ${v}`));

  // Clothing subcategory summary
  const clothing = merged.filter((p) => p.category?.slug === 'clothing');
  const bySub = clothing.reduce((acc, p) => {
    const key = p.subcategory || 'no-subcategory';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  console.log('\nClothing subcategories:');
  Object.entries(bySub).forEach(([k, v]) => console.log(`  - ${k}: ${v}`));

  console.log('\n✅ All existing products preserved.');
})();
