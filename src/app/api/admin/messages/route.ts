import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Get all messages from the database
    const messages = await db.collection('messages')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Format the messages for the response
    const formattedMessages = messages.map(message => ({
      _id: message._id.toString(),
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      read: message.read || false,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const messageData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
    const missingFields = requiredFields.filter(field => !messageData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Add timestamps
    const messageWithTimestamps = {
      ...messageData,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert the message
    const result = await db.collection('messages').insertOne(messageWithTimestamps);

    if (!result.acknowledged) {
      throw new Error('Failed to create message');
    }

    return NextResponse.json({
      message: 'Message sent successfully',
      messageId: result.insertedId
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const { id, read } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    const result = await db.collection('messages').updateOne(
      { _id: id },
      { 
        $set: { 
          read,
          updatedAt: new Date()
        }
      }
    );

    if (!result.acknowledged) {
      throw new Error('Failed to update message');
    }

    return NextResponse.json({
      message: 'Message updated successfully'
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    const result = await db.collection('messages').deleteOne({ _id: id });

    if (!result.acknowledged) {
      throw new Error('Failed to delete message');
    }

    return NextResponse.json({
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
} 