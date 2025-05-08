import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

const TOTAL_SEATS = 100;

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Count total registrations
    const totalRegistrations = await db.collection('registrations').countDocuments();
    
    // Calculate remaining seats
    const remainingSeats = Math.max(0, TOTAL_SEATS - totalRegistrations);

    return NextResponse.json({
      total: TOTAL_SEATS,
      registered: totalRegistrations,
      remaining: remainingSeats
    });
  } catch (error) {
    console.error('Error counting registrations:', error);
    return NextResponse.json(
      { error: 'Failed to get registration count' },
      { status: 500 }
    );
  }
} 