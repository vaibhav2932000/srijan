import { NextRequest, NextResponse } from 'next/server';
import { mockApi } from '@/lib/mock-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await mockApi.getProduct(params.id);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
}
