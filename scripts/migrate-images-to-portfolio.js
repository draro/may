const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function migrateImages() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    // Get categories from 'portfolio' database
    const portfolioDb = client.db('portfolio');
    const categories = await portfolioDb.collection('categories').find().toArray();

    console.log(`📂 Found ${categories.length} categories in 'portfolio' database:`);
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (slug: ${cat.slug})`);
    });
    console.log('');

    if (categories.length === 0) {
      console.error('❌ No categories found! Please run create-categories.js first.');
      process.exit(1);
    }

    // Get images from 'test' database (where they currently are)
    const testDb = client.db('test');
    const imagesInTest = await testDb.collection('images').find().toArray();

    console.log(`📸 Found ${imagesInTest.length} images in 'test' database\n`);

    if (imagesInTest.length === 0) {
      console.log('No images found in test database. Checking portfolio database...');
      const imagesInPortfolio = await portfolioDb.collection('images').find().toArray();
      console.log(`📸 Found ${imagesInPortfolio.length} images in 'portfolio' database\n`);

      if (imagesInPortfolio.length === 0) {
        console.error('❌ No images found in either database!');
        process.exit(1);
      }

      // Images are already in portfolio, just need to add categorySlug
      console.log('Images are in portfolio database. Assigning categorySlugs...\n');
      await assignCategorySlugs(portfolioDb, imagesInPortfolio, categories);
      return;
    }

    // Step 1: Copy images from 'test' to 'portfolio' with categorySlug assigned
    console.log('🔄 Step 1: Copying images from test to portfolio with categorySlug...\n');

    const interiorKeywords = ['kitchen', 'room', 'interior', 'hallway', 'loft', 'bedroom', 'bathroom', 'living', 'dining'];
    const exteriorKeywords = ['exterior', 'facade', 'building', 'arch', 'door', 'entrance', 'outside', 'arches'];

    let copied = 0;
    let skipped = 0;

    for (const image of imagesInTest) {
      // Check if already exists in portfolio
      const existing = await portfolioDb.collection('images').findOne({
        firebaseUrl: image.firebaseUrl
      });

      if (existing) {
        console.log(`⏭️  Skipped "${image.title}" (already in portfolio)`);
        skipped++;
        continue;
      }

      // Assign category based on keywords
      const title = (image.title || '').toLowerCase();
      const description = (image.description || '').toLowerCase();
      const location = (image.location || '').toLowerCase();
      const text = `${title} ${description} ${location}`;

      let assignedCategory = null;

      // Check for interior keywords
      if (interiorKeywords.some(keyword => text.includes(keyword))) {
        assignedCategory = categories.find(c => c.slug === 'interiors');
      }

      // Check for exterior keywords (if not already assigned)
      if (!assignedCategory && exteriorKeywords.some(keyword => text.includes(keyword))) {
        assignedCategory = categories.find(c => c.slug === 'exteriors');
      }

      // Fallback to first category
      if (!assignedCategory) {
        assignedCategory = categories[0];
        console.log(`⚠️  "${image.title}": No keyword match, defaulting to ${assignedCategory.name}`);
      }

      // Copy image to portfolio with categorySlug
      const imageWithCategory = {
        ...image,
        categoryId: assignedCategory._id.toString(),
        categorySlug: assignedCategory.slug,
        updatedAt: new Date()
      };

      // Remove _id to let MongoDB generate a new one
      delete imageWithCategory._id;

      await portfolioDb.collection('images').insertOne(imageWithCategory);
      console.log(`✅ Copied "${image.title}" → ${assignedCategory.name}`);
      copied++;
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Copied: ${copied} images`);
    console.log(`   Skipped: ${skipped} images (already in portfolio)\n`);

    // Step 2: Verify
    console.log('🔍 Verification:');
    for (const category of categories) {
      const count = await portfolioDb.collection('images').countDocuments({
        categorySlug: category.slug
      });
      console.log(`   ${category.name}: ${count} images`);
    }

    console.log('\n📝 Next steps:');
    console.log('1. Fix your MONGODB_URI to include "/portfolio" before the query string:');
    console.log('   mongodb+srv://may:PASSWORD@cluster0.xybcjf3.mongodb.net/portfolio?retryWrites=true&w=majority');
    console.log('2. Update the same in Vercel Environment Variables');
    console.log('3. Redeploy on Vercel');
    console.log('4. Test the category filter on your website');
    console.log('\n💡 After confirming everything works, you can optionally delete images from test database');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

async function assignCategorySlugs(db, images, categories) {
  const interiorKeywords = ['kitchen', 'room', 'interior', 'hallway', 'loft', 'bedroom', 'bathroom', 'living', 'dining'];
  const exteriorKeywords = ['exterior', 'facade', 'building', 'arch', 'door', 'entrance', 'outside', 'arches'];

  let updated = 0;
  let skipped = 0;

  for (const image of images) {
    // Skip if already has categorySlug
    if (image.categorySlug) {
      console.log(`⏭️  Skipped "${image.title}" (already has categorySlug: ${image.categorySlug})`);
      skipped++;
      continue;
    }

    // Assign category based on keywords
    const title = (image.title || '').toLowerCase();
    const description = (image.description || '').toLowerCase();
    const location = (image.location || '').toLowerCase();
    const text = `${title} ${description} ${location}`;

    let assignedCategory = null;

    // Check for interior keywords
    if (interiorKeywords.some(keyword => text.includes(keyword))) {
      assignedCategory = categories.find(c => c.slug === 'interiors');
    }

    // Check for exterior keywords (if not already assigned)
    if (!assignedCategory && exteriorKeywords.some(keyword => text.includes(keyword))) {
      assignedCategory = categories.find(c => c.slug === 'exteriors');
    }

    // Fallback to first category
    if (!assignedCategory) {
      assignedCategory = categories[0];
      console.log(`⚠️  "${image.title}": No keyword match, defaulting to ${assignedCategory.name}`);
    }

    // Update image with categorySlug
    await db.collection('images').updateOne(
      { _id: image._id },
      {
        $set: {
          categoryId: assignedCategory._id.toString(),
          categorySlug: assignedCategory.slug,
          updatedAt: new Date()
        }
      }
    );
    console.log(`✅ Updated "${image.title}" → ${assignedCategory.name}`);
    updated++;
  }

  console.log(`\n✅ Update complete!`);
  console.log(`   Updated: ${updated} images`);
  console.log(`   Skipped: ${skipped} images\n`);

  // Verify
  console.log('🔍 Verification:');
  for (const category of categories) {
    const count = await db.collection('images').countDocuments({
      categorySlug: category.slug
    });
    console.log(`   ${category.name}: ${count} images`);
  }
}

migrateImages();
