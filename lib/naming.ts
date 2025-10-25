const roots = [
  'Aaranya', 'Anvi', 'Avani', 'Dhara', 'Ira', 'Ishya', 'Kalp', 'Kashvi', 'Mahika', 'Mrinal', 'Nayra', 'Nitya', 'Prakriti', 'Prisha', 'Raina', 'Saanvi', 'Saisha', 'Saraansh', 'Shloka', 'Siya', 'Tara', 'Tvesa', 'Vanya', 'Vasudha', 'Vedika', 'Yamini'
];

const descriptors = [
  'Heritage Kurti', 'Handloom Kurta', 'Blockprint Kurti', 'Mulmul Kurti', 'Chanderi Kurta', 'Ajrakh Kurti', 'Kalamkari Kurti', 'Indigo Kurta', 'Ikai Kurti', 'Linen Kurta', 'Khadi Kurti', 'Festive Kurta', 'Everyday Kurti', 'Monsoon Kurti', 'Morning Kurti', 'Evening Kurta', 'Saffron Kurti', 'Peacock Kurta', 'Terracotta Kurti', 'Ivory Kurta'
];

const motifs = [
  'Peacock', 'Paisley', 'Lotus', 'Mogra', 'Genda', 'Gul', 'Neel', 'Surya', 'Chand', 'Gulal', 'Neembhu', 'Anar', 'Madhu', 'Vriksh', 'Megh', 'Kesar', 'Gulab'
];

export function generateIndianKurtiName(seed: string | number = ''): string {
  const base = typeof seed === 'number' ? seed : Array.from(String(seed)).reduce((a, c) => a + c.charCodeAt(0), 0);
  const r1 = roots[base % roots.length];
  const r2 = descriptors[(base * 7) % descriptors.length];
  const r3 = motifs[(base * 13) % motifs.length];
  return `${r1} ${r3} ${r2}`;
}

export function displayTitle(original: string, categorySlug?: string, id?: string | number): string {
  // Always return the original title as we now have proper Indian names in the data
  return original;
}


