const map: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ö: 'o', ő: 'o', ú: 'u', ü: 'u', ű: 'u' }

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
/** Paths the blog itself uses; an article must never shadow them. */
export const RESERVED_SLUGS = new Set(['oldal', 'kategoria', 'szerzo', 'media', 'rss.xml', 'feed', 'build-info.json', '_astro', 'index', 'blog'])

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[áéíóöőúüű]/g, c => map[c] || c)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '')
}

export function validateSlug(value: unknown): true | string {
  if (value == null || value === '') return true // required-ness is enforced separately (drafts may be incomplete)
  if (typeof value !== 'string') return 'Érvénytelen slug.'
  if (value.length > 80) return 'A slug legfeljebb 80 karakter lehet.'
  if (!SLUG_PATTERN.test(value)) return 'Csak kisbetű, szám és kötőjel használható (pl. weboldal-arak-2026).'
  if (RESERVED_SLUGS.has(value)) return `A „${value}” foglalt útvonal, válassz másikat.`
  return true
}
