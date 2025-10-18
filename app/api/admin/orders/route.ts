import { NextResponse } from 'next/server';
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

export async function GET() {
  try {
    let orders: any[] = [];

    // Try Firestore first
    try {
      const snap = await adminDb.collection('orders').orderBy('createdAt', 'desc').get();
      orders = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    } catch {
      // Fallback: JSON file
      try {
        await ensureOrdersFile();
        const raw = await fs.readFile(ordersFile, 'utf-8');
        orders = JSON.parse(raw);
      } catch {
        orders = [];
      }
    }

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 });
    }

    // Try Firestore first
    try {
      await adminDb.collection('orders').doc(orderId).update({
        status,
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true });
    } catch {
      // Fallback: JSON file
      await ensureOrdersFile();
      const raw = await fs.readFile(ordersFile, 'utf-8');
      const orders = JSON.parse(raw);
      
      const orderIndex = orders.findIndex((o: any) => o.id === orderId);
      if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        orders[orderIndex].updatedAt = new Date().toISOString();
        await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2), 'utf-8');
        return NextResponse.json({ success: true });
      }
      
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
