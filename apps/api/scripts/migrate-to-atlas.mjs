import mongoose from 'mongoose';

const collections = ['personas', 'knowledge', 'narratives', 'airuns', 'threadsconnections'];
const sourceUri = required('SOURCE_MONGODB_URI');
const targetUri = required('TARGET_MONGODB_URI');
const sourceDb = process.env.SOURCE_MONGODB_DATABASE ?? 'rocket';
const targetDb = process.env.TARGET_MONGODB_DATABASE ?? 'rocket';

const source = await mongoose.createConnection(sourceUri, { dbName: sourceDb }).asPromise();
const target = await mongoose.createConnection(targetUri, { dbName: targetDb }).asPromise();

try {
  for (const name of collections) await copyCollection(name);
} finally {
  await Promise.all([source.close(), target.close()]);
}

async function copyCollection(name) {
  // ponytail: V1 test collections are small; batch cursor reads when production data outgrows memory.
  const documents = await source.db.collection(name).find({}).toArray();
  if (documents.length) {
    await target.db.collection(name).bulkWrite(
      documents.map((document) => ({ replaceOne: { filter: { _id: document._id }, replacement: document, upsert: true } })),
    );
  }
  const destinationCount = await target.db.collection(name).countDocuments();
  if (destinationCount < documents.length) throw new Error(`${name} migration is incomplete`);
  console.log(`${name}: ${documents.length} source, ${destinationCount} destination`);
}

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}
