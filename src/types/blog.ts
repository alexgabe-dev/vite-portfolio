export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  author: string;
  content: any;
  excerpt?: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
  bodyBlocks?: any[];
  categories?: string[];
  metaDescription?: string;
} 