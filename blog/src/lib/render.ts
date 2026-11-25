import { codeToHtml, bundledLanguages } from 'shiki';
import { type LexicalNode, type Post, mediaOf, postsById, postUrl } from './data';
import { imageAttrs } from './images';

/** Renders Payload's Lexical JSON to static HTML at build time: no client JavaScript, no CMS requests. */
export type TocEntry = { id: string; text: string; level: 2 | 3 };
const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const FORMATS: [number, string][] = [[16, 'code'], [1, 'strong'], [2, 'em'], [8, 'u'], [4, 's'], [32, 'sub'], [64, 'sup'], [128, 'mark']];
const map: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ö: 'o', ő: 'o', ú: 'u', ü: 'u', ű: 'u' };
const anchor = (t: string) => t.toLowerCase().replace(/[áéíóöőúüű]/g, c => map[c]).normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'szakasz';

export function plainText(node: LexicalNode | undefined): string {
  if (!node) return '';
  if (node.type === 'text') return String(node.text ?? '');
  if (node.type === 'linebreak') return '\n';
  if (node.type === 'block' && (node.fields as { code?: string })?.code) return String((node.fields as { code: string }).code);
  return (node.children || []).map(plainText).join(node.type === 'root' || node.type === 'list' ? '\n' : node.type === 'paragraph' || node.type === 'heading' ? '' : ' ') + (['paragraph', 'heading', 'listitem', 'quote'].includes(node.type) ? '\n' : '');
}

function safeHref(url: string) {
  const value = url.trim();
  if (/^(https?:|mailto:|tel:)/i.test(value) || /^\/(?!\/)/.test(value) || value.startsWith('#')) return value;
  return null;
}

function wordCount(post: Post) {
  return (plainText(post.content.root).match(/[\p{L}\p{N}]+/gu) || []).length;
}

const minutesFromWords = (words: number) => Math.max(1, Math.round(words / 200));
export const readingMinutesOf = (post: Post) => minutesFromWords(wordCount(post));

export async function renderPost(post: Post) {
  const toc: TocEntry[] = [];
  const used = new Set<string>();
  let images = 0;
  async function children(node: LexicalNode) { return (await Promise.all((node.children || []).map(render))).join(''); }
  async function render(node: LexicalNode): Promise<string> {
    switch (node.type) {
      case 'root': return children(node);
      case 'text': {
        let html = esc(node.text).replace(/\n/g, '<br>');
        const format = Number(node.format || 0);
        for (const [bit, tag] of FORMATS) if (format & bit) html = `<${tag}>${html}</${tag}>`;
        return html;
      }
      case 'linebreak': return '<br>';
      case 'tab': return '\t';
      case 'paragraph': { const inner = await children(node); return inner.trim() ? `<p>${inner}</p>` : ''; }
      case 'heading': {
        const level = Math.min(4, Math.max(2, Number(String(node.tag).slice(1)) || 2));
        const text = plainText(node).trim();
        let id = anchor(text); let n = 2; while (used.has(id)) id = `${anchor(text)}-${n++}`; used.add(id);
        if (level <= 3 && text) toc.push({ id, text, level: level as 2 | 3 });
        return `<h${level} id="${id}">${await children(node)}</h${level}>`;
      }
      case 'list': {
        const tag = node.listType === 'number' ? 'ol' : 'ul';
        const start = tag === 'ol' && Number(node.start) > 1 ? ` start="${Number(node.start)}"` : '';
        return `<${tag}${start}>${await children(node)}</${tag}>`;
      }
      case 'listitem': {
        // Nested lists arrive as a list item that only wraps a list.
        const only = node.children?.length === 1 && node.children[0].type === 'list';
        return only ? `<li class="nested">${await children(node)}</li>` : `<li>${await children(node)}</li>`;
      }
      case 'quote': return `<blockquote>${await children(node)}</blockquote>`;
      case 'horizontalrule': return '<hr>';
      case 'link': case 'autolink': {
        const f = (node.fields || {}) as { url?: string; newTab?: boolean; linkType?: string; doc?: { relationTo?: string; value?: unknown } };
        const inner = await children(node);
        let href: string | null = null;
        if (f.linkType === 'internal') {
          const target = f.doc?.relationTo === 'posts' ? postsById.get(String(f.doc.value)) : undefined;
          href = target ? postUrl(target) : null; // links to unpublished articles render as text
        } else href = safeHref(f.url || '');
        if (!href) return inner;
        const external = /^https?:/i.test(href) && !/^https:\/\/(www\.)?vizitor\.hu/i.test(href);
        const attrs = f.newTab ? ' target="_blank" rel="noopener noreferrer"' : external ? ' rel="noopener"' : '';
        return `<a href="${esc(href)}"${attrs}>${inner}${f.newTab ? '<span class="sr-only"> (új lapon)</span>' : ''}</a>`;
      }
      case 'upload': {
        const info = mediaOf(node.value as string);
        if (!info) throw new Error(`Cikk „${post.title}”: a törzsben szereplő kép nincs az exportban.`);
        images++;
        const img = imageAttrs(info, { sizes: '(min-width: 900px) 760px, calc(100vw - 32px)', eager: false });
        const caption = [info.caption, info.credit].filter(Boolean).map(esc).join(' · ');
        return `<figure class="post-figure"><img ${img}>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
      }
      case 'table': {
        const rows = node.children || [];
        const body = await Promise.all(rows.map(async (row, r) => `<tr>${(await Promise.all((row.children || []).map(async cell => {
          const header = Number(cell.headerState || 0) > 0 || (r === 0 && Number(cell.headerState || 0) === 1);
          const tag = header ? 'th' : 'td';
          const span = Number(cell.colSpan) > 1 ? ` colspan="${Number(cell.colSpan)}"` : '';
          const scope = header ? (r === 0 ? ' scope="col"' : ' scope="row"') : '';
          return `<${tag}${span}${scope}>${(await children(cell)).replace(/^<p>|<\/p>$/g, '')}</${tag}>`;
        }))).join('')}</tr>`));
        return `<div class="table-wrap" role="region" aria-label="Táblázat" tabindex="0"><table>${body.join('')}</table></div>`;
      }
      case 'block': case 'inlineBlock': {
        const f = (node.fields || {}) as { blockType?: string; code?: string; language?: string };
        if (f.blockType === 'code') {
          const lang = f.language && f.language in bundledLanguages ? f.language : 'text';
          const html = await codeToHtml(String(f.code || ''), { lang, theme: 'github-dark-default' });
          return `<div class="code-block" data-lang="${esc(lang === 'text' ? '' : lang)}">${html}</div>`;
        }
        throw new Error(`Cikk „${post.title}”: ismeretlen tartalomblokk (${f.blockType}).`);
      }
      default:
        throw new Error(`Cikk „${post.title}”: ismeretlen tartalomelem (${node.type}). Frissítsd a blog renderelőjét.`);
    }
  }
  const html = await render(post.content.root);
  const words = wordCount(post);
  return { html, toc, words, readingMinutes: minutesFromWords(words), images };
}
