'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheckCircle, FiShoppingBag } from 'react-icons/fi';

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('session_id');
    setSessionId(id);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron/5 to-earth-brown/5 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-earth-brown mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {sessionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Session ID:</p>
            <p className="font-mono text-xs text-gray-800 break-all">
              {sessionId}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push('/products')}
            className="w-full bg-saffron text-white py-3 px-6 rounded-lg font-semibold hover:bg-saffron/90 transition-colors flex items-center justify-center gap-2"
          >
            <FiShoppingBag className="w-5 h-5" />
            Continue Shopping
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            You will receive an email confirmation shortly.
          </p>
        </div>
      </div>
    </div>
  );
}