const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function fixImageCategories() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('portfolio');
    const imagesCollection = db.collection('images');
    const categoriesCollection = db.collection('categories');

    // Get all categories
    const categories = await categoriesCollection.find().toArray();
    console.log(`📂 Found ${categories.length} categories:`, categories.map(c => ({ name: c.name, slug: c.slug })));

    if (categories.length === 0) {
      console.error('❌ No categories found! Please create categories first.');
      process.exit(1);
    }

    // Get all images
    const images = await imagesCollection.find().toArray();
    console.log(`📸 Found ${images.length} images to fix\n`);

    let fixedCount = 0;
    let skippedCount = 0;

    // Smart auto-assignment based on keywords
    for (const image of images) {
      if (image.categorySlug && image.categoryId) {
        console.log(`  ⏭️  Skipped: "${image.title}" (already has category: ${image.categorySlug})`);
        skippedCount++;
        continue;
      }

      const title = (image.title || '').toLowerCase();
      const description = (image.description || '').toLowerCase();
      const location = (image.location || '').toLowerCase();
      const text = `${title} ${description} ${location}`;

      let assignedCategory = null;

      // Keywords for interiors
      const interiorKeywords = ['kitchen', 'room', 'interior', 'hallway', 'loft', 'bedroom', 'bathroom', 'living', 'dining'];

      // Keywords for exteriors
      const exteriorKeywords = ['exterior', 'facade', 'building', 'arch', 'door', 'entrance', 'outside'];

      // Check for interior keywords
      if (interiorKeywords.some(keyword => text.includes(keyword))) {
        assignedCategory = categories.find(c => c.slug === 'interiors');
      }

      // Check for exterior keywords
      if (!assignedCategory && exteriorKeywords.some(keyword => text.includes(keyword))) {
        assignedCategory = categories.find(c => c.slug === 'exteriors');
      }

      // Default to first category if no match
      if (!assignedCategory) {
        assignedCategory = categories[0];
        console.log(`  ⚠️  No keyword match for "${image.title}", assigning to default: ${assignedCategory.name}`);
      }

      await imagesCollection.updateOne(
        { _id: image._id },
        {
          $set: {
            categorySlug: assignedCategory.slug,
            categoryId: assignedCategory._id.toString(),
            updatedAt: new Date()
          }
        }
      );
      console.log(`  ✅ Fixed: "${image.title}" → ${assignedCategory.name} (${assignedCategory.slug})`);
      fixedCount++;
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Fixed: ${fixedCount} images`);
    console.log(`   Skipped: ${skippedCount} images`);
    console.log(`\n🔍 Verification:`);

    // Verify the results
    for (const category of categories) {
      const count = await imagesCollection.countDocuments({ categorySlug: category.slug });
      console.log(`   ${category.name}: ${count} images`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

fixImageCategories();
