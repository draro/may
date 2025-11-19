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
    console.log(`📂 Found ${categories.length} categories:`, categories.map(c => ({ name: c.name, slug: c.slug, id: c._id.toString() })));

    if (categories.length === 0) {
      console.error('❌ No categories found! Please create categories first.');
      process.exit(1);
    }

    // Get all images
    const images = await imagesCollection.find().toArray();
    console.log(`📸 Found ${images.length} images to fix`);

    let fixedCount = 0;
    let skippedCount = 0;

    // If you have only one category, assign all images to it
    // Otherwise, you'll need to manually assign or provide a mapping
    if (categories.length === 1) {
      const category = categories[0];
      console.log(`\n🔧 Assigning all images to category: ${category.name} (${category.slug})`);

      for (const image of images) {
        if (!image.categorySlug || !image.categoryId) {
          await imagesCollection.updateOne(
            { _id: image._id },
            {
              $set: {
                categorySlug: category.slug,
                categoryId: category._id.toString(),
                updatedAt: new Date()
              }
            }
          );
          console.log(`  ✅ Fixed: ${image.title}`);
          fixedCount++;
        } else {
          console.log(`  ⏭️  Skipped: ${image.title} (already has category)`);
          skippedCount++;
        }
      }
    } else {
      // Multiple categories - need manual assignment
      console.log('\n⚠️  Multiple categories detected. Please choose how to assign images:\n');
      console.log('Option 1: Assign ALL images to ONE category');
      console.log('Option 2: Create a custom mapping in this script\n');

      console.log('📋 Available categories:');
      categories.forEach((cat, index) => {
        console.log(`  ${index + 1}. ${cat.name} (slug: ${cat.slug})`);
      });

      console.log('\n💡 To assign all images to category #1 (first category), edit this script and uncomment the code below:\n');

      // UNCOMMENT THIS SECTION AND CHANGE THE INDEX TO ASSIGN ALL IMAGES TO A SPECIFIC CATEGORY
      // const targetCategoryIndex = 0; // 0 for first category, 1 for second, etc.
      // const category = categories[targetCategoryIndex];
      // console.log(`\n🔧 Assigning all images to category: ${category.name} (${category.slug})`);
      //
      // for (const image of images) {
      //   if (!image.categorySlug || !image.categoryId) {
      //     await imagesCollection.updateOne(
      //       { _id: image._id },
      //       {
      //         $set: {
      //           categorySlug: category.slug,
      //           categoryId: category._id.toString(),
      //           updatedAt: new Date()
      //         }
      //       }
      //     );
      //     console.log(`  ✅ Fixed: ${image.title}`);
      //     fixedCount++;
      //   } else {
      //     console.log(`  ⏭️  Skipped: ${image.title} (already has category)`);
      //     skippedCount++;
      //   }
      // }

      // OR create a custom mapping based on image titles
      // Example: If image title contains "interior", assign to "interiors" category
      console.log('\n💡 Or uncomment this section for smart auto-assignment based on keywords:\n');

      // UNCOMMENT THIS FOR SMART AUTO-ASSIGNMENT
      // for (const image of images) {
      //   if (!image.categorySlug || !image.categoryId) {
      //     const title = (image.title || '').toLowerCase();
      //     const description = (image.description || '').toLowerCase();
      //
      //     let assignedCategory = null;
      //
      //     // Match keywords to categories
      //     if (title.includes('interior') || title.includes('kitchen') || title.includes('room')) {
      //       assignedCategory = categories.find(c => c.slug === 'interiors');
      //     } else if (title.includes('exterior') || title.includes('facade') || title.includes('building')) {
      //       assignedCategory = categories.find(c => c.slug === 'exteriors');
      //     }
      //
      //     // Default to first category if no match
      //     if (!assignedCategory) {
      //       assignedCategory = categories[0];
      //     }
      //
      //     await imagesCollection.updateOne(
      //       { _id: image._id },
      //       {
      //         $set: {
      //           categorySlug: assignedCategory.slug,
      //           categoryId: assignedCategory._id.toString(),
      //           updatedAt: new Date()
      //         }
      //       }
      //     );
      //     console.log(`  ✅ Fixed: ${image.title} → ${assignedCategory.name}`);
      //     fixedCount++;
      //   }
      // }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Fixed: ${fixedCount} images`);
    console.log(`   Skipped: ${skippedCount} images`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

fixImageCategories();
