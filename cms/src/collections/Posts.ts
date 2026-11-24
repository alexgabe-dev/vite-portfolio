import type { CollectionConfig } from 'payload'
import {
  BlocksFeature, CodeBlock, EXPERIMENTAL_TableFeature, FixedToolbarFeature, HeadingFeature,
  HorizontalRuleFeature, LinkFeature, UploadFeature, lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { authenticated, publishedOrAuthenticated } from '../lib/access'
import { slugify, validateSlug } from '../lib/slug'
import { serviceOptions } from '../lib/services'
import { markPublicDataChanged } from '../lib/deploy'

const codeLanguages = {
  plaintext: 'Szöveg', bash: 'Bash', html: 'HTML', css: 'CSS', javascript: 'JavaScript', typescript: 'TypeScript',
  json: 'JSON', php: 'PHP', python: 'Python', sql: 'SQL', yaml: 'YAML', nginx: 'Nginx', markdown: 'Markdown',
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Cikk', plural: 'Cikkek' },
  admin: {
    group: 'Tartalom',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', '_status', 'publishedAt', 'updatedAt'],
    listSearchableFields: ['title', 'slug', 'excerpt'],
    description: 'Mentés = piszkozat. A „Publikálás” gomb után indul a weboldal frissítése (pár perc).',
  },
  access: {
    read: publishedOrAuthenticated,
    readVersions: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  // Drafts never touch the published document; autosave keeps editing safe without publishing anything.
  versions: { drafts: { autosave: { interval: 2000 } }, maxPerDoc: 50 },
  fields: [
    { name: 'title', label: 'Cím', type: 'text', required: true, maxLength: 140 },
    {
      name: 'excerpt', label: 'Kivonat', type: 'textarea', required: true, maxLength: 320,
      admin: { description: '1–3 mondat: miről szól a cikk, és mit tud meg belőle az olvasó. A listákban és megosztáskor jelenik meg.' },
    },
    {
      name: 'content', label: 'Tartalom', type: 'richText', required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures.filter(f => !['heading', 'checklist', 'relationship', 'align', 'indent', 'upload', 'link'].includes(f.key)),
          // H1 is the article title; the body starts at H2.
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          LinkFeature({ enabledCollections: ['posts'] }),
          UploadFeature({ collections: { media: { fields: [] } } }),
          HorizontalRuleFeature(),
          EXPERIMENTAL_TableFeature(),
          BlocksFeature({ blocks: [CodeBlock({ slug: 'code', defaultLanguage: 'plaintext', languages: codeLanguages })] }),
          FixedToolbarFeature(),
        ],
      }),
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Kapcsolatok',
          fields: [
            {
              name: 'relatedPosts', label: 'Kapcsolódó cikkek', type: 'relationship', relationTo: 'posts', hasMany: true, maxRows: 3,
              filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
              admin: { description: 'Legfeljebb 3. Ha üres, a build a kategória és frissesség alapján választ.' },
            },
            {
              name: 'services', label: 'Kapcsolódó Vizitor-szolgáltatás', type: 'select', hasMany: true, options: serviceOptions,
              admin: { description: 'A cikk végi ajánlat ezek közül az elsőre mutat. Ha üres, a kapcsolatfelvételre.' },
            },
            {
              name: 'sources', label: 'Források', type: 'array', labels: { singular: 'Forrás', plural: 'Források' },
              admin: { description: 'Ellenőrizhető források a cikk állításaihoz. A cikk végén listaként jelennek meg.' },
              fields: [
                { name: 'title', label: 'Cím', type: 'text', required: true },
                { name: 'url', label: 'URL', type: 'text', required: true, validate: (v: unknown) => (typeof v === 'string' && /^https?:\/\/\S+$/.test(v)) || 'Teljes, http(s):// kezdetű címet adj meg.' },
                { name: 'publisher', label: 'Kiadó / oldal', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'SEO és megosztás',
          fields: [
            { name: 'metaTitle', label: 'SEO-cím', type: 'text', maxLength: 70, admin: { description: 'Ha üres, a cikk címe. Kb. 50–60 karakter ideális.' } },
            { name: 'metaDescription', label: 'Meta description', type: 'textarea', maxLength: 170, admin: { description: 'Ha üres, a kivonat. Kb. 120–160 karakter.' } },
            { name: 'shareImage', label: 'Megosztási kép', type: 'upload', relationTo: 'media', admin: { description: 'Ha üres, a borítókép, ha az sincs, a Vizitor alapértelmezett képe.' } },
          ],
        },
      ],
    },
    // Sidebar
    {
      name: 'slug', type: 'text', required: true, unique: true, index: true, validate: validateSlug,
      admin: { position: 'sidebar', description: 'A cikk címe: /blog/<slug>/. Üresen hagyva a címből készül. Publikálás után a régi cím átirányítást kap.' },
      hooks: { beforeValidate: [({ value, data }) => value || (data?.title ? slugify(data.title) : value)] },
    },
    { name: 'author', label: 'Szerző', type: 'relationship', relationTo: 'authors', required: true, admin: { position: 'sidebar' } },
    { name: 'category', label: 'Kategória', type: 'relationship', relationTo: 'categories', required: true, admin: { position: 'sidebar' } },
    { name: 'coverImage', label: 'Borítókép', type: 'upload', relationTo: 'media', admin: { position: 'sidebar' } },
    {
      name: 'publishedAt', label: 'Publikálás dátuma', type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' }, description: 'Első publikáláskor automatikusan kitöltődik.' },
    },
    {
      name: 'contentUpdatedAt', label: 'Érdemi frissítés dátuma', type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' }, description: 'Csak tartalmi frissítésnél változik (lásd lent), elírás javításánál nem.' },
    },
    {
      name: 'significantUpdate', label: 'Ez érdemi tartalmi frissítés', type: 'checkbox', defaultValue: false,
      admin: { position: 'sidebar', description: 'Bejelölve a következő publikáláskor a frissítés dátuma a mai nap lesz.' },
    },
    {
      name: 'previousSlugs', label: 'Korábbi címek', type: 'array', labels: { singular: 'Korábbi cím', plural: 'Korábbi címek' },
      admin: { position: 'sidebar', readOnly: true, description: 'Ezekről a címekről a blog átirányít az aktuálisra.' },
      fields: [{ name: 'slug', type: 'text', required: true }],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, originalDoc, operation }) => {
        if (data._status !== 'published') return data
        const now = new Date().toISOString()
        if (!data.publishedAt) data.publishedAt = now
        if (data.significantUpdate) { data.contentUpdatedAt = now; data.significantUpdate = false }
        // Keep the old public URL alive when a published slug changes.
        if (operation === 'update' && originalDoc?.id) {
          const live = await req.payload.findByID({ collection: 'posts', id: originalDoc.id, draft: false, depth: 0, req, overrideAccess: true }).catch(() => null)
          const history = new Set<string>((data.previousSlugs ?? originalDoc.previousSlugs ?? []).map((r: { slug: string }) => r.slug))
          if (live?._status === 'published' && live.slug && live.slug !== data.slug) history.add(live.slug)
          history.delete(data.slug)
          data.previousSlugs = [...history].map(slug => ({ slug }))
        }
        if (Array.isArray(data.relatedPosts) && originalDoc?.id) {
          data.relatedPosts = data.relatedPosts.filter((rel: unknown) => (typeof rel === 'object' && rel ? (rel as { id: unknown }).id : rel) !== originalDoc.id)
        }
        return data
      },
    ],
    afterChange: [({ doc }) => { markPublicDataChanged(`Cikk: ${doc.title || doc.id} (${doc._status === 'published' ? 'publikált' : 'piszkozat'})`) }],
    afterDelete: [({ doc }) => { markPublicDataChanged(`Cikk törölve: ${doc.title || doc.id}`) }],
  },
}
