import { NextResponse } from 'next/server';
import { razorpayInstance as razorpay } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    console.log('Create order API called');
    
    if (!razorpay) {
      console.error('Razorpay not initialized');
      return NextResponse.json({ success: false, error: 'Payment service not configured' }, { status: 500 });
    }

    const body = await request.json();
    console.log('Request body:', body);
    
    const amount = Number(body.amount);
    const currency = (body.currency || 'INR') as string;
    const receipt = (body.receipt || `order_${Date.now()}`) as string;

    if (!amount || amount <= 0) {
      console.error('Invalid amount:', amount);
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 });
    }

    console.log('Creating Razorpay order with:', { amount: Math.round(amount * 100), currency, receipt });
    
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency,
      receipt,
      payment_capture: true,
    });

    console.log('Order created successfully:', order);
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('create-order error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create order' 
    }, { status: 500 });
  }
}




