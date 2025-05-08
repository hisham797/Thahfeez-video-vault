import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    
    // Validate status first
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Validate ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid registration ID format' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const collection = db.collection('registrations');

    // Convert string ID to ObjectId
    const objectId = new ObjectId(params.id);

    // First check if the registration exists
    const registration = await collection.findOne({ _id: objectId });
    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Update the registration
    const result = await collection.updateOne(
      { _id: objectId },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      }
    );

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: 'Failed to update registration' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Registration status updated successfully',
        registration: {
          ...registration,
          status,
          updatedAt: new Date()
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update registration' },
      { status: 500 }
    );
  }
} 