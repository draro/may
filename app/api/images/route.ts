import { NextRequest, NextResponse } from 'next/server';
import { ImageModel } from '@/models/Image';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');

    let images;
    if (categorySlug) {
      images = await ImageModel.findByCategory(categorySlug);
    } else {
      images = await ImageModel.findAll();
    }

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      categoryIds,
      categorySlugs,
      firebaseUrl,
      thumbnailUrl,
      width,
      height,
      order,
      featured,
      location
    } = body;

    if (!title || !categoryIds?.length || !categorySlugs?.length || !firebaseUrl) {
      return NextResponse.json(
        { error: 'Title, categoryIds, categorySlugs, and firebaseUrl are required' },
        { status: 400 }
      );
    }

    const image = await ImageModel.create({
      title,
      description: description || '',
      categoryIds,
      categorySlugs,
      firebaseUrl,
      thumbnailUrl,
      width: width || 1200,
      height: height || 800,
      order: order || 0,
      featured: featured || false,
      location: location || '',
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error creating image:', error);
    return NextResponse.json(
      { error: 'Failed to create image' },
      { status: 500 }
    );
  }
}
