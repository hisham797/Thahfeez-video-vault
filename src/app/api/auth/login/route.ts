import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { comparePasswords } from '@/lib/auth';

// Admin credentials
const ADMIN_EMAIL = 'shaz80170@gmail.com';
const ADMIN_PASSWORD = '871459';

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check for admin login first
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        user: {
          email: ADMIN_EMAIL,
          role: 'admin',
          isRegistered: true
        }
      });
    }

    // Find user by email
    const user = await db.collection('registrations').findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare passwords
    const isValidPassword = await comparePasswords(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
} 