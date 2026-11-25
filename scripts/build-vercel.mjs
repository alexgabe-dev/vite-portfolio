import { execFileSync } from 'node:child_process';
import { unlink } from 'node:fs/promises';

// Vercel serves the prerendered pages directly; the Sites Worker is not deployed.
const requested = process.env.VIZITOR_INDEXABLE;
const indexable = requested === 'true' || (requested !== 'false' && process.env.VERCEL_ENV === 'production');
const env = { ...process.env, VIZITOR_INDEXABLE: String(indexable) };
if (!indexable && !env.VIZITOR_PREVIEW_ORIGIN && env.VERCEL_URL) {
  env.VIZITOR_PREVIEW_ORIGIN = new URL('https://' + env.VERCEL_URL).origin;
}
const run = args => execFileSync(process.execPath, args, { env, stdio: 'inherit' });

// The static blog is built only when a CMS is configured. A configured but unreachable CMS,
// or invalid published data, stops the build so Vercel keeps serving the previous deployment.
const cmsUrl = process.env.BLOG_CMS_URL;
let blog = { enabled: false, reason: 'BLOG_CMS_URL nincs beállítva' };
if (cmsUrl) {
  const { prepareBlog } = await import('./blog/prepare.mjs');
  blog = await prepareBlog({ cmsUrl, token: process.env.BLOG_EXPORT_TOKEN });
}
env.VIZITOR_BLOG = String(blog.enabled);
env.VIZITOR_SERVICE_ARTICLES = JSON.stringify(blog.serviceArticles || {});

run(['node_modules/typescript/bin/tsc', '--noEmit']);
run(['node_modules/vite/bin/vite.js', 'build']);
run(['scripts/prerender.mjs']);
if (blog.enabled) {
  const { writeChrome } = await import('./blog/prepare.mjs');
  const { assembleBlog, mergeSitemap } = await import('./blog/assemble.mjs');
  await writeChrome();
  const socialOrigin = indexable ? 'https://vizitor.hu' : (env.VIZITOR_PREVIEW_ORIGIN || 'https://vizitor.hu');
  const { pages } = await assembleBlog({ indexable, socialOrigin });
  const { urls, redirects } = await mergeSitemap();
  console.log(`Blog: ${blog.posts} publikált cikk, ${pages} HTML-oldal, ${urls} sitemap-URL, ${redirects} slug-átirányítás. Tartalom: ${blog.fingerprint.slice(0, 12)}`);
} else {
  console.log(`Blog kihagyva: ${blog.reason}`);
}
run(['scripts/check-seo.mjs', ...(indexable ? ['--indexable'] : [])]);
// These files configure other hosts and must not be served as public pages.
for (const name of ['_headers', '_redirects']) {
  await unlink('dist/' + name).catch(error => { if (error.code !== 'ENOENT') throw error; });
}
console.log(`Vercel static build ready (${indexable ? 'production indexing enabled' : 'preview: noindex'}).`);
