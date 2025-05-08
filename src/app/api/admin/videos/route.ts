import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Get all videos from the database
    const videos = await db.collection('videos')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Format the videos for the response
    const formattedVideos = videos.map(video => ({
      _id: video._id.toString(),
      title: video.title,
      description: video.description,
      category: video.category,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      duration: video.duration,
      featured: video.featured || false,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt
    }));

    return NextResponse.json(formattedVideos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const videoData = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'videoUrl'];
    const missingFields = requiredFields.filter(field => !videoData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Add timestamps
    const videoWithTimestamps = {
      ...videoData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert the video
    const result = await db.collection('videos').insertOne(videoWithTimestamps);

    if (!result.acknowledged) {
      throw new Error('Failed to create video');
    }

    return NextResponse.json({
      message: 'Video created successfully',
      videoId: result.insertedId.toString()
    });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
} 