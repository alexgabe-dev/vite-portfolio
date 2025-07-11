import { BlogPost } from '../types/blog';

const STRAPI_URL = "http://localhost:1337";

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch('/api/blog-posts?populate=*');
  const json = await res.json();
  if (!json.data || !Array.isArray(json.data)) return [];
  return json.data.map((item: any) => {
    const attrs = item.attributes || {};
    let coverImage;
    if (attrs.coverImage && Array.isArray(attrs.coverImage.data) && attrs.coverImage.data[0]?.attributes?.url) {
      coverImage = attrs.coverImage.data[0].attributes.url;
    } else if (attrs.coverImage?.data?.attributes?.url) {
      coverImage = attrs.coverImage.data.attributes.url;
    }
    return {
      id: item.id,
      title: attrs.title,
      slug: attrs.slug,
      author: attrs.author,
      content: attrs.content,
      excerpt: attrs.excerpt,
      publishedAt: attrs.publishedAt,
      createdAt: attrs.createdAt,
      updatedAt: attrs.updatedAt,
      coverImage,
      bodyBlocks: attrs.bodyBlocks,
      metaDescription: attrs.metaDescription,
      categories: attrs.categories?.data?.map((cat: any) => cat.attributes?.name) || [],
    };
  });
}