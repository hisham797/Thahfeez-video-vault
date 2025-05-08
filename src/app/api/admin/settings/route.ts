import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

const DEFAULT_SETTINGS = {
  siteName: 'Video Platform',
  siteDescription: 'Your video sharing platform',
  contactEmail: 'admin@example.com',
  allowRegistrations: true
};

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const settings = await db.collection('settings').findOne({}) || {};
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const settings = await request.json();

    // Validate required fields
    if (!settings.siteName || !settings.contactEmail) {
      return NextResponse.json(
        { error: 'Site name and contact email are required' },
        { status: 400 }
      );
    }

    // Remove _id from the update data
    const { _id, ...updateData } = settings;

    // Update or insert settings
    const result = await db.collection('settings').updateOne(
      {}, // empty filter to match first document
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      { upsert: true } // create if doesn't exist
    );

    if (!result.acknowledged) {
      console.error('MongoDB update not acknowledged:', result);
      throw new Error('Database operation failed');
    }

    // Fetch the updated settings to return
    const updatedSettings = await db.collection('settings').findOne({});
    
    if (!updatedSettings) {
      throw new Error('Failed to fetch updated settings');
    }

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update settings';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 