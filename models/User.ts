import { getDb } from '@/lib/db/mongodb';
import { User } from '@/types';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

const COLLECTION_NAME = 'users';

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const db = await getDb();
    return db.collection<User>(COLLECTION_NAME).findOne({ email });
  }

  static async findById(id: string): Promise<User | null> {
    const db = await getDb();
    return db.collection<User>(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
  }

  static async create(userData: {
    email: string;
    password: string;
    name: string;
    role?: 'admin' | 'user';
  }): Promise<User> {
    const db = await getDb();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const now = new Date();

    const newUser: Omit<User, '_id'> = {
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role || 'user',
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection<User>(COLLECTION_NAME).insertOne(newUser as any);
    const { password, ...userWithoutPassword } = newUser;
    return { ...userWithoutPassword, _id: result.insertedId, password: hashedPassword };
  }

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  static async count(): Promise<number> {
    const db = await getDb();
    return db.collection<User>(COLLECTION_NAME).countDocuments();
  }
}
