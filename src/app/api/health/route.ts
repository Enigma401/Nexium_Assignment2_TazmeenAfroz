import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic API functionality
    return NextResponse.json({
      success: true,
      message: 'Blog Summarizer API is working!',
      timestamp: new Date().toISOString(),
      status: 'ready'
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'API test failed' },
      { status: 500 }
    );
  }
}
