import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';

const patterns = JSON.parse(await readFile(new URL('../data/knowledge-dna.json', import.meta.url)));
const uri = required('MONGODB_URI');
const database = process.env.MONGODB_DATABASE ?? 'rocket';
const connection = await mongoose.createConnection(uri, { dbName: database }).asPromise();

try {
  const now = new Date();
  const operations = patterns.map((pattern) => ({
    updateOne: {
      filter: { sourceLabel: pattern.sourceLabel },
      update: { $set: { ...pattern, vectorStatus: 'pending', updatedAt: now }, $setOnInsert: { createdAt: now }, $unset: { embeddingModel: 1 } },
      upsert: true,
    },
  }));
  const result = await connection.db.collection('knowledges').bulkWrite(operations);
  console.log(`Knowledge DNA seeded: ${result.upsertedCount} inserted, ${result.modifiedCount} updated.`);
} finally {
  await connection.close();
}

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}
