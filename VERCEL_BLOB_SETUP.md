# Vercel Blob Storage Setup Guide

This guide will help you set up Vercel Blob Storage for image uploads in your photography portfolio app deployed on Vercel.

## Why Vercel Blob?

Vercel Blob is the **recommended** storage solution for apps deployed on Vercel because:
- ✅ **Native integration** - Works seamlessly with Vercel deployments
- ✅ **Zero configuration** - Just add the token, no complex setup
- ✅ **Fast** - Optimized for Vercel's edge network
- ✅ **Simple** - Easier setup than Firebase
- ✅ **Generous free tier** - 500GB bandwidth + 10GB storage

## Quick Setup (5 minutes)

### 1. Create Blob Store in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Storage**
3. Click **Create Database**
4. Select **Blob**
5. Give it a name (e.g., "portfolio-images")
6. Click **Create**

### 2. Get Your Token

After creating the Blob store:
1. Vercel will display your **Read-Write Token**
2. Copy the token (starts with `vercel_blob_rw_...`)
3. You already have yours: `vercel_blob_rw_i375FBIR2DbSlobU_zPDkQwgE0nakpiAUYHMRzR1M9YVP7U`

### 3. Add to Vercel Environment Variables

1. Stay in **Settings** → **Environment Variables**
2. Click **Add New**
3. Key: `BLOB_READ_WRITE_TOKEN`
4. Value: Your token (paste it)
5. Environment: Select **Production** (and Preview if you want)
6. Click **Save**

### 4. Redeploy Your App

**Important:** Environment variables only take effect after redeployment.

1. Go to **Deployments** tab
2. Click the **3 dots (...)** next to the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (~2 minutes)

### 5. Test Upload

1. Log in to your admin panel: `https://your-site.vercel.app/admin/login`
2. Go to the **Upload** tab
3. Upload an image
4. You should see: **"Image uploaded successfully to vercel-blob storage"**

## Verify Configuration

You can check which storage is configured by visiting:
```
https://your-site.vercel.app/api/upload
```

Response should show:
```json
{
  "vercelBlobConfigured": true,
  "firebaseConfigured": false,
  "storageType": "vercel-blob",
  "message": "Images will be uploaded to Vercel Blob Storage"
}
```

## Storage Priority

The app uses storage in this order:
1. **Vercel Blob** (if `BLOB_READ_WRITE_TOKEN` is set) ← You're using this
2. **Firebase** (if Firebase env vars are set)
3. **Local** (development only, fails in production)

## Free Tier Limits

Vercel Blob free tier includes:
- **500 GB** bandwidth per month
- **10 GB** storage
- Unlimited read operations
- 1,000 write operations per day

This is **more than enough** for most photography portfolios.

## File Organization

Images are stored with this structure:
```
images/
  ├── architecture/
  │   ├── building-123456-abc.jpg
  │   └── interior-123457-def.jpg
  ├── travel/
  │   └── landscape-123458-ghi.jpg
  └── [other-categories]/
```

## View Your Uploaded Files

To view all uploaded files:
1. Go to Vercel Dashboard → Your Project
2. Click **Storage**
3. Click your Blob store name
4. Browse all uploaded files

## Common Issues

### Error: "Local file storage is not available in production"

This means the token isn't set or the app hasn't been redeployed:
- ✅ Verify `BLOB_READ_WRITE_TOKEN` is in Vercel environment variables
- ✅ Redeploy the app after adding the token
- ✅ Check environment is set to "Production"

### Upload succeeds but image doesn't display

- Images in Vercel Blob are publicly accessible by default
- Check the image URL in the database
- Verify the URL is accessible in a browser

## Pricing

If you exceed the free tier:
- **Bandwidth**: $0.15 per GB
- **Storage**: $0.15 per GB/month
- **Writes**: $0.50 per 1,000 operations

For a typical photography portfolio with 500 images (each ~2MB), you'll use ~1GB storage and stay well within free tier limits.

## Need Help?

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Pricing Details](https://vercel.com/docs/storage/vercel-blob/usage-and-pricing)

---

**Next Steps:**
1. ✅ Add `BLOB_READ_WRITE_TOKEN` to Vercel (you already have the token)
2. ✅ Redeploy
3. ✅ Test upload
4. 🎉 Start uploading your photography!
