import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    let orders: any[] = [];

    // Try Firestore
    try {
      const snap = await adminDb.collection('orders').orderBy('createdAt', 'desc').get();
      orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch {
      // Fallback: JSON file
      const ordersFile = path.join(process.cwd(), 'data', 'orders.json');
      try {
        const raw = await fs.readFile(ordersFile, 'utf-8');
        orders = JSON.parse(raw);
      } catch {
        orders = [];
      }
    }

    const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    const productSales = new Map<string, { productId: string; productName: string; sales: number; revenue: number }>();
    for (const order of orders) {
      for (const item of order.items || []) {
        const key = item.product?.id || item.productId || item.id || 'unknown';
        const name = item.product?.title || item.productName || 'Unknown';
        const price = item.product?.salePrice || item.product?.price || item.price || 0;
        const quantity = item.quantity || 1;
        const prev = productSales.get(key) || { productId: key, productName: name, sales: 0, revenue: 0 };
        prev.sales += quantity;
        prev.revenue += price * quantity;
        productSales.set(key, prev);
      }
    }

    const topSellingProducts = Array.from(productSales.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

    const monthlyMap = new Map<string, { month: string; revenue: number; orders: number }>();
    for (const order of orders) {
      const month = (order.createdAt || new Date().toISOString()).slice(0, 7);
      const prev = monthlyMap.get(month) || { month, revenue: 0, orders: 0 };
      prev.revenue += order.amount || 0;
      prev.orders += 1;
      monthlyMap.set(month, prev);
    }
    const monthlySales = Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month));

    return NextResponse.json({ totalRevenue, totalOrders, averageOrderValue, topSellingProducts, monthlySales });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to compute analytics' }, { status: 500 });
  }
}
