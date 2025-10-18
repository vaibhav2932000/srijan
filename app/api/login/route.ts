import { NextResponse } from 'next/server';

// Mock users for development
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

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check for fixed admin credentials first
    if (email === 'vaibhav' && password === 'srijan') {
      const adminUser = {
        id: 'admin-fixed',
        email: 'vaibhav',
        name: 'Vaibhav',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      
      const token = `admin_token_${Date.now()}`;
      const response = NextResponse.json({ user: adminUser });

      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    // Mock login logic - accept any password for demo users
    const user = MOCK_USERS.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    
    // For demo purposes, accept any password with at least 3 characters
    if (password.length < 3) {
      return NextResponse.json({ error: 'Password must be at least 3 characters' }, { status: 401 });
    }

    // Generate a mock token
    const token = `mock_token_${user.id}_${Date.now()}`;
    
    const response = NextResponse.json({ user });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}


