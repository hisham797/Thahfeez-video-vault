import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Get total registrations
    const totalRegistrations = await db.collection('registrations').countDocuments();
    const acceptedRegistrations = await db.collection('registrations').countDocuments({ status: 'approved' });
    const pendingRegistrations = await db.collection('registrations').countDocuments({ status: 'pending' });
    const rejectedRegistrations = await db.collection('registrations').countDocuments({ status: 'rejected' });
    
    // Get today's registrations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRegistrations = await db.collection('registrations').countDocuments({
      createdAt: { $gte: today }
    });

    // Get total messages
    const totalMessages = await db.collection('messages').countDocuments();
    const unreadMessages = await db.collection('messages').countDocuments({ read: false });

    // Get total videos
    const totalVideos = await db.collection('videos').countDocuments();
    const featuredVideos = await db.collection('videos').countDocuments({ featured: true });

    // Get recent registrations
    const recentRegistrations = await db.collection('registrations')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Format recent registrations
    const formattedRegistrations = recentRegistrations.map(registration => ({
      _id: registration._id.toString(),
      name: registration.name,
      email: registration.email,
      organization: registration.organization,
      status: registration.status,
      createdAt: registration.createdAt
    }));

    return NextResponse.json({
      registrations: {
        total: totalRegistrations,
        accepted: acceptedRegistrations,
        pending: pendingRegistrations,
        rejected: rejectedRegistrations,
        today: todayRegistrations
      },
      messages: {
        total: totalMessages,
        unread: unreadMessages
      },
      videos: {
        total: totalVideos,
        featured: featuredVideos
      },
      recentRegistrations: formattedRegistrations
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
} 