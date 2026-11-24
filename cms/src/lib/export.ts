import { createHash } from 'crypto'
import type { Payload } from 'payload'

/**
 * The single public snapshot of the blog. The static Vercel build reads exactly this,
 * and the deploy worker fingerprints exactly this, so "what changed" and "what gets built" never diverge.
 * Only published documents are included.
 */
export const EXPORT_SCHEMA_VERSION = 1

type Id = number | string
type Rel = Id | { id: Id } | null | undefined
const idOf = (rel: Rel): Id | null => (rel == null ? null : typeof rel === 'object' ? rel.id : rel)

function collectUploads(node: unknown, out: Set<Id>, links: Set<Id>) {
  if (!node || typeof node !== 'object') return
  const n = node as Record<string, unknown>
  if (n.type === 'upload' && n.relationTo === 'media') { const id = idOf(n.value as Rel); if (id != null) out.add(id) }
  const fields = n.fields as Record<string, unknown> | undefined
  if ((n.type === 'link' || n.type === 'autolink') && fields?.linkType === 'internal') {
    const doc = fields.doc as { relationTo?: string; value?: Rel } | undefined
    const id = idOf(doc?.value); if (doc?.relationTo === 'posts' && id != null) links.add(id)
  }
  for (const child of (n.children as unknown[]) || []) collectUploads(child, out, links)
  if (n.root) collectUploads(n.root, out, links)
}

/** Replace populated relation objects by ids so the snapshot is stable and small. */
function normalizeLexical(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(normalizeLexical)
  if (!node || typeof node !== 'object') return node
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
    if (k === 'value' && (node as { type?: string }).type === 'upload') out[k] = idOf(v as Rel)
    else if (k === 'doc' && v && typeof v === 'object' && 'value' in (v as object)) out[k] = { relationTo: (v as { relationTo: string }).relationTo, value: idOf((v as { value: Rel }).value) }
    else out[k] = normalizeLexical(v)
  }
  return out
}

export async function buildExport(payload: Payload) {
  const posts = await payload.find({
    collection: 'posts', where: { _status: { equals: 'published' } }, draft: false, depth: 0,
    limit: 0, pagination: false, sort: '-publishedAt', overrideAccess: true,
  })
  const mediaIds = new Set<Id>(), authorIds = new Set<Id>(), categoryIds = new Set<Id>(), linkedIds = new Set<Id>()
  const items = posts.docs.map(doc => {
    const d = doc as unknown as Record<string, unknown> & { id: Id }
    const content = normalizeLexical(d.content)
    collectUploads(content, mediaIds, linkedIds)
    for (const rel of [d.coverImage, d.shareImage] as Rel[]) { const id = idOf(rel); if (id != null) mediaIds.add(id) }
    const author = idOf(d.author as Rel), category = idOf(d.category as Rel)
    if (author != null) authorIds.add(author)
    if (category != null) categoryIds.add(category)
    return {
      id: d.id,
      slug: d.slug as string,
      previousSlugs: ((d.previousSlugs as { slug: string }[]) || []).map(r => r.slug).sort(),
      title: d.title as string,
      excerpt: d.excerpt as string,
      content,
      author,
      category,
      publishedAt: (d.publishedAt as string) || null,
      contentUpdatedAt: (d.contentUpdatedAt as string) || null,
      coverImage: idOf(d.coverImage as Rel),
      metaTitle: (d.metaTitle as string) || null,
      metaDescription: (d.metaDescription as string) || null,
      shareImage: idOf(d.shareImage as Rel),
      relatedPosts: ((d.relatedPosts as Rel[]) || []).map(idOf).filter((x): x is Id => x != null),
      services: (d.services as string[]) || [],
      sources: ((d.sources as { title: string; url: string; publisher?: string }[]) || []).map(s => ({ title: s.title, url: s.url, publisher: s.publisher || null })),
    }
  })
  const find = async (collection: 'authors' | 'categories' | 'media', ids: Set<Id>) => ids.size
    ? (await payload.find({ collection, where: { id: { in: [...ids] } }, depth: 0, limit: 0, pagination: false, overrideAccess: true })).docs as unknown as Record<string, unknown>[]
    : []
  const authors = (await find('authors', authorIds)).map(a => {
    const photo = idOf(a.photo as Rel); if (photo != null) mediaIds.add(photo)
    return { id: a.id as Id, slug: a.slug as string, name: a.name as string, jobTitle: (a.jobTitle as string) || null, bio: (a.bio as string) || null, photo, sameAs: ((a.sameAs as { url: string }[]) || []).map(s => s.url) }
  })
  const categories = (await find('categories', categoryIds)).map(c => ({ id: c.id as Id, slug: c.slug as string, name: c.name as string, description: (c.description as string) || null }))
  const media = (await find('media', mediaIds)).map(m => ({
    id: m.id as Id, filename: m.filename as string, url: m.url as string, mimeType: m.mimeType as string,
    width: (m.width as number) || null, height: (m.height as number) || null, filesize: (m.filesize as number) || null,
    alt: (m.alt as string) || '', caption: (m.caption as string) || null, credit: (m.credit as string) || null,
    focalX: (m.focalX as number) ?? null, focalY: (m.focalY as number) ?? null, updatedAt: m.updatedAt as string,
  }))
  const byId = <T extends { id: Id }>(xs: T[]) => xs.sort((a, b) => String(a.id).localeCompare(String(b.id), 'en', { numeric: true }))
  const body = {
    schemaVersion: EXPORT_SCHEMA_VERSION,
    posts: items,
    authors: byId(authors),
    categories: byId(categories),
    media: byId(media),
    // Internal links to posts that are not published must not render as broken links.
    unpublishedLinkTargets: [...linkedIds].filter(id => !items.some(p => p.id === id)),
  }
  const fingerprint = createHash('sha256').update(JSON.stringify(body)).digest('hex')
  return { ...body, fingerprint, generatedAt: new Date().toISOString() }
}
export type BlogExport = Awaited<ReturnType<typeof buildExport>>
