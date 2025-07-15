import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    const { db } = await connectToDatabase();
    
    // Test the connection
    const result = await db.admin().ping();
    console.log('MongoDB ping result:', result);
    
    // Test creating a simple document
    const testCollection = db.collection('connection_test');
    const insertResult = await testCollection.insertOne({
      message: 'Connection test successful',
      timestamp: new Date()
    });
    
    // Clean up test document
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      database: db.databaseName,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      },
      { status: 500 }
    );
  }
}
