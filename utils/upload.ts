import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/db/firebase';
import { put } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

export function isVercelBlobConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export function isFirebaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  );
}

export async function uploadToVercelBlob(
  file: Buffer,
  fileName: string,
  category: string
): Promise<string> {
  const blob = await put(`images/${category}/${fileName}`, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return blob.url;
}

export async function uploadToFirebase(
  file: Buffer,
  fileName: string,
  category: string
): Promise<string> {
  const storageRef = ref(storage, `images/${category}/${fileName}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

export async function uploadToLocal(
  file: Buffer,
  fileName: string,
  category: string
): Promise<string> {
  // Check if we're running in a serverless/production environment (like Vercel)
  const isServerless = process.cwd() === '/var/task' || process.env.VERCEL === '1';

  if (isServerless) {
    throw new Error(
      'Local file storage is not available in production. Please configure either Vercel Blob (BLOB_READ_WRITE_TOKEN) or Firebase Storage (NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET).'
    );
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', category);

  // Create directory if it doesn't exist
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, file);

  // Return the public URL
  return `/uploads/${category}/${fileName}`;
}

export async function uploadImage(
  file: Buffer,
  fileName: string,
  category: string
): Promise<{ url: string; storage: 'vercel-blob' | 'firebase' | 'local' }> {
  // Priority 1: Vercel Blob (best for Vercel deployments)
  if (isVercelBlobConfigured()) {
    try {
      const url = await uploadToVercelBlob(file, fileName, category);
      return { url, storage: 'vercel-blob' };
    } catch (error) {
      console.error('Vercel Blob upload failed, trying Firebase:', error);
    }
  }

  // Priority 2: Firebase (works on any platform)
  if (isFirebaseConfigured()) {
    try {
      const url = await uploadToFirebase(file, fileName, category);
      return { url, storage: 'firebase' };
    } catch (error) {
      console.error('Firebase upload failed, trying local:', error);
    }
  }

  // Priority 3: Local storage (development only)
  const url = await uploadToLocal(file, fileName, category);
  return { url, storage: 'local' };
}

export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  const sanitized = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  return `${sanitized}-${timestamp}-${random}${ext}`;
}
