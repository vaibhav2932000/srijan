import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            href="/"
            className="text-earth-brown/60 hover:text-saffron transition-colors flex items-center gap-1"
          >
            <FiHome className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              <FiChevronRight className="w-4 h-4 text-gray-400" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-earth-brown/60 hover:text-saffron transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-earth-brown font-medium">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

