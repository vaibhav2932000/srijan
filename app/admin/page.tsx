'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.replace('/login?next=/admin');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <div className="container-custom py-16">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="container-custom py-16">Access denied. Admin access required.</div>;
  }

  return <AdminDashboard />;
}
