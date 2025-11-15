import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, generateUniqueFileName, isFirebaseConfigured } from '@/utils/upload';
import { ImageModel } from '@/models/Image';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const categoryId = formData.get('categoryId') as string;
    const categorySlug = formData.get('categorySlug') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string || '';
    const location = formData.get('location') as string || '';
    const featured = formData.get('featured') === 'true';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!categoryId || !categorySlug || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: categoryId, categorySlug, title' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileName = generateUniqueFileName(file.name);

    // Upload image (will use Firebase or local based on config)
    const { url, storage } = await uploadImage(buffer, fileName, categorySlug);

    // Get image dimensions (basic estimation)
    // In production, you might want to use a library like 'sharp' for this
    const width = 1200;
    const height = 800;

    // Get the next order number
    const existingImages = await ImageModel.findByCategory(categorySlug);
    const order = existingImages.length;

    // Save image metadata to database
    const image = await ImageModel.create({
      title,
      description,
      categoryId,
      categorySlug,
      firebaseUrl: url,
      width,
      height,
      order,
      featured,
      location,
    });

    return NextResponse.json({
      success: true,
      image,
      storage,
      message: `Image uploaded successfully to ${storage} storage`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const configured = isFirebaseConfigured();
  return NextResponse.json({
    firebaseConfigured: configured,
    storageType: configured ? 'firebase' : 'local',
    message: configured
      ? 'Images will be uploaded to Firebase Storage'
      : 'Images will be uploaded to local storage (public/uploads/)',
  });
}
