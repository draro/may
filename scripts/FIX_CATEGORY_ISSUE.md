# Fixing the Category Filter Issue

## The Problem

Your browser console shows images exist but have `categorySlug: undefined`, while the migration scripts found 0 images in the database.

## Root Cause

**You likely have TWO different MongoDB databases:**

1. **Local database** - Where you ran the migration scripts (found 0 images)
2. **Production database (Vercel)** - Where your actual images are stored (has images with missing categorySlug)

## Solution Steps

### Step 1: Verify Your Database Configuration

Run the updated debug script to see which database your local environment connects to:

```bash
node scripts/debug-database.js
```

This will show:
- The MONGODB_URI you're connecting to (with password hidden)
- The default database name from your URI
- All available databases and their sizes
- Collections in the database
- Sample image document (if any exist)

### Step 2: Check Vercel Environment Variables

1. Go to your Vercel dashboard: https://vercel.com
2. Open your project
3. Go to **Settings** → **Environment Variables**
4. Look for `MONGODB_URI`
5. Check if it points to a **different** cluster or database than your local `.env.local`

### Step 3: Choose Your Approach

#### Option A: Fix Production Database (Recommended)

If your images are in the **production** database (Vercel), you need to run the migration scripts against that database:

1. **Temporarily** update your local `.env.local` with the production MONGODB_URI:
   ```bash
   # In .env.local
   MONGODB_URI=<paste the MONGODB_URI from Vercel here>
   ```

2. Run the migration scripts:
   ```bash
   node scripts/debug-database.js          # Verify you can see images
   node scripts/create-categories.js       # Create categories (if not already done)
   node scripts/fix-image-categories-smart.js  # Fix the images
   ```

3. **Restore** your local `.env.local` to your development database

4. Verify on your website that the category filter now works

#### Option B: Use Same Database Everywhere

Update your local `.env.local` to use the same MONGODB_URI as production. This simplifies development but means you're working with production data locally.

### Step 4: Prevent Future Issues

When creating new images through the admin panel, ensure the upload form always includes:
- `categoryId`
- `categorySlug`

The API already requires these fields (see `/home/user/may/app/api/images/route.ts:43-47`), so any images created through the admin panel should have them.

## Quick Diagnostic Commands

### Check local database:
```bash
node scripts/debug-database.js
```

### Check if categories exist:
```bash
# This will show categories or error if none exist
node -e "const { MongoClient } = require('mongodb'); require('dotenv').config({ path: '.env.local' }); (async () => { const client = new MongoClient(process.env.MONGODB_URI); await client.connect(); const db = client.db(); const cats = await db.collection('categories').find().toArray(); console.log('Categories:', cats); await client.close(); })()"
```

### Check if images exist:
```bash
# This will show count and sample image
node -e "const { MongoClient } = require('mongodb'); require('dotenv').config({ path: '.env.local' }); (async () => { const client = new MongoClient(process.env.MONGODB_URI); await client.connect(); const db = client.db(); const count = await db.collection('images').countDocuments(); console.log('Images:', count); if(count > 0) { const sample = await db.collection('images').findOne(); console.log('Sample:', sample); } await client.close(); })()"
```

## Need Help?

If you're still stuck, run these commands and share the output:

1. `node scripts/debug-database.js`
2. Check your Vercel environment variables for MONGODB_URI
3. Compare the two URIs - are they pointing to the same cluster and database?
