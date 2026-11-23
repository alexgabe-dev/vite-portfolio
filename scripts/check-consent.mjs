import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { pathToFileURL } from 'node:url';
import { readFile, mkdir } from 'node:fs/promises';
await mkdir('.cache', { recursive: true });
await build({ entryPoints: ['src/consent.ts'], outfile: '.cache/check-consent-module.mjs', bundle: true, platform: 'node', format: 'esm' });
const { CONSENT_KEY, CONSENT_MAX_AGE, parseConsent, consentSignals, consentRevision, createConsentManager } = await import(pathToFileURL(process.cwd() + '/.cache/check-consent-module.mjs'));
const config = { analyticsId: 'G-6XTDE9Y48B' };
const revision = consentRevision(config);
const record = (analytics, savedAt = Date.now(), version = revision) => JSON.stringify({ analytics, savedAt, revision: version });
function fake(raw = null, storageFails = false) {
 const store = new Map(raw ? [[CONSENT_KEY, raw]] : []);
 const listeners = new Map(); const scripts = []; const cookieWrites = [];
 const win = {
  Event, dataLayer: [],
  localStorage: { getItem: k => { if (storageFails) throw Error('blocked'); return store.get(k) || null; }, setItem: (k, v) => { if (storageFails) throw Error('blocked'); store.set(k, v); }, removeItem: k => store.delete(k) },
  location: { hostname: 'vizitor.hu', pathname: '/kapcsolat/', reload: () => { win.reloads++; } },
  document: { visibilityState: 'visible', head: { appendChild: s => scripts.push(s) }, createElement: () => ({ dataset: {} }), addEventListener() {}, removeEventListener() {} },
  reloads: 0, setInterval: () => 1, clearInterval() {},
  addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name), dispatchEvent: event => { listeners.get(event.type)?.(event); return true; },
 };
 Object.defineProperty(win.document, 'cookie', { get: () => '_ga=old; _ga_6XTDE9Y48B=old; session=keep', set: v => cookieWrites.push(v) });
 return { win, scripts, store, cookieWrites, listeners };
}
for (const raw of [null, '{', '{}', record(true, Date.now() - CONSENT_MAX_AGE), record(true, Date.now() + 10000), record(true, Date.now(), 'old-version'), JSON.stringify({ analytics: 'true', savedAt: Date.now(), revision })]) assert.equal(parseConsent(raw, revision), null);
assert.equal(parseConsent(record(false), revision).analytics, false);
assert.equal(parseConsent(record(true), revision).analytics, true);
const fresh = fake(); const manager = createConsentManager(fresh.win, config);
assert.equal(fresh.scripts.length, 0); assert.equal(manager.getChoice(), null);
assert.deepEqual([...fresh.win.dataLayer[0]].slice(0, 2), ['consent', 'default']);
assert.deepEqual(fresh.win.dataLayer[0][2], consentSignals(false));
manager.save(false); assert.equal(fresh.scripts.length, 0); assert.equal(JSON.parse(fresh.store.get(CONSENT_KEY)).analytics, false);
manager.save(true); assert.equal(fresh.scripts.length, 1); assert.equal(fresh.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-6XTDE9Y48B');
assert.equal(fresh.win.dataLayer.find(args => args[0] === 'config')[2].allow_google_signals, false);
manager.save(true); assert.equal(fresh.scripts.length, 1);
for (const command of fresh.win.dataLayer.filter(args => args[0] === 'consent')) {
 for (const name of ['ad_storage', 'ad_user_data', 'ad_personalization']) assert.equal(command[2][name], 'denied');
}
manager.save(false); assert.equal(fresh.win.reloads, 1); assert.equal(fresh.win['ga-disable-' + config.analyticsId], true);
assert.ok(fresh.cookieWrites.some(value => value.startsWith('_ga='))); assert.ok(!fresh.cookieWrites.some(value => value.startsWith('session=')));
const accepted = fake(record(true)); createConsentManager(accepted.win, config); assert.equal(accepted.scripts.length, 1);
const rejected = fake(record(false)); createConsentManager(rejected.win, config); assert.equal(rejected.scripts.length, 0);
const expired = fake(record(true, Date.now() - CONSENT_MAX_AGE)); assert.equal(createConsentManager(expired.win, config).getChoice(), null); assert.equal(expired.scripts.length, 0); assert.equal(expired.store.has(CONSENT_KEY), false);
const deniedStorage = fake(null, true); const memory = createConsentManager(deniedStorage.win, config); assert.equal(memory.save(true), false); assert.equal(memory.getChoice().analytics, true); memory.save(false); assert.equal(deniedStorage.win['ga-disable-' + config.analyticsId], true);
const crossTab = fake(record(true)); createConsentManager(crossTab.win, config); crossTab.store.set(CONSENT_KEY, record(false)); crossTab.listeners.get('storage')({ key: CONSENT_KEY }); assert.equal(crossTab.win.reloads, 1);
const unavailable = fake(); const noTags = createConsentManager(unavailable.win, {}); noTags.save(true); assert.equal(unavailable.scripts.length, 0); assert.equal(noTags.getChoice().analytics, false);
const html = await readFile('dist/index.html', 'utf8');
const { readdir } = await import('node:fs/promises');
async function checkPages(directory) {
 for (const entry of await readdir(directory, { withFileTypes: true })) {
  const name = directory + '/' + entry.name;
  if (entry.isDirectory()) await checkPages(name);
  else if (entry.name.endsWith('.html')) {
   const page = await readFile(name, 'utf8');
   assert.ok(page.indexOf("gtag('consent','default'") >= 0, name + ': missing default');
   assert.ok(page.indexOf("gtag('consent','default'") < page.indexOf('type="module"'), name + ': late default');
   assert.ok(page.includes('Sütibeállítások'), name + ': missing settings');
   assert.ok(!/<script[^>]+src=["'][^"']*(googletagmanager|google-analytics|cookieyes)/i.test(page), name + ': ungated tag');
  }
 }
}
await checkPages('dist');
assert.ok(html.indexOf("gtag('consent','default'") < html.indexOf('type="module"'));
assert.ok(!/<script[^>]+src=["'][^"']*(googletagmanager|google-analytics|cookieyes)/i.test(html));
assert.ok(html.includes('Sütibeállítások'));
assert.ok(!/GTM-KGN8CMBL|cdn-cookieyes/.test(html));
console.log('Consent checks passed: denied defaults, all v2 signals, no pre-consent tags, valid/expired/changed records, equal persistence, single loader, withdrawal + cookie cleanup, cross-tab withdrawal, blocked storage, absent IDs and HTML ordering.');
