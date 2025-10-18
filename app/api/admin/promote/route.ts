import { NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const { userId, adminKey } = await request.json();

    // Simple admin key check (you should use a more secure method in production)
    if (adminKey !== process.env.ADMIN_PROMOTION_KEY) {
      return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Update user role to admin
    await updateDoc(doc(db, 'users', userId), {
      role: 'admin',
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'User promoted to admin' });
  } catch (error) {
    console.error('Error promoting user:', error);
    return NextResponse.json({ error: 'Failed to promote user' }, { status: 500 });
  }
}
