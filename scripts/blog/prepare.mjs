// Step 1 of the blog build: fetch the published snapshot from the CMS, validate it strictly,
// and turn every referenced image into static, responsive files for the Vercel deployment.
// Fails loudly on CMS errors or invalid published data — never ships an empty or demo blog.
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rm, access } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { build } from 'esbuild';
import { pathToFileURL } from 'node:url';
import { renderCover } from './covers.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const out = path.join(root, 'blog/.generated');
const cacheDir = path.join(root, '.cache/blog-media');
const require = createRequire(path.join(root, 'blog/package.json'));
const sharp = require('sharp');

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESERVED = new Set(['oldal', 'kategoria', 'szerzo', 'media', 'rss.xml', 'feed', 'build-info.json', '_astro', 'index', 'blog']);
const WIDTHS = [480, 800, 1200, 1600];

export class BlogBuildError extends Error {}
const fail = msg => { throw new BlogBuildError(msg); };

async function fetchExport(base, token) {
  const url = new URL('/api/blog-export', base);
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: token ? { authorization: `Bearer ${token}` } : {}, signal: AbortSignal.timeout(30_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      return await res.json();
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise(r => setTimeout(r, attempt * 2000));
    }
  }
  fail(`A CMS exportja nem érhető el (${url.origin}): ${lastError?.message}. A build leáll; a korábbi éles verzió marad.`);
}

function validate(data) {
  const errors = [];
  if (!data || data.schemaVersion !== 1) fail('Ismeretlen CMS-exportformátum (schemaVersion).');
  if (!/^[a-f0-9]{64}$/.test(data.fingerprint || '')) errors.push('Hiányzó vagy hibás fingerprint.');
  const media = new Map(data.media.map(m => [String(m.id), m]));
  const authors = new Map(data.authors.map(a => [String(a.id), a]));
  const categories = new Map(data.categories.map(c => [String(c.id), c]));
  const slugs = new Map();
  for (const c of data.categories) if (!SLUG.test(c.slug || '')) errors.push(`Kategória „${c.name}”: hibás slug.`);
  for (const a of data.authors) if (!a.name) errors.push(`Szerző ${a.id}: hiányzó név.`);
  for (const p of data.posts) {
    const label = `Cikk „${p.title || p.id}”`;
    for (const key of ['title', 'slug', 'excerpt', 'publishedAt']) if (!p[key]) errors.push(`${label}: hiányzik: ${key}.`);
    if (!p.content?.root?.children?.length) errors.push(`${label}: üres tartalom.`);
    if (p.slug && (!SLUG.test(p.slug) || RESERVED.has(p.slug))) errors.push(`${label}: érvénytelen slug „${p.slug}”.`);
    if (!authors.has(String(p.author))) errors.push(`${label}: a szerző nem található.`);
    if (!categories.has(String(p.category))) errors.push(`${label}: a kategória nem található.`);
    if (p.publishedAt && Number.isNaN(Date.parse(p.publishedAt))) errors.push(`${label}: hibás publikálási dátum.`);
    for (const ref of [p.coverImage, p.shareImage]) if (ref != null && !media.has(String(ref))) errors.push(`${label}: hiányzó kép (${ref}).`);
    for (const s of [p.slug, ...(p.previousSlugs || [])]) {
      if (slugs.has(s)) errors.push(`${label}: a „${s}” cím ütközik ezzel: ${slugs.get(s)}.`);
      slugs.set(s, label);
    }
  }
  for (const m of data.media) {
    if (!m.alt?.trim()) errors.push(`Kép ${m.filename}: hiányzik az alternatív szöveg.`);
    if (!/^image\//.test(m.mimeType || '')) errors.push(`Kép ${m.filename}: nem kép (${m.mimeType}).`);
  }
  if (errors.length) fail(`A publikált tartalom hibás, a build leáll:\n - ${errors.join('\n - ')}`);
}

async function exists(file) { try { await access(file); return true; } catch { return false; } }

async function processMedia(data, base) {
  await mkdir(cacheDir, { recursive: true });
  const publicMedia = path.join(out, 'public/media');
  await mkdir(publicMedia, { recursive: true });
  const manifest = {};
  for (const m of data.media) {
    const key = createHash('sha256').update(`${m.id}:${m.filename}:${m.updatedAt}`).digest('hex').slice(0, 10);
    const original = path.join(cacheDir, `${key}${path.extname(m.filename) || '.img'}`);
    if (!(await exists(original))) {
      const url = new URL(m.url, base);
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) }).catch(error => fail(`Kép letöltése sikertelen (${m.filename}): ${error.message}`));
      if (!res.ok) fail(`Kép letöltése sikertelen (${m.filename}): HTTP ${res.status}`);
      await writeFile(original, Buffer.from(await res.arrayBuffer()));
    }
    const image = sharp(original, { failOn: 'error' }).rotate();
    const meta = await image.metadata().catch(error => fail(`Hibás képfájl (${m.filename}): ${error.message}`));
    const width = meta.autoOrient?.width || meta.width, height = meta.autoOrient?.height || meta.height;
    const stem = `${String(m.id).replace(/[^a-z0-9]/gi, '')}-${key}`;
    const widths = [...new Set([...WIDTHS.filter(w => w < width), Math.min(width, 1600)])].sort((a, b) => a - b);
    const variants = [];
    for (const w of widths) {
      const file = `${stem}-${w}.webp`;
      const target = path.join(publicMedia, file);
      if (!(await exists(target))) await sharp(original).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(target);
      variants.push({ width: w, src: `/blog/media/${file}` });
    }
    // Social preview: 1200×630 JPEG cropped around the editor's focal point.
    const ogFile = `${stem}-og.jpg`;
    if (!(await exists(path.join(publicMedia, ogFile)))) {
      const fx = (m.focalX ?? 50) / 100, fy = (m.focalY ?? 50) / 100;
      const scale = Math.max(1200 / width, 630 / height);
      const sw = Math.round(width * scale), sh = Math.round(height * scale);
      const left = Math.max(0, Math.min(sw - 1200, Math.round(sw * fx - 600)));
      const top = Math.max(0, Math.min(sh - 630, Math.round(sh * fy - 315)));
      await sharp(original).rotate().resize(sw, sh).extract({ left, top, width: 1200, height: 630 }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(publicMedia, ogFile));
    }
    manifest[String(m.id)] = { width, height, alt: m.alt, caption: m.caption, credit: m.credit, variants, og: `/blog/media/${ogFile}` };
  }
  return manifest;
}

/** Header, footer, consent UI and stylesheet of the Vite site, so the blog is visually identical. */
async function extractChrome() {
  const html = await readFile(path.join(root, 'dist/impresszum/index.html'), 'utf8').catch(() => fail('A céges oldal buildje hiányzik (dist/impresszum/index.html); a blog a Vite build után futhat.'));
  const grab = (re, what) => html.match(re)?.[0] ?? fail(`A céges oldal HTML-jéből hiányzik: ${what}`);
  const header = grab(/<header id="top"[\s\S]*?<\/header>/, 'fejléc');
  const footer = grab(/<footer class="signature-footer"[\s\S]*?<\/footer>/, 'lábléc');
  const consent = grab(/<section class="consent-banner"[\s\S]*?<\/dialog>(?:<p class="[^"]*" role="status">[\s\S]*?<\/p>)?/, 'sütibanner');
  const stylesheet = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"/)?.[1] ?? fail('a fő stíluslap');
  const headScript = grab(/<script>\s*window\.dataLayer[\s\S]*?<\/script>/, 'consent alapértelmezések');
  const fontPreload = html.match(/<link rel="preload" href="\/fonts\/[^"]+"[^>]*>/)?.[0] || '';
  // The blog's own header entry is marked current; site section links keep their normal state.
  const markCurrent = s => s.replace(/(<a [^>]*href="\/blog\/"[^>]*?)(>)/g, (m, a, b) => (a.includes('aria-current') ? m : `${a} aria-current="page"${b}`));
  return { header: markCurrent(header), footer, consent, stylesheet, headScript, fontPreload };
}

/** Which of the site's 3D objects fits a post: its service, otherwise its topic. */
async function artResolver() {
  const out = path.join(root, '.cache/blog-services.mjs');
  await build({ entryPoints: [path.join(root, 'src/content/services.ts')], outfile: out, bundle: true, platform: 'node', format: 'esm', logLevel: 'silent' });
  const { services } = await import(pathToFileURL(out).href + '?t=' + Date.now());
  return (post, category) => {
    const service = services.find(s => (post.services || []).includes(s.path));
    if (service) return service.art;
    const c = category?.slug || '';
    if (/seo|kereso|marketing|hirdet|meres|analitik/.test(c)) return 'growth';
    if (/fejleszt|automat|chatbot|ai-|email|szerver|rendszer|integr/.test(c)) return 'systems';
    if (/kulissz|hir|bejelent|vizitor|blog/.test(c)) return 'signature';
    return 'web';
  };
}

/** Generated, branded covers for posts without an uploaded image (cards, hero, social preview). */
async function generateCovers(data, manifest) {
  const artOf = await artResolver();
  const categories = new Map(data.categories.map(c => [String(c.id), c]));
  const publicMedia = path.join(out, 'public/media');
  const version = createHash('sha256').update(await readFile(path.join(root, 'scripts/blog/covers.mjs'))).digest('hex').slice(0, 6);
  for (const post of data.posts) {
    const art = artOf(post, categories.get(String(post.category)));
    const key = createHash('sha256').update(`${post.id}:${art}:${version}`).digest('hex').slice(0, 10);
    const seed = `${post.id}:${post.slug}`;
    manifest[`art:${post.id}`] = { art };
    if (post.coverImage != null) continue;
    const stem = `cover-${String(post.id).replace(/[^a-z0-9]/gi, '')}-${key}`;
    const cached = path.join(cacheDir, `${stem}.png`);
    if (!(await exists(cached))) await writeFile(cached, await renderCover({ seed, art, width: 1600, height: 1000 }));
    const variants = [];
    for (const w of WIDTHS) {
      const file = `${stem}-${w}.webp`;
      if (!(await exists(path.join(publicMedia, file)))) await sharp(cached).resize({ width: w }).webp({ quality: 80, effort: 5 }).toFile(path.join(publicMedia, file));
      variants.push({ width: w, src: `/blog/media/${file}` });
    }
    const og = `${stem}-og.jpg`;
    if (!(await exists(path.join(publicMedia, og)))) await sharp(await renderCover({ seed, art, width: 1200, height: 630 })).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(publicMedia, og));
    manifest[`cover:${post.id}`] = { width: 1600, height: 1000, alt: '', caption: null, credit: null, variants, og: `/blog/media/${og}`, generated: true };
  }
}

export async function prepareBlog({ cmsUrl, token }) {
  const data = await fetchExport(cmsUrl, token);
  validate(data);
  if (!data.posts.length) return { enabled: false, reason: 'A CMS-ben nincs publikált cikk.' };
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  const media = await processMedia(data, cmsUrl);
  await mkdir(cacheDir, { recursive: true });
  await generateCovers(data, media);
  await writeFile(path.join(out, 'content.json'), JSON.stringify(data));
  await writeFile(path.join(out, 'media.json'), JSON.stringify(media));
  const serviceArticles = Object.create(null);
  const sortedPosts = [...data.posts].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  for (const post of sortedPosts) {
    for (const service of new Set(post.services || [])) {
      const articles = serviceArticles[service] ||= [];
      if (articles.length < 3) articles.push({ href: `/blog/${post.slug}/`, title: post.title, excerpt: post.excerpt });
    }
  }
  return { enabled: true, posts: data.posts.length, fingerprint: data.fingerprint, serviceArticles };
}
export async function writeChrome() {
  await writeFile(path.join(out, 'chrome.json'), JSON.stringify(await extractChrome()));
}
