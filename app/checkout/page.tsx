'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';

interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState<CustomerDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const total = cart.reduce((sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 0);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails((d) => ({ ...d, [name]: value }));
  };

  const validate = (): boolean => {
    const required = ['firstName','lastName','email','phone','address','city','state','pincode'];
    for (const key of required) {
      // @ts-ignore
      if (!details[key]) return false;
    }
    return true;
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    if (!validate()) {
      toast.error('Please fill all required fields');
      return;
    }
    setIsLoading(true);
    try {
      console.log('Creating order with amount:', total);
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, currency: 'INR', receipt: `order_${Date.now()}` }),
      });
      const data = await res.json();
      console.log('Order creation response:', data);
      if (!data.success) throw new Error('Order creation failed');

      console.log('Razorpay key:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'SRIJAN - Handicrafts Store',
        description: 'Order Payment',
        image: '/logo.jpeg',
        order_id: data.order.id,
        handler: async (response: any) => {
          console.log('Payment response:', response);
          const verify = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: { customerDetails: details, products: cart, totalAmount: total },
            }),
          });
          const ok = await verify.json();
          if (ok.success) {
            toast.success('Payment successful');
            clearCart();
            router.push('/success');
          } else {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: `${details.firstName} ${details.lastName}`,
          email: details.email,
          contact: details.phone,
        },
        notes: {
          address: `${details.address}, ${details.city}, ${details.state} - ${details.pincode}, ${details.country}`,
        },
        theme: { color: '#D97706' },
      };

      // Ensure script is loaded
      if (typeof (window as any).Razorpay === 'undefined') {
        console.log('Loading Razorpay script...');
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = resolve as any;
          s.onerror = reject as any;
          document.body.appendChild(s);
        });
        console.log('Razorpay script loaded');
      }
      
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        throw new Error('Razorpay key not configured');
      }
      
      console.log('Opening Razorpay checkout...');
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error('Failed to initiate payment');
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <button className="btn-primary" onClick={() => router.push('/products')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <form className="card p-6 space-y-4" onSubmit={handlePay}>
          <h2 className="text-xl font-semibold">Shipping Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name *</label>
              <input className="input" name="firstName" value={details.firstName} onChange={onChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name *</label>
              <input className="input" name="lastName" value={details.lastName} onChange={onChange} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input type="email" className="input" name="email" value={details.email} onChange={onChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone *</label>
              <input className="input" name="phone" value={details.phone} onChange={onChange} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address *</label>
            <textarea className="input h-24 resize-none" name="address" value={details.address} onChange={onChange} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City *</label>
              <input className="input" name="city" value={details.city} onChange={onChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">State *</label>
              <input className="input" name="state" value={details.state} onChange={onChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Pincode *</label>
              <input className="input" name="pincode" value={details.pincode} onChange={onChange} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <select className="input" name="country" value={details.country} onChange={onChange}>
              <option value="India">India</option>
            </select>
          </div>
          <button className="btn-primary w-full py-3 text-lg" disabled={isLoading}>
            {isLoading ? 'Processing…' : `Pay ₹${total.toFixed(2)}`}
          </button>
        </form>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize || 'na'}`} className="flex items-center gap-3">
                <img src={item.product.images[0]?.url || '/placeholder-product.jpg'} alt={item.product.title} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.product.title}</div>
                  <div className="text-xs text-gray-600">Qty: {item.quantity}{item.selectedSize ? ` • Size: ${item.selectedSize}` : ''}</div>
                </div>
                <div className="font-semibold text-sm">₹{((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}




