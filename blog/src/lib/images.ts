import type { MediaInfo } from './data';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Responsive <img> attributes with reserved space; the LCP image is never lazy-loaded. */
export function imageAttrs(info: MediaInfo, { sizes, eager }: { sizes: string; eager: boolean }) {
  const largest = info.variants[info.variants.length - 1];
  const fallback = info.variants.find(v => v.width >= 800) || largest;
  const height = Math.round((largest.width / info.width) * info.height);
  return [
    `src="${fallback.src}"`,
    `srcset="${info.variants.map(v => `${v.src} ${v.width}w`).join(', ')}"`,
    `sizes="${sizes}"`,
    `width="${largest.width}"`, `height="${height}"`,
    `alt="${esc(info.alt)}"`,
    eager ? 'fetchpriority="high"' : 'loading="lazy"',
    'decoding="async"',
  ].join(' ');
}
