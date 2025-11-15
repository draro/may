import { getDb } from '@/lib/db/mongodb';
import { PhotographerProfile } from '@/types';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'profile';

export class ProfileModel {
  static async get(): Promise<PhotographerProfile | null> {
    const db = await getDb();
    return db.collection<PhotographerProfile>(COLLECTION_NAME).findOne({});
  }

  static async update(profile: Partial<PhotographerProfile>): Promise<PhotographerProfile> {
    const db = await getDb();
    const now = new Date();

    const existingProfile = await this.get();

    if (existingProfile) {
      const result = await db.collection<PhotographerProfile>(COLLECTION_NAME).findOneAndUpdate(
        { _id: existingProfile._id },
        { $set: { ...profile, updatedAt: now } },
        { returnDocument: 'after' }
      );
      return result!;
    } else {
      const newProfile: Omit<PhotographerProfile, '_id'> = {
        name: profile.name || 'Professional Photographer',
        bio: profile.bio || '',
        location: profile.location || 'New York, NY',
        email: profile.email || '',
        skills: profile.skills || [],
        interests: profile.interests || [],
        socialLinks: profile.socialLinks || {},
        updatedAt: now,
      };
      const result = await db.collection<PhotographerProfile>(COLLECTION_NAME).insertOne(newProfile as any);
      return { ...newProfile, _id: result.insertedId };
    }
  }

  static async createDefault(): Promise<PhotographerProfile> {
    return this.update({
      name: 'Professional Photographer',
      bio: 'NYC-based photographer specializing in architecture, interiors, and travel photography.',
      location: 'New York, NY',
      email: 'contact@photographer.com',
      skills: [
        'Architectural Photography',
        'Interior Design Photography',
        'Travel Photography',
        'Commercial Photography',
        'Photo Editing & Retouching',
        'Drone Photography'
      ],
      interests: [
        'Urban Landscapes',
        'Modern Architecture',
        'Minimalist Design',
        'Cultural Documentation',
        'Light & Shadow'
      ],
      socialLinks: {
        instagram: 'https://instagram.com/photographer',
        facebook: '',
        twitter: '',
        linkedin: ''
      }
    });
  }
}
