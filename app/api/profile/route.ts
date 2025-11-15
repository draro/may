import { NextRequest, NextResponse } from 'next/server';
import { ProfileModel } from '@/models/Profile';

export async function GET() {
  try {
    let profile = await ProfileModel.get();

    // If no profile exists, create a default one
    if (!profile) {
      profile = await ProfileModel.createDefault();
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const profile = await ProfileModel.update(body);

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
