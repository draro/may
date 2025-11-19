const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function checkTestDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    // Check the 'test' database (the default one)
    const testDb = client.db('test');
    const collections = await testDb.listCollections().toArray();

    console.log('📁 Collections in TEST database:');
    for (const collection of collections) {
      const count = await testDb.collection(collection.name).countDocuments();
      console.log(`   - ${collection.name}: ${count} documents`);

      // Show sample from images collection
      if (collection.name === 'images' && count > 0) {
        console.log('\n📄 Sample image from TEST database:');
        const sample = await testDb.collection('images').findOne();
        console.log(JSON.stringify(sample, null, 2));

        console.log('\n📊 CategorySlug analysis:');
        const withSlug = await testDb.collection('images').countDocuments({ categorySlug: { $exists: true, $ne: null } });
        const withoutSlug = await testDb.collection('images').countDocuments({ categorySlug: { $exists: false } });
        const nullSlug = await testDb.collection('images').countDocuments({ categorySlug: null });
        console.log(`   - Images WITH categorySlug: ${withSlug}`);
        console.log(`   - Images WITHOUT categorySlug field: ${withoutSlug}`);
        console.log(`   - Images with NULL categorySlug: ${nullSlug}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

checkTestDatabase();
