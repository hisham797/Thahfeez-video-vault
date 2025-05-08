import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Get all registrations from the registrations collection
    const registrations = await db.collection('registrations')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Format the registrations for the response
    const formattedRegistrations = registrations.map(registration => ({
      _id: registration._id.toString(),
      name: registration.name,
      email: registration.email,
      phone: registration.phone,
      organization: registration.organization,
      status: registration.status || 'pending',
      createdAt: registration.createdAt,
      updatedAt: registration.updatedAt,
      ticketType: registration.ticketType,
      additionalInfo: registration.additionalInfo
    }));

    return NextResponse.json(formattedRegistrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const registrationData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'organization'];
    const missingFields = requiredFields.filter(field => !registrationData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Add timestamps and default status
    const registrationWithTimestamps = {
      ...registrationData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert the registration
    const result = await db.collection('registrations').insertOne(registrationWithTimestamps);

    if (!result.acknowledged) {
      throw new Error('Failed to create registration');
    }

    return NextResponse.json({
      message: 'Registration submitted successfully',
      registrationId: result.insertedId
    });
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json(
      { error: 'Failed to submit registration' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Registration ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const result = await db.collection('registrations').updateOne(
      { _id: id },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      }
    );

    if (!result.acknowledged) {
      throw new Error('Failed to update registration');
    }

    return NextResponse.json({
      message: 'Registration updated successfully'
    });
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    );
  }
} 