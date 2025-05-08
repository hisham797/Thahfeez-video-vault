import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const registration = await db.collection('registrations').findOne({ email });

    return NextResponse.json({
      isRegistered: !!registration
    });
  } catch (error) {
    console.error('Error checking registration:', error);
    return NextResponse.json(
      { error: 'Failed to check registration status' },
      { status: 500 }
    );
  }
} 