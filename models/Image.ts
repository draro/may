import { getDb } from '@/lib/db/mongodb';
import { Image } from '@/types';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'images';

export class ImageModel {
  static async findAll(): Promise<Image[]> {
    const db = await getDb();
    return db.collection<Image>(COLLECTION_NAME)
      .find()
      .sort({ order: 1 })
      .toArray();
  }

  static async findByCategory(categorySlug: string): Promise<Image[]> {
    const db = await getDb();
    return db.collection<Image>(COLLECTION_NAME)
      .find({ categorySlug })
      .sort({ order: 1 })
      .toArray();
  }

  static async findFeatured(limit: number = 12): Promise<Image[]> {
    const db = await getDb();
    return db.collection<Image>(COLLECTION_NAME)
      .find({ featured: true })
      .sort({ order: 1 })
      .limit(limit)
      .toArray();
  }

  static async findById(id: string): Promise<Image | null> {
    const db = await getDb();
    return db.collection<Image>(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
  }

  static async create(image: Omit<Image, '_id' | 'createdAt' | 'updatedAt'>): Promise<Image> {
    const db = await getDb();
    const now = new Date();
    const newImage: Omit<Image, '_id'> = {
      ...image,
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.collection<Image>(COLLECTION_NAME).insertOne(newImage as any);
    return { ...newImage, _id: result.insertedId };
  }

  static async update(id: string, updates: Partial<Image>): Promise<Image | null> {
    const db = await getDb();
    const result = await db.collection<Image>(COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result || null;
  }

  static async delete(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.collection<Image>(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  static async updateOrder(id: string, order: number): Promise<Image | null> {
    return this.update(id, { order });
  }

  static async toggleFeatured(id: string, featured: boolean): Promise<Image | null> {
    return this.update(id, { featured });
  }
}
