'use client';
import { useRef } from 'react';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
  const scroller = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dx: number) => {
    scroller.current?.scrollBy({ left: dx, behavior: 'smooth' });
  };

  return (
    <section className="py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-neutral-900">{title}</h2>
          <div className="hidden sm:flex items-center gap-2" aria-hidden="true">
            <button className="w-9 h-9 rounded-full border border-gray-300 hover:bg-gray-100" onClick={() => scrollBy(-320)} aria-label="Previous">‹</button>
            <button className="w-9 h-9 rounded-full border border-gray-300 hover:bg-gray-100" onClick={() => scrollBy(320)} aria-label="Next">›</button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scroller}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-thin"
            role="region"
            aria-label={`${title} carousel`}
          >
            {products.map((p) => (
              <div key={p.id} className="snap-start shrink-0 w-[280px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


