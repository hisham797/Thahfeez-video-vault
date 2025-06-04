import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type RouteSegment = {
  id: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteSegment> }
): Promise<NextResponse> {
  try {
    const { db } = await connectToDatabase();
    const { id: videoId } = await params;

    // Validate video ID
    if (!ObjectId.isValid(videoId)) {
      return NextResponse.json(
        { error: 'Invalid video ID' },
        { status: 400 }
      );
    }

    // Find the video in the database
    const video = await db.collection('videos').findOne(
      { _id: new ObjectId(videoId) },
      { projection: { videoUrl: 1, _id: 0 } }
    );

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    if (!video.videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is missing' },
        { status: 404 }
      );
    }

    // Return the video URL
    return NextResponse.json({
      url: video.videoUrl
    });

  } catch (error) {
    console.error('Error streaming video:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        return NextResponse.json(
          { error: 'Database connection failed' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to process video request' },
      { status: 500 }
    );
  }
} 