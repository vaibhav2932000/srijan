"use client";

import { useState } from 'react';
import Papa from 'papaparse';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

type CSVRow = Record<string, string>;

export default function AdminUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [importing, setImporting] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const parseAndImport = async () => {
    if (!file) return;
    setImporting(true);
    setStatus('Parsing CSV…');

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (res) => {
        try {
          let imported = 0;
          for (const row of res.data) {
            const images = (row['Image Src'] || '').split(',').map((s) => s.trim()).filter(Boolean);
            const tags = (row['Tags'] || '').split(',').map((s) => s.trim()).filter(Boolean);

            const product = {
              title: row['Name'] || '',
              slug: (row['Name'] || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
              shortDescription: row['Short description'] || '',
              description: row['Description'] || '',
              price: Number(row['Regular price'] || 0),
              salePrice: row['Sale price'] ? Number(row['Sale price']) : undefined,
              sku: row['Variant SKU'] || '',
              stock: Number(row['Stock'] || 0),
              inStock: String(row['In stock?'] || '').toLowerCase() === 'true',
              images: images.map((url, idx) => ({ id: `${idx}`, url, alt: row['Name'] || '', position: idx })),
              category: { id: '', name: row['Category'] || 'uncategorized', slug: (row['Category'] || 'uncategorized').toLowerCase().replace(/\s+/g, '-') },
              tags,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            } as any;

            await addDoc(collection(db, 'products'), product);
            imported++;
            if (imported % 25 === 0) setStatus(`Imported ${imported} products…`);
          }
          setStatus(`Import complete: ${res.data.length} rows processed.`);
        } catch (e) {
          setStatus('Import failed. Check console.');
          // eslint-disable-next-line no-console
          console.error(e);
        } finally {
          setImporting(false);
        }
      },
      error: () => {
        setStatus('Failed to parse CSV');
        setImporting(false);
      },
    });
  };

  return (
    <div className="container-custom py-10 space-y-6">
      <h1 className="text-2xl font-bold">CSV Import to Firestore</h1>
      <input type="file" accept=".csv" onChange={handleFile} className="block" />
      <button className="btn-primary" onClick={parseAndImport} disabled={!file || importing}>
        {importing ? 'Importing…' : 'Import'}
      </button>
      {status && <div className="text-sm text-gray-700">{status}</div>}
      <p className="text-xs text-gray-500">Expected columns: Name, Short description, Description, Regular price, Sale price, Variant SKU, Stock, In stock?, Image Src, Tags, Category</p>
    </div>
  );
}


