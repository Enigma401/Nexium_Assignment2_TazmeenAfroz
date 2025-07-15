'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BlogSummary } from '@/types';
import { History, ExternalLink, Copy, Check } from 'lucide-react';

export default function SummaryHistory() {
  const [summaries, setSummaries] = useState<BlogSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const response = await fetch('/api/summarize');
      const data = await response.json();

      if (data.success) {
        setSummaries(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch summaries');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span className="ml-2 text-slate-300">Loading summaries...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-6">
          <p className="text-red-300">{error}</p>
          <Button 
            onClick={fetchSummaries} 
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <History className="h-5 w-5 text-purple-400" />
          Recent Summaries
        </CardTitle>
        <CardDescription className="text-slate-400">
          Your recently generated blog summaries
        </CardDescription>
      </CardHeader>
      <CardContent>
        {summaries.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            No summaries yet. Generate your first summary above!
          </p>
        ) : (
          <div className="space-y-4">
            {summaries.map((summary) => (
              <Card key={summary.id} className="border-l-4 border-l-blue-400 bg-slate-800/30 border-slate-600 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base leading-tight text-slate-100">
                        {summary.title}
                      </CardTitle>
                      <CardDescription className="mt-1 text-slate-400">
                        <a
                          href={summary.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {new URL(summary.originalUrl).hostname}
                        </a>
                        <span className="mx-2">•</span>
                        <span>{formatDate(summary.createdAt.toString())}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-slate-300">
                          Summary (English)
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(summary.summary, `summary-${summary.id}`)}
                          className="text-slate-400 hover:text-slate-100 hover:bg-slate-700/50"
                        >
                          {copiedField === `summary-${summary.id}` ? (
                            <Check className="h-3 w-3 text-green-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {summary.summary}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-slate-300">
                          خلاصہ (اردو)
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(summary.summaryUrdu, `urdu-${summary.id}`)}
                          className="text-slate-400 hover:text-slate-100 hover:bg-slate-700/50"
                        >
                          {copiedField === `urdu-${summary.id}` ? (
                            <Check className="h-3 w-3 text-green-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed text-right" dir="rtl">
                        {summary.summaryUrdu}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
