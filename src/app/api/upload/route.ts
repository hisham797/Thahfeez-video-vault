import { NextResponse } from 'next/server';
import { imagekit } from '@/lib/imagekit';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const type = formData.get('type') as 'thumbnail' | 'video';

    if (!file || !fileName || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName,
      folder: `/thahfeez/${type === 'thumbnail' ? 'thumbnails' : 'videos'}`,
    });

    return NextResponse.json({
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 