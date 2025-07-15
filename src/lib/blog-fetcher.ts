import axios from 'axios';
import * as cheerio from 'cheerio';

export interface BlogContent {
  title: string;
  content: string;
  author?: string;
  publishedDate?: string;
}

export async function fetchBlogContent(url: string): Promise<BlogContent> {
  try {
    // Validate URL
    new URL(url);
    
    console.log(`Attempting to fetch: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 15000,
      maxRedirects: 5,
    });

    console.log(`Response status: ${response.status}`);
    console.log(`Content length: ${response.data.length}`);

    const $ = cheerio.load(response.data);

    // Extract title with more selectors
    let title = '';
    const titleSelectors = [
      'title',
      'h1',
      '[property="og:title"]',
      '[name="twitter:title"]',
      '.post-title',
      '.entry-title',
      '.article-title',
      '.story-title'
    ];

    for (const selector of titleSelectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        title = element.attr('content') || element.text().trim();
        if (title) break;
      }
    }

    console.log(`Extracted title: ${title}`);

    // Extract main content with expanded selectors
    let content = '';
    
    const contentSelectors = [
      'article',
      '[role="main"]',
      '.post-content',
      '.entry-content',
      '.article-content',
      '.content',
      'main',
      '.post-body',
      '.story-body',
      '.story-content',
      '.article-body',
      '.post',
      '.entry',
      '.story',
      '[class*="content"]',
      '[class*="post"]',
      '[class*="article"]'
    ];

    let contentElement = null;
    for (const selector of contentSelectors) {
      contentElement = $(selector).first();
      if (contentElement.length > 0 && contentElement.text().trim().length > 100) {
        console.log(`Found content with selector: ${selector}`);
        break;
      }
    }

    if (!contentElement || contentElement.length === 0) {
      console.log('No specific content area found, trying paragraphs...');
      // If no specific content area found, get all meaningful paragraphs
      const paragraphs = $('p');
      const paragraphTexts: string[] = [];
      paragraphs.each((_, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 30) { // Lowered threshold
          paragraphTexts.push(text);
        }
      });
      content = paragraphTexts.join('\n\n');
    } else {
      // Remove unwanted elements
      const unwantedSelectors = [
        'script', 'style', 'nav', 'footer', 'header', 
        '.ad', '.advertisement', '.social', '.share',
        '.comment', '.sidebar', '.widget', '.menu'
      ];
      unwantedSelectors.forEach(selector => {
        contentElement!.find(selector).remove();
      });

      content = contentElement.text().trim();
    }

    console.log(`Content length after extraction: ${content.length}`);

    // Extract author with more selectors
    let author = '';
    const authorSelectors = [
      '[rel="author"]',
      '.author',
      '.byline',
      '[property="article:author"]',
      '.post-author',
      '.story-author',
      '[class*="author"]',
      '[name="author"]'
    ];

    for (const selector of authorSelectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        author = element.attr('content') || element.text().trim();
        if (author) break;
      }
    }

    // Extract published date with more selectors
    let publishedDate = '';
    const dateSelectors = [
      '[property="article:published_time"]',
      '[property="article:modified_time"]',
      'time[datetime]',
      '.published',
      '.date',
      '.post-date',
      '.story-date',
      '[class*="date"]'
    ];

    for (const selector of dateSelectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        publishedDate = element.attr('datetime') || 
                      element.attr('content') || 
                      element.text().trim();
        if (publishedDate) break;
      }
    }

    // Clean up content
    content = content
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n\n') // Clean up line breaks
      .trim();

    console.log(`Final content length: ${content.length}`);

    if (!content || content.length < 50) {
      console.error('Content too short or empty');
      // Try one more approach - get all text content
      const bodyText = $('body').text().trim();
      if (bodyText.length > 200) {
        content = bodyText.substring(0, 2000); // Take first 2000 chars as fallback
        console.log('Using body text as fallback');
      } else {
        throw new Error(`Could not extract meaningful content from the blog post. Content length: ${content.length}`);
      }
    }

    return {
      title: title.trim() || 'Untitled',
      content,
      author: author || undefined,
      publishedDate: publishedDate || undefined,
    };

  } catch (error) {
    console.error('Blog fetching error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch blog content: ${error.message}`);
    }
    throw new Error('Failed to fetch blog content');
  }
}
