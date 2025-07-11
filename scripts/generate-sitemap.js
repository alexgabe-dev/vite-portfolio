// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const SITE_URL = 'https://vizitor.hu';
const STRAPI_API = 'https://localhost:1337/api/blog-posts?fields=slug,publishedAt&pagination[pageSize]=100';

async function fetchBlogSlugs() {
  const res = await fetch(STRAPI_API);
  const json = await res.json();
  if (!json.data) return [];
  return json.data.map(post => ({
    slug: post.attributes.slug,
    publishedAt: post.attributes.publishedAt || new Date().toISOString()
  }));
}

async function generateSitemap() {
  // Statikus oldalak
  const staticPages = [
    { url: '', priority: 1.0, changefreq: 'weekly' },
    { url: 'szolgaltatasok', priority: 0.9, changefreq: 'weekly' },
    { url: 'kapcsolat', priority: 1.0, changefreq: 'monthly' },
    { url: 'csomagok', priority: 0.8, changefreq: 'weekly' },
    { url: 'adatvedelem', priority: 0.5, changefreq: 'monthly' },
    { url: 'blog', priority: 0.8, changefreq: 'weekly' },
  ];

  // Blogcikkek
  const blogPosts = await fetchBlogSlugs();

  const urls = [
    ...staticPages.map(page =>
      `<url>\n  <loc>${SITE_URL}/${page.url}</loc>\n  <changefreq>${page.changefreq}</changefreq>\n  <priority>${page.priority}</priority>\n</url>`
    ),
    ...blogPosts.map(post =>
      `<url>\n  <loc>${SITE_URL}/blog/${post.slug}</loc>\n  <lastmod>${post.publishedAt.slice(0,10)}</lastmod>\n  <changefreq>weekly</changefreq>\n  <priority>0.7</priority>\n</url>`
    )
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

  const outPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outPath, sitemap, 'utf8');
  console.log('✅ Sitemap generated with', blogPosts.length, 'blog posts.');
}

generateSitemap().catch(err => {
  console.error('❌ Sitemap generation failed:', err);
  process.exit(1);
}); 