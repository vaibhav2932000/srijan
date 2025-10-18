import { redirect } from 'next/navigation';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Redirect to products page with category filter
  redirect(`/products?category=${params.slug}`);
}

