import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Mock users (same as in login route)
const MOCK_USERS = [
  {
    id: 'user-1',
    email: 'demo@example.com',
    name: 'Demo User',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    role: 'customer',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    email: 'admin@example.com',
    name: 'Admin User',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-3',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    role: 'customer',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const token = cookies().get('auth_token')?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 401 });

    // Parse user ID from mock token
    const userId = token.replace('mock_token_', '').split('_')[0];
    const user = MOCK_USERS.find(u => u.id === userId);
    
    if (!user) return NextResponse.json({ user: null }, { status: 401 });
    
    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}


