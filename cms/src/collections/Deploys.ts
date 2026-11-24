import type { CollectionConfig } from 'payload'
import { adminOnly, authenticated } from '../lib/access'
import { markPublicDataChanged } from '../lib/deploy'

const statusOptions = [
  { label: 'Várakozik', value: 'queued' },
  { label: 'Build elindítva (még nem él)', value: 'triggered' },
  { label: 'Élesben', value: 'live' },
  { label: 'Nem igazolt', value: 'unconfirmed' },
  { label: 'Hiba', value: 'failed' },
  { label: 'Újabb változás felváltotta', value: 'superseded' },
  { label: 'Kézi újraindítási kérés', value: 'request' },
]

export const Deploys: CollectionConfig = {
  slug: 'deploys',
  labels: { singular: 'Élesítés', plural: 'Élesítési napló' },
  admin: {
    group: 'Beállítások', useAsTitle: 'reason', defaultColumns: ['status', 'reason', 'postCount', 'triggeredAt', 'liveAt', 'createdAt'],
    description: 'Publikálás után a rendszer elindítja a weboldal buildjét. „Build elindítva”: a Vercel dolgozik rajta. „Élesben”: a változás már látszik a vizitor.hu-n. Kézi újraindítás: „Új létrehozása” → Mentés.',
  },
  access: { read: authenticated, create: authenticated, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'status', label: 'Állapot', type: 'select', options: statusOptions, defaultValue: 'queued', required: true, admin: { readOnly: true } },
    { name: 'reason', label: 'Ok', type: 'text', defaultValue: 'Kézi újraindítás' },
    { name: 'fingerprint', label: 'Tartalom-ujjlenyomat', type: 'text', admin: { readOnly: true } },
    { name: 'postCount', label: 'Publikált cikkek', type: 'number', admin: { readOnly: true } },
    { name: 'attempts', label: 'Próbálkozások', type: 'number', defaultValue: 0, admin: { readOnly: true } },
    { name: 'nextAttemptAt', type: 'date', admin: { readOnly: true, hidden: true } },
    { name: 'triggeredAt', label: 'Build indítva', type: 'date', admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'liveAt', label: 'Élesben', type: 'date', admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'lastError', label: 'Hiba', type: 'textarea', admin: { readOnly: true } },
    { name: 'response', label: 'Vercel válasz', type: 'textarea', admin: { readOnly: true } },
  ],
  hooks: {
    beforeChange: [({ data, operation, req }) => {
      // A manual entry from the admin becomes a forced rebuild request handled by the worker.
      if (operation === 'create' && req.user) return { ...data, status: 'request', reason: `Kézi kérés: ${data.reason || 'újraindítás'}` }
      return data
    }],
    afterChange: [({ doc, operation, req }) => { if (operation === 'create' && req.user) markPublicDataChanged(doc.reason, true) }],
  },
}
