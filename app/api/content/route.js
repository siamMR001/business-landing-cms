import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const content = await Content.find({});
    
    // Convert array to object mapping sections to data
    const contentMap = content.reduce((acc, item) => {
      acc[item.section] = item.data;
      return acc;
    }, {});
    
    return NextResponse.json({ success: true, data: contentMap });
  } catch (error) {
    console.error('Fetch content error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(request) {
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
    const body = await request.json();
    
    // Body should be an object with section keys and data values
    for (const [section, data] of Object.entries(body)) {
      await Content.findOneAndUpdate(
        { section },
        { section, data },
        { upsert: true, new: true }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Content updated successfully' });
  } catch (error) {
    console.error('Update content error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update content' }, { status: 500 });
  }
}
