import { posts, absolute, authorOf, categoryOf, postUrl, SITE } from '../lib/data';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function GET() {
  const items = posts.slice(0, 50).map(p => `<item><title>${esc(p.title)}</title><link>${absolute(postUrl(p))}</link><guid isPermaLink="false">vizitor-post-${p.id}</guid><pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate><description>${esc(p.excerpt)}</description><category>${esc(categoryOf(p).name)}</category><dc:creator>${esc(authorOf(p).name)}</dc:creator></item>`).join('');
  const newest = posts.map(p => (p.contentUpdatedAt && p.contentUpdatedAt > p.publishedAt ? p.contentUpdatedAt : p.publishedAt)).sort().at(-1);
  const updated = newest ? new Date(newest).toUTCString() : '';
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>Vizitor blog</title><link>${SITE}/blog/</link><description>Gyakorlati írások weboldalakról, SEO-ról, mérésről és automatizálásról.</description><language>hu</language>${updated ? `<lastBuildDate>${updated}</lastBuildDate>` : ''}<atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}
