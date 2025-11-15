import { NextRequest, NextResponse } from 'next/server';
import { ImageModel } from '@/models/Image';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '12');

    const images = await ImageModel.findFeatured(limit);
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching featured images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured images' },
      { status: 500 }
    );
  }
}
