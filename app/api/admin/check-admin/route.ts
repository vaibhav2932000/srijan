import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const usersFile = path.join(process.cwd(), 'data', 'users.json');

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ isAdmin: false });
    }

    try {
      const raw = await fs.readFile(usersFile, 'utf-8');
      const users = JSON.parse(raw);
      const user = users.find((u: any) => u.id === userId);
      
      return NextResponse.json({ isAdmin: user?.role === 'admin' });
    } catch {
      return NextResponse.json({ isAdmin: false });
    }
  } catch (error) {
    return NextResponse.json({ isAdmin: false });
  }
}
