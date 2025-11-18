# Firebase Storage Setup Guide

This guide will help you set up Firebase Storage for image uploads in your photography portfolio app.

## Why Firebase Storage?

For deployment on platforms like Vercel, the filesystem is **read-only**. You cannot save uploaded images to the local filesystem. Firebase Storage provides a reliable, scalable solution for storing images in production.

## Step-by-Step Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Follow the setup wizard (you can disable Google Analytics if not needed)

### 2. Enable Firebase Storage

1. In your Firebase project, click **"Storage"** in the left sidebar
2. Click **"Get Started"**
3. Choose **"Start in production mode"** (we'll configure rules next)
4. Select a location close to your users
5. Click **"Done"**

### 3. Configure Storage Security Rules

1. In Firebase Storage, go to the **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }

    // Allow write access only to images folder (you'll implement auth later)
    match /images/{category}/{filename} {
      allow write: if request.resource.size < 10 * 1024 * 1024  // Max 10MB
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

3. Click **"Publish"**

> **Note:** These rules allow anyone to read files (needed for public website) but restrict uploads to valid images under 10MB. For production, you should add authentication to restrict who can upload.

### 4. Get Your Firebase Configuration

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** `</>`
5. Register your app with a nickname (e.g., "Photography Portfolio")
6. Copy the Firebase config values

### 5. Add Environment Variables

#### For Local Development

Update your `.env.local` file:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

#### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add each Firebase variable:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
4. Set environment to **"Production"** for each
5. Click **Save**

### 6. Redeploy Your App

After adding environment variables to Vercel:

1. Go to **Deployments** tab
2. Click the **3 dots (...)** next to the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

### 7. Test Image Upload

1. Log in to your admin panel at `https://your-site.vercel.app/admin/login`
2. Go to the **Upload** tab
3. Try uploading an image
4. You should see: "Image uploaded successfully to firebase storage"

## Troubleshooting

### Error: "Local file storage is not available in production"

This means Firebase is not configured. Double-check:
- All Firebase environment variables are added to Vercel
- You redeployed after adding variables
- Variable names match exactly (case-sensitive)

### Error: "Firebase: Error (auth/invalid-api-key)"

- Check that `NEXT_PUBLIC_FIREBASE_API_KEY` is correct
- Make sure you copied it exactly from Firebase Console

### Error: "storage/unauthorized"

- Your Firebase Storage rules may be too restrictive
- Verify the security rules in Firebase Console → Storage → Rules

### Images not displaying after upload

- Check Firebase Storage rules allow public read access
- Verify the image was actually uploaded by checking Firebase Console → Storage

## File Structure in Firebase Storage

Images are organized as:
```
images/
  ├── architecture/
  │   ├── building-123456-abc.jpg
  │   └── interior-123457-def.jpg
  ├── travel/
  │   └── landscape-123458-ghi.jpg
  └── ...
```

Each category gets its own folder for better organization.

## Cost

Firebase Storage offers a **generous free tier**:
- 5 GB storage
- 1 GB/day downloads
- 20,000 uploads/day

This is more than sufficient for most photography portfolios.

## Security Best Practices

For production, consider:

1. **Implement server-side upload validation** - Add authentication checks in your API route
2. **Use Firebase Admin SDK** - Validate uploads on the server side
3. **Add rate limiting** - Prevent abuse
4. **Monitor usage** - Set up Firebase alerts for unusual activity

---

Need help? Check the [Firebase Storage documentation](https://firebase.google.com/docs/storage) or open an issue.
