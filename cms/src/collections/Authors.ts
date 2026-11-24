import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../lib/access'
import { slugify, validateSlug } from '../lib/slug'
import { markPublicDataChanged } from '../lib/deploy'

export const Authors: CollectionConfig = {
  slug: 'authors',
  labels: { singular: 'Szerző', plural: 'Szerzők' },
  admin: { group: 'Tartalom', useAsTitle: 'name', defaultColumns: ['name', 'jobTitle', 'updatedAt'] },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'name', label: 'Név', type: 'text', required: true },
    {
      name: 'slug', type: 'text', required: true, unique: true, index: true, validate: validateSlug,
      admin: { position: 'sidebar', description: 'Üresen hagyva a névből készül.' },
      hooks: { beforeValidate: [({ value, data }) => value || (data?.name ? slugify(data.name) : value)] },
    },
    { name: 'jobTitle', label: 'Szakmai szerep', type: 'text', admin: { description: 'Pl. „Webfejlesztő, a Vizitor alapítója”.' } },
    { name: 'bio', label: 'Rövid bemutatkozás', type: 'textarea', maxLength: 600 },
    { name: 'photo', label: 'Fotó', type: 'upload', relationTo: 'media' },
    {
      name: 'sameAs', label: 'Profilok', type: 'array', labels: { singular: 'Profil', plural: 'Profilok' },
      admin: { description: 'Valódi, nyilvános profilok (LinkedIn, GitHub). Strukturált adatként is megjelennek.' },
      fields: [{ name: 'url', label: 'URL', type: 'text', required: true, validate: (v: unknown) => (typeof v === 'string' && /^https:\/\/\S+$/.test(v)) || 'https:// kezdetű címet adj meg.' }],
    },
  ],
  hooks: {
    afterChange: [({ doc }) => { markPublicDataChanged(`Szerző módosult: ${doc.name}`) }],
    afterDelete: [({ doc }) => { markPublicDataChanged(`Szerző törölve: ${doc.name}`) }],
  },
}
