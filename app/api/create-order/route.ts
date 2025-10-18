import { NextResponse } from 'next/server';
import { razorpayInstance as razorpay } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    if (!razorpay) {
      return NextResponse.json({ success: false, error: 'Payment service not configured' }, { status: 500 });
    }

    const body = await request.json();
    const amount = Number(body.amount);
    const currency = (body.currency || 'INR') as string;
    const receipt = (body.receipt || `order_${Date.now()}`) as string;

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency,
      receipt,
      payment_capture: true,
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('create-order error', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}




