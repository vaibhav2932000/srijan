import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const usersFile = path.join(process.cwd(), 'data', 'users.json');

async function ensureUsersFile() {
  try {
    await fs.access(usersFile);
  } catch {
    await fs.mkdir(path.dirname(usersFile), { recursive: true });
    await fs.writeFile(usersFile, JSON.stringify([]), 'utf-8');
  }
}

export async function POST(request: Request) {
  try {
    const { userId, adminKey } = await request.json();

    // Simple admin key check
    if (adminKey !== 'admin123') {
      return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Create a local users file to track admin status
    await ensureUsersFile();
    const raw = await fs.readFile(usersFile, 'utf-8');
    const users = JSON.parse(raw);
    
    // Add or update user as admin
    const existingIndex = users.findIndex((u: any) => u.id === userId);
    const userData = {
      id: userId,
      role: 'admin',
      promotedAt: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      users[existingIndex] = { ...users[existingIndex], ...userData };
    } else {
      users.push(userData);
    }

    await fs.writeFile(usersFile, JSON.stringify(users, null, 2), 'utf-8');

    return NextResponse.json({ 
      success: true, 
      message: 'User promoted to admin successfully',
      userId 
    });
  } catch (error) {
    console.error('Error promoting user:', error);
    return NextResponse.json({ error: 'Failed to promote user' }, { status: 500 });
  }
}
