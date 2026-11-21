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
run(['node_modules/typescript/bin/tsc', '--noEmit']);
run(['node_modules/vite/bin/vite.js', 'build']);
run(['scripts/prerender.mjs']);
run(['scripts/check-seo.mjs', ...(indexable ? ['--indexable'] : [])]);
// These files configure other hosts and must not be served as public pages.
for (const name of ['_headers', '_redirects']) {
  await unlink('dist/' + name).catch(error => { if (error.code !== 'ENOENT') throw error; });
}
console.log(`Vercel static build ready (${indexable ? 'production indexing enabled' : 'preview: noindex'}).`);
