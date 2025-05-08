import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db('thahfeez');
    const videosCollection = db.collection('videos');

    // Fetch all videos
    const videos = await videosCollection.find({}).toArray();

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
} 