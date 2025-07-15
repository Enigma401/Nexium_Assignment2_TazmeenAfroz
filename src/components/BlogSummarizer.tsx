'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SummarizeResponse } from '@/types';
import { Loader2, ExternalLink, Copy, Check, Zap, Database } from 'lucide-react';

interface BlogSummarizerProps {
  onSummaryGenerated?: (summary: SummarizeResponse['data']) => void;
}

export default function BlogSummarizer({ onSummaryGenerated }: BlogSummarizerProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummarizeResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setIsCached(false);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data: SummarizeResponse = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
        setIsCached(data.cached || false);
        onSummaryGenerated?.(data.data);
      } else {
        setError(data.error || 'Failed to summarize blog');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const reset = () => {
    setUrl('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <ExternalLink className="h-5 w-5 text-blue-400" />
            Blog Summarizer
          </CardTitle>
          <CardDescription className="text-slate-400">
            Enter a blog URL to get an AI-generated summary in English and Urdu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/blog-post"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                className="flex-1 bg-slate-700/50 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-400"
                required
              />
              <Button 
                type="submit" 
                disabled={loading || !url.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Summarize'
                )}
              </Button>
            </div>
          </form>

          {error && (
            <Card className="mt-4 border-red-500/50 bg-red-900/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <p className="text-red-300">{error}</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-slate-100">Summary Generated</h3>
                  {isCached && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30 flex items-center gap-1">
                      <Database className="h-3 w-3" />
                      Cached
                    </span>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={reset}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
                >
                  New Summary
                </Button>
              </div>

              <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between text-slate-100">
                    Title
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(result.title, 'title')}
                      className="text-slate-400 hover:text-slate-100 hover:bg-slate-700/50"
                    >
                      {copiedField === 'title' ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{result.title}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between text-slate-100">
                    Summary (English)
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(result.summary, 'summary')}
                      className="text-slate-400 hover:text-slate-100 hover:bg-slate-700/50"
                    >
                      {copiedField === 'summary' ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed">{result.summary}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between text-slate-100">
                    خلاصہ (اردو)
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(result.summaryUrdu, 'urdu')}
                      className="text-slate-400 hover:text-slate-100 hover:bg-slate-700/50"
                    >
                      {copiedField === 'urdu' ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed text-right" dir="rtl">
                    {result.summaryUrdu}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-600 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        <strong className="text-slate-300">Blog ID:</strong> {result.blogId}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Full content in <span className="text-green-400">MongoDB</span> • Summary in <span className="text-yellow-400">Supabase</span>
                      </p>
                    </div>
                    {!isCached && (
                      <Zap className="h-5 w-5 text-blue-400" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
