const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function createCategories() {
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
    const categoriesCollection = db.collection('categories');

    // Check if categories already exist
    const existingCount = await categoriesCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} categories already exist. Skipping creation.`);
      const existing = await categoriesCollection.find().toArray();
      console.log('Existing categories:', existing.map(c => c.name));
      return;
    }

    // Create default categories
    const categories = [
      {
        name: 'Interiors',
        slug: 'interiors',
        description: 'Interior photography and design',
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Exteriors',
        slug: 'exteriors',
        description: 'Exterior architecture and buildings',
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const result = await categoriesCollection.insertMany(categories);
    console.log(`\n✅ Created ${result.insertedCount} categories:`);

    categories.forEach(cat => {
      console.log(`   📂 ${cat.name} (slug: ${cat.slug})`);
    });

    console.log('\n🎉 Categories created successfully!');
    console.log('\n💡 Next step: Run the image migration script:');
    console.log('   node scripts/fix-image-categories-smart.js');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

createCategories();
