import { getDb } from '@/lib/db/mongodb';
import { ContactForm } from '@/types';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'contacts';

export class ContactModel {
  static async create(contact: Omit<ContactForm, '_id' | 'createdAt'>): Promise<ContactForm> {
    const db = await getDb();
    const now = new Date();

    const newContact: Omit<ContactForm, '_id'> = {
      ...contact,
      createdAt: now,
    };

    const result = await db.collection<ContactForm>(COLLECTION_NAME).insertOne(newContact as any);
    return { ...newContact, _id: result.insertedId };
  }

  static async findAll(): Promise<ContactForm[]> {
    const db = await getDb();
    return db.collection<ContactForm>(COLLECTION_NAME)
      .find()
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async updateStatus(id: string, status: 'new' | 'read' | 'replied'): Promise<ContactForm | null> {
    const db = await getDb();
    const result = await db.collection<ContactForm>(COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: 'after' }
    );
    return result || null;
  }

  static async delete(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.collection<ContactForm>(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
}
