'use client';
import Image from 'next/image';

export default function Lightbox({ images, index, onClose }:{ images: { url: string; alt: string }[]; index: number; onClose: ()=>void }) {
  if (!images.length) return null;
  const img = images[index];
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-4">
        <Image src={img.url} alt={img.alt} fill className="object-contain" priority quality={100} unoptimized />
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl">×</button>
      </div>
    </div>
  );
}


