import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function generateSummary(content: string, title: string): Promise<string> {
  // Truncate content if it's too long (OpenRouter has token limits)
  const maxContentLength = 8000; // Adjust based on model limits
  const truncatedContent = content.length > maxContentLength 
    ? content.substring(0, maxContentLength) + "..."
    : content;

  const messages: OpenRouterMessage[] = [
    {
      role: 'system',
      content: 'You are a helpful assistant that creates concise and informative summaries of blog posts. Provide a clear, well-structured summary in English that captures the main points and key insights.'
    },
    {
      role: 'user',
      content: `Please summarize this blog post titled "${title}":\n\n${truncatedContent}`
    }
  ];

  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: 'qwen/qwen-2.5-1.5b-instruct',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'Blog Summarizer App',
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 seconds timeout
      }
    );

    const data = response.data as OpenRouterResponse;
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response received from OpenRouter API');
    }

    const summary = data.choices[0].message.content.trim();
    if (!summary) {
      throw new Error('Empty summary received from OpenRouter API');
    }

    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ETIMEDOUT') {
        throw new Error('Request timed out. The AI service is taking too long to respond. Please try again.');
      }
      if (error.response) {
        throw new Error(`OpenRouter API error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown API error'}`);
      }
      if (error.request) {
        throw new Error('Network error: Unable to reach OpenRouter API. Please check your internet connection.');
      }
    }
    
    throw new Error('Failed to generate summary');
  }
}

export async function translateToUrdu(englishSummary: string): Promise<string> {
  const messages: OpenRouterMessage[] = [
    {
      role: 'system',
      content: 'You are a professional translator. Translate the given English text to Urdu accurately while maintaining the meaning and context. Provide only the translation without any additional text.'
    },
    {
      role: 'user',
      content: `Translate this English summary to Urdu:\n\n${englishSummary}`
    }
  ];

  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: 'microsoft/phi-3-mini-128k-instruct:free',
        messages,
        max_tokens: 600,
        temperature: 0.3,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'Blog Summarizer App',
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 seconds timeout
      }
    );

    const data = response.data as OpenRouterResponse;
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response received from OpenRouter API');
    }

    const translation = data.choices[0].message.content.trim();
    if (!translation) {
      throw new Error('Empty translation received from OpenRouter API');
    }

    return translation;
  } catch (error) {
    console.error('Error translating to Urdu:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ETIMEDOUT') {
        throw new Error('Translation request timed out. Please try again.');
      }
      if (error.response) {
        throw new Error(`OpenRouter API error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown API error'}`);
      }
      if (error.request) {
        throw new Error('Network error: Unable to reach OpenRouter API. Please check your internet connection.');
      }
    }
    
    throw new Error('Failed to translate to Urdu');
  }
}
