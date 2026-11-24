import type { CollectionConfig } from 'payload'
import { adminOnly, adminOnlyField, isAdmin } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Felhasználó', plural: 'Felhasználók' },
  admin: { useAsTitle: 'email', group: 'Beállítások', defaultColumns: ['email', 'name', 'role'] },
  // API keys let a later integration (e.g. an agent) use the documented REST API with its own revocable credential.
  auth: { useAPIKey: true, tokenExpiration: 60 * 60 * 8, maxLoginAttempts: 8, lockTime: 15 * 60 * 1000 },
  access: {
    read: ({ req }) => (isAdmin({ req }) ? true : req.user ? { id: { equals: req.user.id } } : false),
    create: adminOnly,
    update: ({ req }) => (isAdmin({ req }) ? true : req.user ? { id: { equals: req.user.id } } : false),
    delete: adminOnly,
  },
  fields: [
    { name: 'name', label: 'Név', type: 'text' },
    {
      name: 'role', label: 'Szerepkör', type: 'select', required: true, defaultValue: 'editor',
      options: [{ label: 'Adminisztrátor', value: 'admin' }, { label: 'Szerkesztő', value: 'editor' }],
      access: { update: adminOnlyField, create: adminOnlyField },
      admin: { description: 'Az adminisztrátor felhasználókat is kezelhet.' },
    },
  ],
  hooks: {
    beforeChange: [
      // The very first account (created via /admin/create-first-user) becomes the administrator.
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req, overrideAccess: true })
          if (totalDocs === 0) data.role = 'admin'
        }
        return data
      },
    ],
  },
}
