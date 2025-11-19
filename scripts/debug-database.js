const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function debugDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  console.log('🔗 Connecting with URI:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@')); // Hide password
  console.log('');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    // Check which database the URI points to
    const defaultDb = client.db(); // This is what getDb() returns
    console.log('🎯 Default database from URI:', defaultDb.databaseName);
    console.log('');

    // List all databases
    const adminDb = client.db().admin();
    const { databases } = await adminDb.listDatabases();
    console.log('📚 Available databases:');
    databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });

    console.log('\n🔍 Checking portfolio database...\n');

    // Check portfolio database
    const db = client.db('portfolio');
    const collections = await db.listCollections().toArray();

    console.log('📁 Collections in portfolio database:');
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`   - ${collection.name}: ${count} documents`);

      // Show a sample document from images collection
      if (collection.name === 'images' && count > 0) {
        const sample = await db.collection('images').findOne();
        console.log('\n📄 Sample image document:');
        console.log(JSON.stringify(sample, null, 2));
      }
    }

    // Check if images exist but in different collection name
    console.log('\n🔍 Searching for image-related collections...');
    for (const collection of collections) {
      if (collection.name.toLowerCase().includes('image') ||
          collection.name.toLowerCase().includes('photo') ||
          collection.name.toLowerCase().includes('gallery')) {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`   ✅ Found: ${collection.name} with ${count} documents`);
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

debugDatabase();
