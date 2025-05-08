import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const client = new MongoClient(uri);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'message'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db('thahfeez');
    const collection = db.collection('messages');

    // Add timestamp and status
    const messageData = {
      name: data.name,
      email: data.email,
      subject: data.subject || 'No Subject',
      message: data.message,
      createdAt: new Date(),
      status: 'new',
      read: false
    };

    // Insert the message
    const result = await collection.insertOne(messageData);

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully',
      messageId: result.insertedId 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function GET() {
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db('thahfeez');
    const collection = db.collection('messages');
    
    const messages = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
} 