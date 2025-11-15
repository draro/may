import { ObjectId } from 'mongodb';

export interface Category {
  _id?: ObjectId;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Image {
  _id?: ObjectId;
  id?: string;
  title: string;
  description?: string;
  categoryId: string;
  categorySlug: string;
  firebaseUrl: string; // Firestore Storage URL
  thumbnailUrl?: string;
  width: number;
  height: number;
  order: number;
  featured: boolean;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id?: ObjectId;
  id?: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface PhotographerProfile {
  _id?: ObjectId;
  id?: string;
  name: string;
  bio: string;
  location: string;
  email: string;
  phone?: string;
  skills: string[];
  interests: string[];
  avatarUrl?: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  updatedAt: Date;
}

export interface ContactForm {
  _id?: ObjectId;
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  projectType?: string;
  budget?: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}
