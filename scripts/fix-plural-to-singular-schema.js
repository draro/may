const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function fixPluralToSingularSchema() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    // Connect to portfolio database
    const db = client.db('portfolio');
    const imagesCollection = db.collection('images');

    // Find all images with plural fields
    const images = await imagesCollection.find({}).toArray();

    console.log(`📸 Found ${images.length} images to check\n`);

    let fixed = 0;
    let skipped = 0;
    let errors = 0;

    for (const image of images) {
      const updates = {};
      const unsets = {};

      // Check if has plural fields (arrays)
      if (Array.isArray(image.categoryIds)) {
        // Convert array to single value (take first element)
        updates.categoryId = image.categoryIds[0];
        unsets.categoryIds = '';
        console.log(`🔄 Image "${image.title}": Converting categoryIds array to categoryId string`);
      }

      if (Array.isArray(image.categorySlugs)) {
        // Convert array to single value (take first element)
        updates.categorySlug = image.categorySlugs[0];
        unsets.categorySlugs = '';
        console.log(`🔄 Image "${image.title}": Converting categorySlugs array to categorySlug string`);
      }

      // Check if already has correct singular fields
      if (typeof image.categoryId === 'string' && typeof image.categorySlug === 'string' &&
          !Array.isArray(image.categoryIds) && !Array.isArray(image.categorySlugs)) {
        console.log(`✅ Image "${image.title}": Already has correct schema`);
        skipped++;
        continue;
      }

      // If we have updates to make
      if (Object.keys(updates).length > 0 || Object.keys(unsets).length > 0) {
        try {
          const updateOps = {};
          if (Object.keys(updates).length > 0) {
            updateOps.$set = updates;
          }
          if (Object.keys(unsets).length > 0) {
            updateOps.$unset = unsets;
          }

          await imagesCollection.updateOne(
            { _id: image._id },
            updateOps
          );

          console.log(`✅ Fixed "${image.title}"`);
          console.log(`   - categoryId: ${updates.categoryId || image.categoryId}`);
          console.log(`   - categorySlug: ${updates.categorySlug || image.categorySlug}`);
          fixed++;
        } catch (err) {
          console.error(`❌ Error fixing "${image.title}":`, err);
          errors++;
        }
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Fixed: ${fixed} images`);
    console.log(`   Skipped: ${skipped} images (already correct)`);
    console.log(`   Errors: ${errors} images`);
    console.log('');

    // Verification - show all images with their category info
    console.log('🔍 Verification - All images:');
    const verifiedImages = await imagesCollection.find({}).toArray();

    for (const img of verifiedImages) {
      console.log(`   - "${img.title}"`);
      console.log(`     categoryId: ${img.categoryId} (type: ${typeof img.categoryId})`);
      console.log(`     categorySlug: ${img.categorySlug} (type: ${typeof img.categorySlug})`);

      // Check for any remaining plural fields
      if (img.categoryIds !== undefined) {
        console.log(`     ⚠️  WARNING: Still has categoryIds field!`);
      }
      if (img.categorySlugs !== undefined) {
        console.log(`     ⚠️  WARNING: Still has categorySlugs field!`);
      }
    }

    console.log('\n📊 Category distribution:');
    const categoryCounts = await imagesCollection.aggregate([
      {
        $group: {
          _id: '$categorySlug',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    categoryCounts.forEach(item => {
      console.log(`   ${item._id || 'undefined'}: ${item.count} images`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

fixPluralToSingularSchema();
