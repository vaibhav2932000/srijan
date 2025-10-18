import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const razorpayUiConfig = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  currency: 'INR',
  name: 'SRIJAN - Handicrafts Store',
  description: 'Traditional Indian Handicrafts',
  image: '/logo.jpeg',
  theme: { color: '#D97706' },
};




