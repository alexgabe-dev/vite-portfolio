
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  html: string;
  excerpt?: string;
  feature_image?: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  reading_time?: number;
  primary_author?: {
    name: string;
    profile_image?: string;
  };
  tags?: {
    name: string;
    slug: string;
  }[];
  meta_title?: string;
  meta_description?: string;
}