
import GhostContentAPI from '@tryghost/content-api';
import { BlogPost } from '../types/blog';

const api = new GhostContentAPI({
  url: import.meta.env.VITE_GHOST_API_URL || 'http://localhost:2368',
  key: import.meta.env.VITE_GHOST_CONTENT_API_KEY || '',
  version: "v5.0"
});

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await api.posts.browse({
      include: ['tags', 'authors'],
      limit: 'all'
    });

    // Convert Ghost PostOrPage to our BlogPost type if necessary, 
    // but the types should mostly align. Casting for simplicity here as Ghost types are loose.
    return posts as unknown as BlogPost[];
  } catch (err) {
    console.error('Failed to fetch posts from Ghost:', err);
    return [];
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await api.posts.read({
      slug
    }, {
      include: ['tags', 'authors']
    });
    return post as unknown as BlogPost;
  } catch (err) {
    console.error(`Failed to fetch post ${slug} from Ghost:`, err);
    return null;
  }
}