import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  title?: string;
  products: Product[];
}

export default function ProductGrid({ title, products }: ProductGridProps) {
  return (
    <section className="py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {title && <h2 className="text-3xl font-cormorant font-semibold text-terracotta-deep heading-underline mb-6">{title}</h2>}
        {/* Asymmetrical, gallery-like layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]"><div className="[&>*]:mb-4">
          {products.map((p, idx) => (
            <div key={p.id} className="break-inside-avoid">
              <ProductCard product={p} />
            </div>
          ))}
        </div></div>
      </div>
    </section>
  );
}


