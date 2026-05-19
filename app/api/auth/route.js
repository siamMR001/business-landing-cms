import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
    
    if (username === adminUsername && password === adminPassword) {
      const token = signToken({ username });
      return NextResponse.json({ success: true, token });
    }
    
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
