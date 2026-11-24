import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../lib/access'
import { slugify, validateSlug } from '../lib/slug'
import { markPublicDataChanged } from '../lib/deploy'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Kategória', plural: 'Kategóriák' },
  admin: { group: 'Tartalom', useAsTitle: 'name', defaultColumns: ['name', 'slug', 'updatedAt'] },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'name', label: 'Név', type: 'text', required: true },
    {
      name: 'slug', type: 'text', required: true, unique: true, index: true, validate: validateSlug,
      admin: { position: 'sidebar', description: 'Üresen hagyva a névből készül. A kategóriaoldal címe: /blog/kategoria/<slug>/' },
      hooks: { beforeValidate: [({ value, data }) => value || (data?.name ? slugify(data.name) : value)] },
    },
    { name: 'description', label: 'Leírás', type: 'textarea', maxLength: 400, admin: { description: 'A kategóriaoldal bevezetője és meta descriptionje.' } },
  ],
  hooks: {
    afterChange: [({ doc }) => { markPublicDataChanged(`Kategória módosult: ${doc.name}`) }],
    afterDelete: [({ doc }) => { markPublicDataChanged(`Kategória törölve: ${doc.name}`) }],
  },
}
