import { content, posts } from '../lib/data';
// Lets the CMS confirm that a published change is really live (see cms/src/lib/deploy.ts).
export function GET() {
  return new Response(JSON.stringify({ fingerprint: content.fingerprint, posts: posts.map(p => ({ id: p.id, slug: p.slug })) }), { headers: { 'content-type': 'application/json' } });
}
