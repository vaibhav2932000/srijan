const fs = require('fs');
const path = require('path');

// Read the current products
const productsPath = path.join(__dirname, '../data/sample-products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Aawari SKU patterns to identify Aawari products
const aawariPatterns = [
  'FKD', 'AM', 'PBG', 'CO-ORDS', 'AFKD', 'KT', 'ASD', 'SCD'
];

// Function to extract base SKU (remove size suffix)
function getBaseSku(sku) {
  // Remove size suffixes like -M, -L, -XL, -XXL
  return sku.replace(/-(M|L|XL|XXL)$/, '');
}

// Function to extract size from SKU
function getSizeFromSku(sku) {
  const match = sku.match(/-(M|L|XL|XXL)$/);
  return match ? match[1] : null;
}

// Group Aawari products by base SKU
const aawariProducts = products.filter(product => 
  aawariPatterns.some(pattern => 
    product.sku && product.sku.startsWith(pattern)
  )
);

const groupedProducts = {};
aawariProducts.forEach(product => {
  const baseSku = getBaseSku(product.sku);
  if (!groupedProducts[baseSku]) {
    groupedProducts[baseSku] = [];
  }
  groupedProducts[baseSku].push(product);
});

console.log(`Found ${aawariProducts.length} Aawari products`);
console.log(`Grouped into ${Object.keys(groupedProducts).length} base products`);

// Create consolidated products
const consolidatedProducts = [];
const productsToRemove = [];

Object.entries(groupedProducts).forEach(([baseSku, variants]) => {
  if (variants.length === 1) {
    // Single variant, keep as is
    consolidatedProducts.push(variants[0]);
  } else {
    // Multiple variants, consolidate
    const mainProduct = variants[0]; // Use first variant as base
    const sizes = variants.map(v => getSizeFromSku(v.sku)).filter(Boolean);
    
    // Update the main product with size information
    const consolidatedProduct = {
      ...mainProduct,
      sku: baseSku, // Use base SKU without size suffix
      sizes: sizes.length > 0 ? sizes : ['M', 'L', 'XL', 'XXL'], // Default sizes if none found
      // Add size variants information
      sizeVariants: variants.map(v => ({
        size: getSizeFromSku(v.sku),
        sku: v.sku,
        stock: v.stock,
        inStock: v.inStock
      }))
    };
    
    consolidatedProducts.push(consolidatedProduct);
    
    // Mark all variants for removal
    variants.forEach(variant => {
      productsToRemove.push(variant.id);
    });
  }
});

// Remove the old products and add consolidated ones
const nonAawariProducts = products.filter(product => 
  !aawariPatterns.some(pattern => 
    product.sku && product.sku.startsWith(pattern)
  )
);

const finalProducts = [...nonAawariProducts, ...consolidatedProducts];

// Write back to file
fs.writeFileSync(productsPath, JSON.stringify(finalProducts, null, 2));

console.log(`✅ Successfully consolidated Aawari products`);
console.log(`📊 Original Aawari products: ${aawariProducts.length}`);
console.log(`📊 Consolidated products: ${consolidatedProducts.length}`);
console.log(`📊 Products removed: ${productsToRemove.length}`);
console.log(`📊 Total products now: ${finalProducts.length}`);

// Show some examples
console.log(`\n📝 Examples of consolidated products:`);
Object.entries(groupedProducts).slice(0, 3).forEach(([baseSku, variants]) => {
  if (variants.length > 1) {
    const sizes = variants.map(v => getSizeFromSku(v.sku)).filter(Boolean);
    console.log(`   - ${baseSku}: ${sizes.join(', ')} (${variants.length} variants → 1 product)`);
  }
});






