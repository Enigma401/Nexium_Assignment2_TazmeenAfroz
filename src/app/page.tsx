'use client';

import { useState } from 'react';
import BlogSummarizer from '@/components/BlogSummarizer';
import SummaryHistory from '@/components/SummaryHistory';

export default function Home() {
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleSummaryGenerated = () => {
    // Trigger a refresh of the history component
    setRefreshHistory(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            AI Blog Summarizer
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Transform any blog post into concise summaries using advanced AI. 
            Get summaries in both English and Urdu with automatic content extraction 
            and intelligent analysis.
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
              ✨ AI Powered
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
              🌐 Bilingual
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full border border-green-500/30">
              💾 Smart Caching
            </span>
          </div>
        </div>

        <div className="space-y-8">
          <BlogSummarizer onSummaryGenerated={handleSummaryGenerated} />
          <SummaryHistory key={refreshHistory} />
        </div>

        <footer className="mt-16 text-center text-slate-400 text-sm">
          <div className="border-t border-slate-700 pt-8">
            <p className="mb-2">
              Powered by <span className="text-blue-400">BART AI</span> & <span className="text-purple-400">Google Translate</span>
            </p>
            <p>
              Data stored in <span className="text-green-400">MongoDB Atlas</span> & <span className="text-yellow-400">Supabase</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
