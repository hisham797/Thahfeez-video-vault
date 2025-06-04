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
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid video ID format' },
        { status: 400 }
      );
    }

    // Get the video from the database
    const video = await db.collection('videos').findOne({ _id: new ObjectId(id) });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    if (!video.videoUrl) {
      return NextResponse.json(
        { error: 'Video URL not found' },
        { status: 404 }
      );
    }

    // Return the video URL and metadata
    return NextResponse.json({
      url: video.videoUrl,
      title: video.title,
      description: video.description,
      duration: video.duration,
      thumbnailUrl: video.thumbnailUrl,
      category: video.category,
      featured: video.featured
    });
  } catch (error) {
    console.error('Error fetching video preview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video preview' },
      { status: 500 }
    );
  }
} 