import axios from 'axios';

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY!;
const SUMMARIZATION_MODEL_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

export async function generateSummary(content: string): Promise<string> {
  // Truncate content if it's too long
  const maxContentLength = 1000; // BART has input length limits
  const truncatedContent = content.length > maxContentLength 
    ? content.substring(0, maxContentLength) + "..."
    : content;

  // For BART, we just send the content directly
  const requestData = {
    inputs: truncatedContent,
    parameters: {
      max_length: 150,
      min_length: 50,
      do_sample: false,
    },
  };

  try {
    const response = await axios.post(
      SUMMARIZATION_MODEL_URL,
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 seconds timeout
      }
    );

    if (!response.data || response.data.length === 0) {
      throw new Error('No response received from Hugging Face API');
    }

    const summary = response.data[0]?.summary_text || response.data[0]?.generated_text;
    
    if (!summary) {
      throw new Error('Empty summary received from Hugging Face API');
    }

    return summary.trim();
  } catch (error) {
    console.error('Error generating summary with Hugging Face:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ETIMEDOUT') {
        throw new Error('Request timed out. The AI service is taking too long to respond. Please try again.');
      }
      if (error.response) {
        console.error('HF API Response:', error.response.data);
        if (error.response.status === 503) {
          throw new Error('Model is currently loading. Please wait a minute and try again.');
        }
        throw new Error(`Hugging Face API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
      if (error.request) {
        throw new Error('Network error: Unable to reach Hugging Face API. Please check your internet connection.');
      }
    }
    
    throw new Error('Failed to generate summary');
  }
}

export async function translateToUrdu(englishSummary: string): Promise<string> {
  console.log('Starting translation to Urdu using Google Translate only...');
  
  // Use only Google Translate (MyMemory API)
  return await translateWithGoogleTranslate(englishSummary);
}

// Google Translate function (using MyMemory API)
async function translateWithGoogleTranslate(englishSummary: string): Promise<string> {
  try {
    console.log('Trying Google Translate (MyMemory API)...');
    
    // Using a free Google Translate API proxy
    const googleTranslateUrl = 'https://api.mymemory.translated.net/get';
    
    const response = await axios.get(googleTranslateUrl, {
      params: {
        q: englishSummary,
        langpair: 'en|ur'
      },
      timeout: 20000,
    });

    if (response.data && response.data.responseData && response.data.responseData.translatedText) {
      console.log('Google Translate (MyMemory) translation successful');
      return response.data.responseData.translatedText;
    }
    
    throw new Error('Google Translate failed');
  } catch (error) {
    console.error('Google Translate failed:', error);
    // Final fallback - return a formatted message
    return `[اردو ترجمہ - Urdu Translation]\n\n${englishSummary}\n\n[Note: Automatic translation services are temporarily unavailable. The above English text would be translated to Urdu.]`;
  }
}
