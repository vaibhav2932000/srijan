'use client';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/store';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiCreditCard } from 'react-icons/fi';
import Image from 'next/image';

interface CartModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CartModal({ open, onClose }: CartModalProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { cart, removeFromCart, updateQuantity } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsLoading(true);
    try {
      window.location.href = '/checkout';
    } finally {
      setIsLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" aria-live="polite">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-6 overflow-y-auto flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-earth-brown">Your Cart</h3>
          <button 
            onClick={onClose} 
            className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700" 
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
              <button
                onClick={onClose}
                className="mt-4 bg-saffron text-white px-6 py-2 rounded-lg hover:bg-saffron/90 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize || 'no-size'}`} className="flex gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={item.product.images?.[0]?.url || '/placeholder-product.jpg'}
                        alt={item.product.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-earth-brown truncate">
                        {item.product.title}
                      </h4>
                      {item.selectedSize && (
                        <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                      )}
                      <p className="text-sm font-semibold text-saffron">
                        ₹{item.product.price}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                          className="p-1 rounded hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                          className="p-1 rounded hover:bg-red-100 text-red-500 ml-auto"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-earth-brown">Total:</span>
                <span className="text-xl font-bold text-saffron">₹{total.toFixed(2)}</span>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-saffron text-white py-3 px-6 rounded-lg font-semibold hover:bg-saffron/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FiCreditCard className="w-5 h-5" />
                    Proceed to Checkout
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


