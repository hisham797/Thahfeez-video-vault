import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['email', 'phone', 'eventType', 'attendees', 'password', 'fullName'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.collection('registrations').findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already registered' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(data.password);

    // Create registration document
    const registration = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      eventType: data.eventType,
      attendees: data.attendees,
      specialRequirements: data.specialRequirements || '',
      dietaryRestrictions: data.dietaryRestrictions || '',
      subscribe: data.subscribe || false,
      password: hashedPassword,
      createdAt: new Date(),
      status: 'pending',
      ticketType: 'standard',
      role: 'user'
    };

    // Insert into database
    await db.collection('registrations').insertOne(registration);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = registration;

    return NextResponse.json({
      message: 'Registration successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const registrations = await db.collection('registrations')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Remove sensitive data
    const safeRegistrations = registrations.map(({ password, ...rest }) => rest);

    return NextResponse.json({
      success: true,
      registrations: safeRegistrations
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
} 