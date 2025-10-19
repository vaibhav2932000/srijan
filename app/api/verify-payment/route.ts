import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { adminDb } from '@/lib/firebaseAdmin';

const ordersFile = path.join(process.cwd(), 'data', 'orders.json');

async function ensureOrdersFile() {
  try {
    await fs.access(ordersFile);
  } catch {
    await fs.mkdir(path.dirname(ordersFile), { recursive: true });
    await fs.writeFile(ordersFile, JSON.stringify([]), 'utf-8');
  }
}

export async function POST(request: Request) {
  try {
    console.log('Verify payment API called');
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = await request.json();
    console.log('Payment verification data:', { razorpay_order_id, razorpay_payment_id, razorpay_signature: razorpay_signature ? 'present' : 'missing' });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('Missing payment details');
      return NextResponse.json({ success: false, error: 'Missing payment details' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET as string;
    if (!keySecret) {
      console.error('RAZORPAY_KEY_SECRET not configured');
      return NextResponse.json({ success: false, error: 'Payment verification not configured' }, { status: 500 });
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    console.log('Signature verification:', { generated: generatedSignature, received: razorpay_signature });
    const isAuthentic = generatedSignature === razorpay_signature;
    if (!isAuthentic) {
      console.error('Invalid signature');
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    const toSave = {
      id: `ord_${Date.now()}`,
      razorpay_order_id,
      razorpay_payment_id,
      amount: orderData?.totalAmount ?? null,
      customer: orderData?.customerDetails ?? null,
      items: orderData?.products ?? [],
      status: 'paid',
      createdAt: new Date().toISOString(),
    };

    // Try Firestore first; if not configured, fallback to JSON file
    try {
      await adminDb.collection('orders').doc(toSave.id).set(toSave, { merge: true });
    } catch (_e) {
      await ensureOrdersFile();
      const existing = JSON.parse(await fs.readFile(ordersFile, 'utf-8')) as any[];
      existing.unshift(toSave);
      await fs.writeFile(ordersFile, JSON.stringify(existing, null, 2), 'utf-8');
    }

    return NextResponse.json({ success: true, order: toSave });
  } catch (error) {
    console.error('verify-payment error', error);
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }
}




