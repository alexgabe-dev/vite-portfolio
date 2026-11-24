import type { Endpoint } from 'payload'
import { timingSafeEqual } from 'crypto'
import { buildExport } from '../lib/export'

const sameSecret = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b))

/** GET /api/blog-export — published-only snapshot for the static site build. */
export const blogExport: Endpoint = {
  path: '/blog-export',
  method: 'get',
  handler: async req => {
    const token = process.env.BLOG_EXPORT_TOKEN
    const given = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || ''
    if (token && !sameSecret(given, token)) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const data = await buildExport(req.payload)
    return Response.json(data, { headers: { 'cache-control': 'no-store' } })
  },
}

/** GET /api/health — liveness + database check for Docker and uptime monitors. */
export const health: Endpoint = {
  path: '/health',
  method: 'get',
  handler: async req => {
    try {
      await req.payload.count({ collection: 'users', overrideAccess: true })
      return Response.json({ ok: true, time: new Date().toISOString() }, { headers: { 'cache-control': 'no-store' } })
    } catch (error) {
      return Response.json({ ok: false, error: error instanceof Error ? error.message : 'db' }, { status: 503 })
    }
  },
}
