import Razorpay from 'razorpay';

// Only initialize Razorpay if we have the required keys
let razorpay: Razorpay | null = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (error) {
    console.warn('Razorpay initialization failed:', error);
    razorpay = null;
  }
} else {
  console.warn('Razorpay environment variables not found');
}

export { razorpay };

export const razorpayUiConfig = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  currency: 'INR',
  name: 'SRIJAN - Handicrafts Store',
  description: 'Traditional Indian Handicrafts',
  image: '/logo.jpeg',
  theme: { color: '#D97706' },
};




