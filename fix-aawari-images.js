#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function isValidHttpUrl(url) {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return false;
  // basic invalid token guard (CSV artifacts like image_size:"})
  if (/image_size/i.test(trimmed)) return false;
  return true;
}

(function main() {
  const dataFile = path.join(process.cwd(), 'data', 'sample-products.json');
  if (!fs.existsSync(dataFile)) {
    console.error('❌ data/sample-products.json not found');
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  let touched = 0;

  const cleaned = products.map((p) => {
    if (p?.category?.slug !== 'clothing' || p?.subcategory !== 'aawari-short-kurti') return p;

    const originalImages = Array.isArray(p.images) ? p.images : [];
    const filtered = originalImages
      .map((img) => (img && img.url ? { ...img, url: String(img.url).trim() } : img))
      .filter((img) => img && isValidHttpUrl(img.url));

    // de-duplicate by url
    const seen = new Set();
    const deduped = [];
    for (const img of filtered) {
      if (!seen.has(img.url)) {
        seen.add(img.url);
        deduped.push(img);
      }
    }

    let finalImages = deduped;
    if (finalImages.length === 0) {
      finalImages = [
        {
          id: `${p.id}-1`,
          url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
          alt: p.title,
          position: 0,
        },
      ];
    } else {
      // normalize positions
      finalImages = finalImages.map((img, idx) => ({ ...img, position: idx }));
    }

    if (finalImages.length !== originalImages.length) {
      touched++;
      return { ...p, images: finalImages };
    }
    // Even if counts same, ensure no invalid leftovers
    const hadInvalid = originalImages.some((img) => !img || !isValidHttpUrl(img.url));
    if (hadInvalid) {
      touched++;
      return { ...p, images: finalImages };
    }
    return p;
  });

  fs.writeFileSync(dataFile, JSON.stringify(cleaned, null, 2));
  console.log(`✅ Cleaned image URLs for aawari-short-kurti. Products updated: ${touched}`);
})();
