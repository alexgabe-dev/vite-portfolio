// Step 2 of the blog build: run Astro, then merge its output into the site's dist/ deterministically.
import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { BlogBuildError } from './prepare.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const blogDir = path.join(root, 'blog');
const astroOut = path.join(blogDir, 'dist');
const siteDist = path.join(root, 'dist');
const fail = msg => { throw new BlogBuildError(msg); };

async function files(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await files(full, base))); else out.push(path.relative(base, full));
  }
  return out;
}

export async function assembleBlog({ indexable, socialOrigin }) {
  await rm(astroOut, { recursive: true, force: true });
  execFileSync(process.execPath, [path.join(blogDir, 'node_modules/astro/bin/astro.mjs'), 'build', '--silent'], {
    cwd: blogDir, stdio: 'inherit',
    env: { ...process.env, VIZITOR_INDEXABLE: String(indexable), VIZITOR_SOCIAL_ORIGIN: socialOrigin, ASTRO_TELEMETRY_DISABLED: '1' },
  });
  // The blog owns dist/blog/ exclusively; the Vite site must never produce files there.
  const target = path.join(siteDist, 'blog');
  if (await stat(target).then(() => true, () => false)) fail('A dist/blog/ már létezik a Vite buildben — útvonalütközés.');
  const produced = await files(astroOut);
  const misplaced = produced.filter(f => f.startsWith('blog' + path.sep));
  if (misplaced.length) fail(`Dupla /blog/blog/ útvonal keletkezett: ${misplaced[0]}`);
  if (!produced.includes('index.html')) fail('Az Astro build nem hozta létre a blog főoldalát.');
  await cp(astroOut, target, { recursive: true, errorOnExist: true, force: false });

  // Assets referenced by blog HTML must exist under /blog/ (no silent fallbacks to the site's HTML).
  const html = produced.filter(f => f.endsWith('.html'));
  const missing = new Set();
  for (const file of html) {
    const doc = await readFile(path.join(target, file), 'utf8');
    for (const [, ref] of doc.matchAll(/(?:src|href)="(\/blog\/(?:_astro|media)\/[^"]+)"/g)) {
      if (!(await stat(path.join(siteDist, ref)).then(() => true, () => false))) missing.add(ref);
    }
    for (const [, set] of doc.matchAll(/srcset="([^"]+)"/g)) for (const part of set.split(',')) {
      const ref = part.trim().split(/\s+/)[0];
      if (ref.startsWith('/blog/') && !(await stat(path.join(siteDist, ref)).then(() => true, () => false))) missing.add(ref);
    }
  }
  if (missing.size) fail(`Hiányzó blogassetek: ${[...missing].slice(0, 5).join(', ')}`);
  return { pages: html.length };
}

/** Add indexable blog URLs (with real content dates) to the existing sitemap, keeping all site URLs. */
export async function mergeSitemap() {
  const content = JSON.parse(await readFile(path.join(blogDir, '.generated/content.json'), 'utf8'));
  const sitemapFile = path.join(siteDist, 'sitemap.xml');
  const sitemap = await readFile(sitemapFile, 'utf8');
  if (!sitemap.includes('</urlset>')) fail('A dist/sitemap.xml formátuma ismeretlen.');
  const posts = [...content.posts].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  const lastmod = p => (p.contentUpdatedAt && Date.parse(p.contentUpdatedAt) > Date.parse(p.publishedAt) ? p.contentUpdatedAt : p.publishedAt);
  const newest = posts.map(lastmod).sort().at(-1);
  const urls = [`<url><loc>https://vizitor.hu/blog/</loc><lastmod>${newest}</lastmod></url>`];
  const counts = new Map();
  for (const p of posts) counts.set(String(p.category), (counts.get(String(p.category)) || 0) + 1);
  for (const c of content.categories) if ((counts.get(String(c.id)) || 0) >= 2) urls.push(`<url><loc>https://vizitor.hu/blog/kategoria/${c.slug}/</loc></url>`);
  for (const p of posts) urls.push(`<url><loc>https://vizitor.hu/blog/${p.slug}/</loc><lastmod>${lastmod(p)}</lastmod></url>`);
  await writeFile(sitemapFile, sitemap.replace('</urlset>', urls.join('') + '</urlset>'));
  // Ready-made Vercel bulk-redirect file for renamed articles (Pro plan: set bulkRedirectsPath to it).
  const redirects = posts.flatMap(p => p.previousSlugs.map(old => ({ source: `/blog/${old}/`, destination: `/blog/${p.slug}/`, permanent: true })));
  await mkdir(path.join(root, '.vercel-generated'), { recursive: true });
  await writeFile(path.join(root, '.vercel-generated/blog-redirects.json'), JSON.stringify(redirects, null, 1));
  return { urls: urls.length, redirects: redirects.length };
}
