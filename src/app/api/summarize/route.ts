import { NextRequest, NextResponse } from 'next/server';
import { fetchBlogContent } from '@/lib/blog-fetcher';
import { generateSummary, translateToUrdu } from '@/lib/huggingface';
import { insertBlogPost } from '@/lib/mongodb';
import { supabase } from '@/lib/supabase';
import { SummarizeRequest, SummarizeResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: SummarizeRequest = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // Check if URL already exists in Supabase
    console.log('Checking for existing summary for URL:', url);
    const { data: existingSummary, error: checkError } = await supabase
      .from('summaries')
      .select('*')
      .eq('url', url)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error checking existing summary:', checkError);
    }

    if (existingSummary) {
      console.log('Found existing summary, returning cached result');
      
      // Parse existing summary
      const summaryText = existingSummary.summary;
      let summary = summaryText;
      let summaryUrdu = 'Translation not available';

      if (summaryText.includes('English:') && summaryText.includes('Urdu:')) {
        const parts = summaryText.split('Urdu:');
        summary = parts[0].replace('English:', '').trim();
        summaryUrdu = parts[1]?.trim() || 'Translation not available';
      }

      const response: SummarizeResponse = {
        success: true,
        data: {
          title: `Cached Summary from ${new URL(url).hostname}`,
          summary,
          summaryUrdu,
          blogId: 'cached',
        },
        cached: true,
      };

      return NextResponse.json(response);
    }

    // Step 1: Fetch blog content
    console.log('Fetching blog content from:', url);
    const blogContent = await fetchBlogContent(url);

    // Step 2: Store full blog text in MongoDB
    console.log('Storing blog content in MongoDB...');
    const blogId = await insertBlogPost({
      url,
      title: blogContent.title,
      content: blogContent.content,
      author: blogContent.author,
      publishedDate: blogContent.publishedDate,
      createdAt: new Date(),
    });

    // Step 3: Generate summary using AI
    console.log('Generating summary...');
    const summary = await generateSummary(blogContent.content);

    // Step 4: Translate summary to Urdu
    console.log('Translating to Urdu...');
    const summaryUrdu = await translateToUrdu(summary);

    // Step 5: Store summary in Supabase
    console.log('Storing summary in Supabase...');
    const { error: supabaseError } = await supabase
      .from('summaries')
      .insert({
        url: url,
        summary: `English: ${summary}\n\nUrdu: ${summaryUrdu}`,
        language: 'en,ur',
        created_at: new Date().toISOString(),
      });

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      throw new Error(`Failed to store summary: ${supabaseError.message}`);
    }

    const response: SummarizeResponse = {
      success: true,
      data: {
        title: blogContent.title,
        summary,
        summaryUrdu,
        blogId,
      },
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in summarize API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const response: SummarizeResponse = {
      success: false,
      error: errorMessage,
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get recent summaries from Supabase
    const { data, error } = await supabase
      .from('summaries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      throw new Error(`Failed to fetch summaries: ${error.message}`);
    }

    // Transform the data to match the expected format
    const transformedData = data?.map(item => ({
      id: item.id,
      originalUrl: item.url,
      title: `Summary from ${new URL(item.url).hostname}`,
      summary: item.summary.includes('English:') 
        ? item.summary.split('Urdu:')[0].replace('English:', '').trim()
        : item.summary,
      summaryUrdu: item.summary.includes('Urdu:')
        ? item.summary.split('Urdu:')[1]?.trim() || 'Translation not available'
        : 'Translation not available',
      createdAt: item.created_at,
    })) || [];

    return NextResponse.json({ success: true, data: transformedData });
  } catch (error) {
    console.error('Error fetching summaries:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
