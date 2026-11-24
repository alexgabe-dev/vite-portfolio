import type { Payload } from 'payload'
import { buildExport } from './export'

/**
 * Publishing → Vercel build, without races or duplicate builds.
 *
 * Collection hooks only mark the public data as "possibly changed" (in memory). A single worker in the
 * server process waits until edits have been quiet for a few seconds — well after the database transaction
 * committed — then builds the same public snapshot the website build reads and compares its fingerprint
 * with the last one sent to Vercel. Only a real change of the published content queues a build, so
 * autosaved drafts never trigger one. Every attempt is recorded in the "Élesítési napló" (deploys) collection.
 */
type State = { dirtyAt: number; reasons: string[]; force: boolean; started: boolean; running: boolean; timer?: NodeJS.Timeout }
const g = globalThis as typeof globalThis & { __vizitorDeploy?: State }
const state: State = (g.__vizitorDeploy ??= { dirtyAt: 0, reasons: [], force: false, started: false, running: false })

const QUIET_MS = Number(process.env.DEPLOY_QUIET_MS || 4000)
const TICK_MS = 3000
const LIVE_CHECK_EVERY_MS = 30_000
const LIVE_TIMEOUT_MS = 30 * 60_000
const BACKOFF_MS = [30_000, 2 * 60_000, 10 * 60_000, 30 * 60_000]

export function markPublicDataChanged(reason: string, force = false) {
  state.dirtyAt = Date.now()
  if (state.reasons.length < 20) state.reasons.push(reason)
  if (force) state.force = true
}

const log = (payload: Payload, msg: string, extra?: unknown) => payload.logger.info({ msg: `[deploy] ${msg}`, extra })

async function lastSent(payload: Payload) {
  const res = await payload.find({
    collection: 'deploys', where: { status: { in: ['triggered', 'live', 'unconfirmed'] } },
    sort: '-createdAt', limit: 1, depth: 0, overrideAccess: true,
  })
  return res.docs[0] as { fingerprint?: string } | undefined
}

async function detectChanges(payload: Payload) {
  if (!state.dirtyAt || Date.now() - state.dirtyAt < QUIET_MS) return
  const reasons = state.reasons.splice(0), force = state.force
  state.dirtyAt = 0; state.force = false
  const snapshot = await buildExport(payload)
  const previous = await lastSent(payload)
  if (!force && previous?.fingerprint === snapshot.fingerprint) return
  // Nothing was ever published: there is no blog to build yet.
  if (!force && !previous && snapshot.posts.length === 0) return
  // A newer change replaces any build request that was not sent yet.
  await payload.update({ collection: 'deploys', where: { status: { equals: 'queued' } }, data: { status: 'superseded' }, overrideAccess: true })
  await payload.create({
    collection: 'deploys', overrideAccess: true,
    data: { status: 'queued', reason: reasons.join(' · ').slice(0, 1000) || 'Változás', fingerprint: snapshot.fingerprint, postCount: snapshot.posts.length, attempts: 0 },
  })
  log(payload, `queued build for ${snapshot.posts.length} published posts`, { fingerprint: snapshot.fingerprint })
}

async function sendQueued(payload: Payload) {
  const { docs } = await payload.find({ collection: 'deploys', where: { status: { equals: 'queued' } }, sort: '-createdAt', limit: 1, depth: 0, overrideAccess: true })
  const job = docs[0] as { id: number | string; attempts?: number; nextAttemptAt?: string } | undefined
  if (!job || (job.nextAttemptAt && Date.parse(job.nextAttemptAt) > Date.now())) return
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL
  if (!hook) {
    await payload.update({ collection: 'deploys', id: job.id, overrideAccess: true, data: { status: 'failed', lastError: 'VERCEL_DEPLOY_HOOK_URL nincs beállítva a szerveren.' } })
    return
  }
  const attempts = (job.attempts || 0) + 1
  try {
    const res = await fetch(hook, { method: 'POST', signal: AbortSignal.timeout(15_000) })
    const text = (await res.text()).slice(0, 500)
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`)
    await payload.update({ collection: 'deploys', id: job.id, overrideAccess: true, data: { status: 'triggered', attempts, triggeredAt: new Date().toISOString(), response: text, lastError: null, nextAttemptAt: null } })
    log(payload, 'Vercel build triggered')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    const giveUp = attempts > BACKOFF_MS.length
    await payload.update({
      collection: 'deploys', id: job.id, overrideAccess: true,
      data: { status: giveUp ? 'failed' : 'queued', attempts, lastError: message.slice(0, 500), nextAttemptAt: giveUp ? null : new Date(Date.now() + BACKOFF_MS[attempts - 1]).toISOString() },
    })
    payload.logger.error({ msg: `[deploy] trigger failed (attempt ${attempts})`, err: message })
  }
}

let lastLiveCheck = 0
async function confirmLive(payload: Payload) {
  const site = process.env.PUBLIC_SITE_URL
  if (!site || Date.now() - lastLiveCheck < LIVE_CHECK_EVERY_MS) return
  const { docs } = await payload.find({ collection: 'deploys', where: { status: { equals: 'triggered' } }, sort: '-createdAt', limit: 5, depth: 0, overrideAccess: true })
  if (!docs.length) return
  lastLiveCheck = Date.now()
  let live: string | undefined
  try {
    const res = await fetch(new URL(`/blog/build-info.json?t=${Date.now()}`, site), { signal: AbortSignal.timeout(10_000), headers: { 'cache-control': 'no-cache' } })
    if (res.ok) live = ((await res.json()) as { fingerprint?: string }).fingerprint
  } catch { /* The site may be mid-deploy; try again later. */ }
  for (const d of docs as { id: number | string; fingerprint?: string; triggeredAt?: string }[]) {
    if (live && d.fingerprint === live) {
      await payload.update({ collection: 'deploys', id: d.id, overrideAccess: true, data: { status: 'live', liveAt: new Date().toISOString() } })
      // Older requests that never went live were replaced by this deployment.
      await payload.update({ collection: 'deploys', overrideAccess: true, where: { and: [{ status: { equals: 'triggered' } }, { createdAt: { less_than: (d as { createdAt?: string }).createdAt } }] }, data: { status: 'superseded' } })
    } else if (d.triggeredAt && Date.now() - Date.parse(d.triggeredAt) > LIVE_TIMEOUT_MS) {
      await payload.update({ collection: 'deploys', id: d.id, overrideAccess: true, data: { status: 'unconfirmed', lastError: 'A build 30 percen belül nem jelent meg élesben. Nézd meg a Vercel deploymentet.' } })
    }
  }
}

export function startDeployWorker(payload: Payload) {
  if (state.started || process.env.DEPLOY_WORKER === 'off') return
  state.started = true
  markPublicDataChanged('Szerver indulása') // catches changes made while the worker was not running
  state.dirtyAt = Date.now() - QUIET_MS
  state.timer = setInterval(async () => {
    if (state.running) return
    state.running = true
    try { await detectChanges(payload); await sendQueued(payload); await confirmLive(payload) }
    catch (error) { payload.logger.error({ msg: '[deploy] worker error', err: error instanceof Error ? error.message : String(error) }) }
    finally { state.running = false }
  }, TICK_MS)
  state.timer.unref?.()
  log(payload, 'worker started')
}
