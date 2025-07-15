export interface BlogPost {
  id?: string;
  url: string;
  title: string;
  content: string;
  author?: string;
  publishedDate?: string;
  createdAt: Date;
}

export interface BlogSummary {
  id?: string;
  blogId: string;
  originalUrl: string;
  title: string;
  summary: string;
  summaryUrdu: string;
  createdAt: Date;
}

export interface SummarizeRequest {
  url: string;
}

export interface SummarizeResponse {
  success: boolean;
  data?: {
    title: string;
    summary: string;
    summaryUrdu: string;
    blogId: string;
  };
  error?: string;
  cached?: boolean;
}
