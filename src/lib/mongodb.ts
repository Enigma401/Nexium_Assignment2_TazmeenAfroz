import { MongoClient, Db, ObjectId } from 'mongodb';
import { BlogPost } from '@/types';

const uri = process.env.MONGODB_URI!;
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();
  
  const db = client.db('blog_summarizer');
  
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}

export async function insertBlogPost(blogPost: Omit<BlogPost, 'id'>) {
  const { db } = await connectToDatabase();
  const collection = db.collection('blog_posts');
  const result = await collection.insertOne(blogPost);
  return result.insertedId.toString();
}

export async function getBlogPost(id: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection('blog_posts');
  return await collection.findOne({ _id: new ObjectId(id) });
}
