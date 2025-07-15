# 🤖 AI Blog Summarizer

Transform any blog post into concise summaries using advanced AI. Get bilingual summaries in English and Urdu with intelligent content extraction and smart caching.

## ✨ Features

- 🧠 **AI-Powered Summarization** - Uses BART (Facebook/bart-large-cnn) for high-quality summaries
- 🌐 **Bilingual Support** - Automatic translation to Urdu using Google Translate
- 💾 **Smart Caching** - Duplicate URL detection prevents reprocessing
- 🎨 **Dark Theme** - Beautiful dark blue/black gradient design
- 📚 **Dual Database Storage** - MongoDB for full content, Supabase for summaries
- 📋 **Copy to Clipboard** - Easy sharing of generated content
- 📱 **Responsive Design** - Works on all device sizes

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Hugging Face API account (free)
- MongoDB Atlas account (free tier available)
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd blog-summarizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your actual API keys:

   ```env
   # Hugging Face API - Get from https://huggingface.co/settings/tokens
   HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxx

   # Supabase - Get from your Supabase project settings
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

   # MongoDB Atlas - Get from your MongoDB Atlas connection string
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=YourCluster
   ```

4. **Set up Supabase Database**
   
   Run this SQL in your Supabase SQL Editor:
   ```sql
   CREATE TABLE summaries (
     id SERIAL PRIMARY KEY,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     url TEXT NOT NULL,
     summary TEXT NOT NULL,
     language TEXT DEFAULT 'en,ur'
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **UI Components**: Custom components with Lucide icons
- **AI**: Hugging Face BART model for summarization
- **Translation**: Google Translate (MyMemory API)
- **Databases**: 
  - MongoDB Atlas (full blog content storage)
  - Supabase PostgreSQL (summary storage)

## 📖 How It Works

1. **URL Input**: Enter any blog URL
2. **Content Extraction**: Cheerio scrapes the blog content
3. **Duplicate Check**: System checks if URL was previously processed
4. **AI Summarization**: BART generates concise English summary
5. **Translation**: Google Translate converts to Urdu
6. **Storage**: Full content → MongoDB, Summary → Supabase
7. **Display**: Beautiful dark-themed interface with copy functionality

## 🎯 Architecture

```
Next.js App (Frontend + API routes)
├── Fetch blog content (Cheerio)
├── AI Summarization (BART via Hugging Face)
├── Translation (Google Translate)
├── Store full blog text (MongoDB Atlas)
└── Store summary (Supabase PostgreSQL)
```

## 🔧 API Endpoints

- `POST /api/summarize` - Process new blog URL
- `GET /api/summarize` - Get recent summaries

## 🌟 Key Features Explained

### Smart Caching
- Prevents duplicate processing of same URLs
- Returns cached results instantly
- Saves API costs and processing time

### Bilingual Output
- High-quality English summaries via BART
- Automatic Urdu translation
- Fallback system for translation failures

### Data Storage Strategy
- **MongoDB**: Full blog content with metadata
- **Supabase**: Structured summaries for quick access
- **Benefits**: Redundancy, optimized queries, scalability

## 🎨 UI/UX Features

- **Dark Theme**: Elegant slate/blue gradient design
- **Status Indicators**: Cached/fresh content badges
- **Copy Functionality**: One-click text copying
- **Responsive Layout**: Mobile-friendly design
- **Loading States**: Smooth user feedback

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `HUGGINGFACE_API_KEY` | Hugging Face API token | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | ✅ |
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ |

## 🔒 Security Notes

- **Never commit `.env.local` to version control** - It's already in `.gitignore`
- API keys are server-side only (except Supabase public key)
- All external API calls include timeout protection
- Input validation on all user-provided URLs

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub (`.env.local` will be automatically excluded)
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
Works with any Node.js hosting platform:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## 📊 Performance

- **Caching**: Duplicate URLs served instantly
- **Timeouts**: 60s for summarization, 20s for translation
- **Error Handling**: Graceful fallbacks for API failures
- **Optimizations**: Content truncation for large blogs

## 🔐 GitHub Upload Instructions

When uploading to GitHub:

1. **Your `.env.local` file will NOT be uploaded** (it's in `.gitignore`)
2. **Include the `.env.example` file** for other developers
3. **Never manually add API keys to any committed files**

To set up on a new machine:
```bash
git clone your-repo-url
cd blog-summarizer
npm install
cp .env.example .env.local
# Edit .env.local with your actual API keys
npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Troubleshooting

### Common Issues

**"Model is loading" error**
- Wait 1-2 minutes and try again
- Hugging Face models need warm-up time

**Translation not working**
- Check internet connection
- MyMemory API has rate limits

**Database connection errors**
- Verify MongoDB URI format
- Check Supabase credentials
- Ensure database tables exist

## 🔗 Useful Links

- [Hugging Face API Documentation](https://huggingface.co/docs/api-inference)
- [Supabase Documentation](https://supabase.com/docs)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/)
- [Next.js Documentation](https://nextjs.org/docs)

---

Built with ❤️ using AI and modern web technologies
