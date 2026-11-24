import type { CollectionConfig } from 'payload'
import path from 'path'
import { anyone, authenticated } from '../lib/access'
import { markPublicDataChanged } from '../lib/deploy'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Kép', plural: 'Képek' },
  admin: { group: 'Tartalom', useAsTitle: 'alt', defaultColumns: ['filename', 'alt', 'width', 'height', 'updatedAt'] },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  upload: {
    // Originals live on a persistent volume outside the container image (MEDIA_DIR).
    staticDir: process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'],
    imageSizes: [{ name: 'thumbnail', width: 400, height: 300, position: 'centre' }],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    crop: true,
  },
  fields: [
    {
      name: 'alt', label: 'Alternatív szöveg', type: 'text', required: true, maxLength: 200,
      admin: { description: 'Mit ábrázol a kép? Ezt olvassa fel a képernyőolvasó, és ez jelenik meg, ha a kép nem tölt be.' },
    },
    { name: 'caption', label: 'Képaláírás', type: 'text', maxLength: 300 },
    { name: 'credit', label: 'Forrás / szerző', type: 'text', maxLength: 160, admin: { description: 'Pl. „Fotó: Unsplash / Név”. Megjelenik a kép alatt.' } },
  ],
  hooks: {
    afterChange: [({ doc }) => { markPublicDataChanged(`Kép módosult: ${doc.filename}`) }],
    afterDelete: [({ doc }) => { markPublicDataChanged(`Kép törölve: ${doc.filename}`) }],
  },
}
