import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const { name, email, message } = body;
    
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }
    
    const contact = await Contact.create({ name, email, message });
    
    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error('Submit contact error:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit contact form' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    // Check auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }
    
    await dbConnect();
    const submissions = await Contact.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    console.error('Fetch contacts error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch submissions' }, { status: 500 });
  }
}
