'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SimpleAdminPromotePage() {
  const [userId, setUserId] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !adminKey) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, adminKey }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('User promoted to admin successfully');
        setUserId('');
        setAdminKey('');
      } else {
        toast.error(data.error || 'Failed to promote user');
      }
    } catch (error) {
      toast.error('Network error: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-16">
      <div className="max-w-md mx-auto card p-8">
        <h1 className="text-2xl font-bold mb-6">Promote User to Admin</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Quick Test:</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <div><strong>Your UID:</strong> Ws1BDHknKjSlPSAiEBq8gZjjbG13</div>
            <div><strong>Admin Key:</strong> admin123</div>
          </div>
        </div>

        <form onSubmit={handlePromote} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">User ID (Firebase UID)</label>
            <input
              className="input w-full"
              type="text"
              placeholder="Enter Firebase UID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Admin Key</label>
            <input
              className="input w-full"
              type="password"
              placeholder="Enter admin promotion key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              required
            />
          </div>
          
          <button
            className="btn-primary w-full"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Promoting...' : 'Promote to Admin'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/admin" className="text-blue-600 hover:text-blue-800">
            ← Back to Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
