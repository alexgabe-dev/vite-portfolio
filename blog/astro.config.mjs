import { defineConfig } from 'astro/config';

// Served from the same Vercel deployment as the Vite site, under /blog/.
// The build script copies ./dist into the site's dist/blog/, so base and output paths match exactly.
export default defineConfig({
  site: 'https://vizitor.hu',
  base: '/blog',
  trailingSlash: 'always',
  outDir: './dist',
  publicDir: './.generated/public',
  build: { format: 'directory', assets: '_astro', inlineStylesheets: 'always' },
  compressHTML: true,
  prefetch: false,
  devToolbar: { enabled: false },
  vite: { server: { fs: { allow: ['..'] } } },
});
