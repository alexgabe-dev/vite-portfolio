import { readFileSync } from 'node:fs';
import path from 'node:path';

export type Id = number | string;
export type LexicalNode = { type: string; children?: LexicalNode[]; [key: string]: unknown };
export type Post = {
  id: Id; slug: string; previousSlugs: string[]; title: string; excerpt: string; content: { root: LexicalNode };
  author: Id; category: Id; publishedAt: string; contentUpdatedAt: string | null; coverImage: Id | null;
  metaTitle: string | null; metaDescription: string | null; shareImage: Id | null; relatedPosts: Id[];
  services: string[]; sources: { title: string; url: string; publisher: string | null }[];
};
export type Author = { id: Id; slug: string; name: string; jobTitle: string | null; bio: string | null; photo: Id | null; sameAs: string[] };
export type Category = { id: Id; slug: string; name: string; description: string | null };
export type MediaInfo = { width: number; height: number; alt: string; caption: string | null; credit: string | null; variants: { width: number; src: string }[]; og: string; generated?: boolean };
type Export = { fingerprint: string; posts: Post[]; authors: Author[]; categories: Category[]; unpublishedLinkTargets: Id[] };
export type Chrome = { header: string; footer: string; consent: string; stylesheet: string; headScript: string; fontPreload: string };

const dir = path.resolve(process.cwd(), '.generated');
const read = <T,>(file: string): T => JSON.parse(readFileSync(path.join(dir, file), 'utf8')) as T;

export const SITE = 'https://vizitor.hu';
export const PAGE_SIZE = 12;
export const content = read<Export>('content.json');
export const media = read<Record<string, MediaInfo>>('media.json');
export const chrome = read<Chrome>('chrome.json');
export const indexable = process.env.VIZITOR_INDEXABLE === 'true';
export const socialOrigin = process.env.VIZITOR_SOCIAL_ORIGIN || SITE;

export const posts = [...content.posts].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt) || String(a.id).localeCompare(String(b.id)));
export const authors = new Map(content.authors.map(a => [String(a.id), a]));
export const categories = new Map(content.categories.map(c => [String(c.id), c]));
export const postsById = new Map(posts.map(p => [String(p.id), p]));
export const authorOf = (p: Post) => authors.get(String(p.author))!;
export const categoryOf = (p: Post) => categories.get(String(p.category))!;
export const mediaOf = (id: Id | null | undefined) => (id == null ? undefined : media[String(id)]);
/** The uploaded cover, or the branded cover generated at build time. */
export const coverOf = (p: { id: Id; coverImage: Id | null }) => mediaOf(p.coverImage) || media[`cover:${p.id}`];

export const postUrl = (p: Post) => `/blog/${p.slug}/`;
export const categoryUrl = (c: Category, page = 1) => `/blog/kategoria/${c.slug}/${page > 1 ? `oldal/${page}/` : ''}`;
export const listUrl = (page = 1) => `/blog/${page > 1 ? `oldal/${page}/` : ''}`;
export const absolute = (p: string) => new URL(p, SITE).href;

/** Categories with at least one post; thin ones (single post) stay crawlable but are not indexed. */
export const usedCategories = content.categories
  .map(c => ({ category: c, posts: posts.filter(p => String(p.category) === String(c.id)) }))
  .filter(x => x.posts.length > 0)
  .sort((a, b) => b.posts.length - a.posts.length || a.category.name.localeCompare(b.category.name, 'hu'));
export const CATEGORY_INDEX_MIN = 2;

export function paginate<T>(items: T[]) {
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  return Array.from({ length: pages }, (_, i) => ({ page: i + 1, pages, items: items.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE) }));
}

const dateFormat = new Intl.DateTimeFormat('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Europe/Budapest' });
export const formatDate = (iso: string) => dateFormat.format(new Date(iso));
export const modifiedAt = (p: Post) => (p.contentUpdatedAt && Date.parse(p.contentUpdatedAt) > Date.parse(p.publishedAt) ? p.contentUpdatedAt : null);

/** Editor-picked related posts first, then the same category, then the newest. Deterministic. */
export function relatedTo(p: Post, count = 3) {
  const picked = p.relatedPosts.map(id => postsById.get(String(id))).filter((x): x is Post => Boolean(x) && x!.id !== p.id);
  const rest = posts.filter(x => x.id !== p.id && !picked.includes(x));
  const same = rest.filter(x => String(x.category) === String(p.category));
  return [...picked, ...same, ...rest.filter(x => !same.includes(x))].slice(0, count);
}

export const serviceLabels: Record<string, string> = {
  '/weboldalkeszites/': 'Weboldalkészítés', '/egyedi-webfejlesztes/': 'Egyedi webfejlesztés', '/online-marketing/': 'Hirdetéskezelés',
  '/keresooptimalizalas/': 'Keresőoptimalizálás', '/weboldal-karbantartas/': 'Weboldal-karbantartás', '/ai-chatbot-keszites/': 'AI-chatbot készítés',
  '/automatizalas/': 'Üzleti automatizálás', '/email-szerver-uzemeltetes/': 'E-mail-szerverek', '/webanalitika-meres/': 'Webanalitika és MarTech',
};

/** Publisher and site nodes, identical in @id to the main site's graph, so every blog page resolves on its own. */
export const baseGraph = [
  { '@type': 'Organization', '@id': SITE + '/#vizitor', name: 'Vizitor', url: SITE + '/', logo: { '@type': 'ImageObject', url: SITE + '/vizitor-logo-orange.svg', width: 328, height: 103 }, email: 'info@vizitor.hu', sameAs: ['https://www.facebook.com/vizitor.hu'] },
  { '@type': 'WebSite', '@id': SITE + '/#website', name: 'Vizitor', url: SITE + '/', inLanguage: 'hu-HU', publisher: { '@id': SITE + '/#vizitor' } },
];

/** The site's own 3D renders (public/graphics), so a post without a cover still looks like Vizitor. */
import { services as siteServices } from '../../../src/content/services';
export type Art = 'web' | 'systems' | 'growth';
export function artFor(p: Post): Art {
  const service = siteServices.find(s => p.services.includes(s.path));
  if (service) return service.art;
  const c = categoryOf(p).slug;
  if (/seo|kereso|marketing|hirdet|meres|analitik|growth/.test(c)) return 'growth';
  if (/fejleszt|automat|chatbot|ai-|email|szerver|rendszer|integr/.test(c)) return 'systems';
  return 'web';
}
export const artSrc = (art: Art) => `/graphics/${art}.webp`;
export const tone: Record<Art, string> = { web: '#c5c9c2', systems: '#b9bbc9', growth: '#cdc3bf' };
/** Background of the 3D renders themselves, so their tiles show no visible image edge. */
export const ARTBG = '#e8ebe8';

/** Title HTML where hyphenated words ("2026-ban", "e-mail") never break at the hyphen. */
export function titleHtml(text: string) {
  const esc = (x: string) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc(text).replace(/\S*\w-\w\S*/g, w => `<span class="nowrap">${w}</span>`);
}

/** The service a post's side card points to: the editor's choice, otherwise inferred from the topic. */
export function serviceFor(p: Post) {
  const picked = siteServices.find(s => p.services.includes(s.path));
  if (picked) return picked;
  const art = artFor(p);
  const c = categoryOf(p).slug;
  const path = art === 'growth' ? (/seo|kereso/.test(c) ? '/keresooptimalizalas/' : /meres|analitik/.test(c) ? '/webanalitika-meres/' : '/online-marketing/')
    : art === 'systems' ? '/egyedi-webfejlesztes/' : '/weboldalkeszites/';
  return siteServices.find(s => s.path === path)!;
}
