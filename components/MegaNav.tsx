'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

interface MegaNavProps {
  categories: Array<{
    label: string;
    href: string;
    items: Array<{ label: string; href: string }>
  }>;
}

export default function MegaNav({ categories }: MegaNavProps) {
  const [open, setOpen] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  return (
    <nav aria-label="Primary" className="hidden lg:flex items-center gap-8 relative">
      {categories.map((cat) => (
        <div
          key={cat.label}
          className="relative"
          onMouseEnter={() => {
            if (cat.items.length > 0) {
              if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                setHoverTimeout(null);
              }
              setOpen(cat.label);
            }
          }}
          onMouseLeave={() => {
            if (cat.items.length > 0) {
              const timeout = setTimeout(() => setOpen(null), 150);
              setHoverTimeout(timeout);
            }
          }}
        >
          {cat.items.length > 0 ? (
            <button
              className="text-base font-semibold text-terracotta-deep hover:text-metal-gold focus-visible-ring px-2 py-2 transition-colors"
              aria-haspopup="true"
              aria-expanded={open === cat.label}
              aria-controls={`meganav-${cat.label}`}
              onClick={() => setOpen((v) => (v === cat.label ? null : cat.label))}
            >
              {cat.label}
            </button>
          ) : (
            <Link
              href={cat.href}
              className="text-base font-semibold text-terracotta-deep hover:text-metal-gold focus-visible-ring px-2 py-2 transition-colors"
            >
              {cat.label}
            </Link>
          )}

          {open === cat.label && (
            <div
              id={`meganav-${cat.label}`}
              ref={panelRef}
              role="dialog"
              aria-label={`${cat.label} menu`}
              className={`absolute left-0 top-full mt-1 bg-white border border-metal-gold/20 rounded-xl shadow-xl p-6 z-[110] ${
                cat.label === 'Clothing' 
                  ? 'w-[1200px] grid grid-cols-4 gap-4' 
                  : 'w-[900px] grid grid-cols-3 gap-6'
              }`}
              onMouseEnter={() => {
                if (hoverTimeout) {
                  clearTimeout(hoverTimeout);
                  setHoverTimeout(null);
                }
                setOpen(cat.label);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => setOpen(null), 150);
                setHoverTimeout(timeout);
              }}
            >
              {cat.items.map((item) => (
                <div key={item.href} className="space-y-2">
                  <Link 
                    href={item.href} 
                    className="block text-charcoal-text font-hind font-medium hover:text-terracotta-deep transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                  {cat.label !== 'Clothing' && cat.label !== 'Handicrafts' && (
                    <ul className="space-y-1">
                      <li>
                        <Link href={`${item.href}?tags=new-arrival`} className="text-xs text-subtle-gray hover:text-terracotta-deep font-hind">New Arrivals</Link>
                      </li>
                      <li>
                        <Link href={`${item.href}?sort=popular`} className="text-xs text-subtle-gray hover:text-terracotta-deep font-hind">Popular</Link>
                      </li>
                      <li>
                        <Link href={`${item.href}?sort=price-asc`} className="text-xs text-subtle-gray hover:text-terracotta-deep font-hind">Under ₹999</Link>
                      </li>
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}


