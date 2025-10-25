const fs = require('fs');
const path = require('path');

// Read the current products
const productsPath = path.join(__dirname, '../data/sample-products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Aawari SKU patterns to identify Aawari products
const aawariPatterns = [
  'FKD', 'AM', 'PBG', 'CO-ORDS', 'AFKD', 'KT', 'ASD', 'SCD'
];

let updatedCount = 0;

// Update all Aawari products
const updatedProducts = products.map(product => {
  // Check if this is an Aawari product
  const isAawari = aawariPatterns.some(pattern => 
    product.sku && product.sku.startsWith(pattern)
  );
  
  if (isAawari) {
    updatedCount++;
    return {
      ...product,
      category: {
        id: 'cat-2',
        name: 'Clothing',
        slug: 'clothing'
      },
      subcategory: 'Aawari Kurti Collection',
      tags: [
        'aawari', 
        'kurti', 
        'midi-dress', 
        'cotton', 
        'printed', 
        'women', 
        'traditional',
        'clothing',
        'ethnic-wear'
      ]
    };
  }
  
  return product;
});

// Write back to file
fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));

console.log(`✅ Successfully updated ${updatedCount} Aawari products`);
console.log(`🏷️ Category: Clothing > Aawari Kurti Collection`);
console.log(`📊 Total products: ${products.length}`);

// Verify the update
const aawariProducts = updatedProducts.filter(product => 
  aawariPatterns.some(pattern => 
    product.sku && product.sku.startsWith(pattern)
  )
);

console.log(`🔍 Verification: Found ${aawariProducts.length} Aawari products`);
console.log(`📝 Sample categories:`);
aawariProducts.slice(0, 3).forEach(product => {
  console.log(`   - ${product.sku}: ${product.category.name} > ${product.subcategory}`);
});






