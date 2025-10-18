'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { useStore } from '@/lib/store';

export default function AccountPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const wishlist = useStore((s) => s.wishlist);
  const [userData, setUserData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login?next=/account');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      // Load user data for Firebase users
      useAuthStore.getState().loadUserData().then((data) => {
        setUserData(data);
        setLoadingData(false);
      });
    } else {
      setLoadingData(false);
    }
  }, [user]);

  if (isLoading || !user) {
    return <div className="container-custom py-16">Loading…</div>;
  }

  return (
    <div className="container-custom py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
          <button onClick={() => useAuthStore.getState().logout()} className="btn-outline">Logout</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src={user.avatar || '/placeholder-avatar.jpg'} 
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Since</label>
                  <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/products" className="block w-full btn-outline text-center">
                  Browse Products
                </Link>
                <Link href="/products?tags=new-arrival" className="block w-full btn-outline text-center">
                  New Arrivals
                </Link>
                <Link href="/products?tags=bestseller" className="block w-full btn-outline text-center">
                  Bestsellers
                </Link>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Account Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium capitalize">{user.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Data Sections for Firebase Users */}
        {user.role !== 'admin' && (
          <div className="mt-8 space-y-8">
            {/* Favorites */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">My Favorites</h2>
              {loadingData ? (
                <p>Loading favorites...</p>
              ) : wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist.map((item) => (
                    <div key={item.productId} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.product?.images?.[0]?.url || '/placeholder-product.jpg'} 
                          alt={item.product?.title || 'Product'}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.product?.title || 'Product'}</h3>
                          <p className="text-sm text-gray-600">₹{item.product?.price || 0}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No favorites yet. <Link href="/products" className="text-blue-600 hover:underline">Browse products</Link></p>
              )}
            </div>

            {/* Purchase History */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Purchase History</h2>
              {loadingData ? (
                <p>Loading purchase history...</p>
              ) : userData?.purchaseHistory?.length > 0 ? (
                <div className="space-y-4">
                  {userData.purchaseHistory.map((order: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Order #{order.id || index + 1}</h3>
                          <p className="text-sm text-gray-600">{new Date(order.date || Date.now()).toLocaleDateString()}</p>
                          <p className="text-sm">Total: ₹{order.total || 0}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status || 'pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No purchase history yet. <Link href="/products" className="text-blue-600 hover:underline">Start shopping</Link></p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


