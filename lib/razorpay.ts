import Razorpay from 'razorpay';

// Only initialize Razorpay if we have the required keys
let razorpay: Razorpay | null = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('Razorpay initialized successfully');
  } catch (error) {
    console.warn('Razorpay initialization failed:', error);
    razorpay = null;
  }
} else {
  console.warn('Razorpay environment variables not found');
}

// Create a mock Razorpay instance for development/testing
const mockRazorpay = {
  orders: {
    create: async (orderData: any) => {
      console.log('Mock Razorpay order creation:', orderData);
      return {
        id: `order_${Date.now()}`,
        amount: orderData.amount,
        currency: orderData.currency,
        receipt: orderData.receipt,
        status: 'created',
        created_at: Date.now(),
      };
    },
  },
};

export const razorpayInstance = razorpay || mockRazorpay;

export const razorpayUiConfig = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  currency: 'INR',
  name: 'SRIJAN - Handicrafts Store',
  description: 'Traditional Indian Handicrafts',
  image: '/logo.jpeg',
  theme: { color: '#D97706' },
};




