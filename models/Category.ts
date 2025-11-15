import { getDb } from '@/lib/db/mongodb';
import { Category } from '@/types';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'categories';

export class CategoryModel {
  static async findAll(): Promise<Category[]> {
    const db = await getDb();
    return db.collection<Category>(COLLECTION_NAME)
      .find()
      .sort({ order: 1 })
      .toArray();
  }

  static async findBySlug(slug: string): Promise<Category | null> {
    const db = await getDb();
    return db.collection<Category>(COLLECTION_NAME).findOne({ slug });
  }

  static async findById(id: string): Promise<Category | null> {
    const db = await getDb();
    return db.collection<Category>(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
  }

  static async create(category: Omit<Category, '_id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const db = await getDb();
    const now = new Date();
    const newCategory: Omit<Category, '_id'> = {
      ...category,
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.collection<Category>(COLLECTION_NAME).insertOne(newCategory as any);
    return { ...newCategory, _id: result.insertedId };
  }

  static async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    const db = await getDb();
    const result = await db.collection<Category>(COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result || null;
  }

  static async delete(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.collection<Category>(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  static async count(): Promise<number> {
    const db = await getDb();
    return db.collection<Category>(COLLECTION_NAME).countDocuments();
  }
}
