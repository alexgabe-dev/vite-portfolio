import { safePageContext, canRecordPage } from './analytics-schema';
export const CONSENT_KEY = 'vizitor.consent.v1';
export const CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;
export type ConsentChoice = { analytics: boolean; experience: boolean; savedAt: number; revision: string };
export type ConsentConfig = { analyticsId?: string; clarityId?: string };
type ConsentWindow = Window & typeof globalThis & {
 dataLayer?: unknown[];
 gtag?: (...args: unknown[]) => void;
 clarity?: ((...args: unknown[]) => void) & { q?: IArguments[] };
};
export function consentRevision(config: ConsentConfig) { return '2026-11-23.2:' + (config.analyticsId || 'none') + ':' + (config.clarityId || 'none'); }
export function parseConsent(raw: string | null, revision: string, now = Date.now()): ConsentChoice | null {
 try {
  const value = JSON.parse(raw || 'null');
  return value && value.revision === revision && typeof value.analytics === 'boolean' && typeof value.experience === 'boolean' &&
   Number.isFinite(value.savedAt) && value.savedAt <= now && now - value.savedAt < CONSENT_MAX_AGE
   ? { analytics: value.analytics, experience: value.experience, savedAt: value.savedAt, revision } : null;
 } catch { return null; }
}
export function consentSignals(analytics: boolean) {
 return { analytics_storage: analytics ? 'granted' : 'denied', ad_storage: 'denied',
  ad_user_data: 'denied', ad_personalization: 'denied', personalization_storage: 'denied',
  functionality_storage: 'denied', security_storage: 'granted' };
}
export function createConsentManager(win: ConsentWindow, config: ConsentConfig) {
 const analyticsId = /^G-[A-Z0-9]+$/.test(config.analyticsId || '') ? config.analyticsId! : '';
 const clarityId = /^[a-z0-9]{5,30}$/.test(config.clarityId || '') ? config.clarityId! : '';
 const revision = consentRevision({ analyticsId, clarityId });
 const read = () => {
  try {
   const raw = win.localStorage.getItem(CONSENT_KEY);
   const parsed = parseConsent(raw, revision);
   if (raw && !parsed) win.localStorage.removeItem(CONSENT_KEY);
   return parsed;
  } catch { return null; }
 };
 let choice = read();
 let loaded = false;
 let clarityLoaded = false;
 win.dataLayer = win.dataLayer || [];
 win.gtag = win.gtag || function () { win.dataLayer!.push(arguments); };
 // The inline head bootstrap runs first; keep tests and alternative entry points fail-closed too.
 if (!win.dataLayer.length) win.gtag('consent', 'default', consentSignals(false));
 const announce = () => win.dispatchEvent(new win.Event('vizitor:consent-change'));
 function clearCookies(pattern: RegExp) {
  const domains = ['', ...win.location.hostname.split('.').map((_, i, parts) => parts.slice(i).join('.'))];
  const paths = ['/', ...win.location.pathname.split('/').filter(Boolean).map((_, i, parts) => '/' + parts.slice(0, i + 1).join('/'))];
  for (const cookie of win.document.cookie.split(';')) {
   const name = cookie.trim().split('=')[0];
   if (!pattern.test(name)) continue;
   for (const domain of domains) for (const path of paths) {
    win.document.cookie = name + '=; Max-Age=0; path=' + path + (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
   }
  }
 }
 const clearAnalyticsCookies = () => clearCookies(/^(_ga($|_)|_gid$|_gat($|_)|_gac_)/);
 const clearClarityCookies = () => {
  clearCookies(/^_cl(ck|sk)$/);
  try { win.sessionStorage.removeItem('CLID'); win.sessionStorage.removeItem('_cltk'); } catch { /* Optional storage may be blocked. */ }
 };
 function applyClarity() {
  const allowed = Boolean(clarityId && choice?.experience && canRecordPage(win.location.href, win.document.referrer));
  if (!allowed) {
   if (clarityLoaded) win.clarity?.('stop');
   clearClarityCookies(); return;
  }
  win.clarity = win.clarity || function () { (win.clarity!.q = win.clarity!.q || []).push(arguments); };
  win.clarity('consentv2', { analytics_Storage: 'granted', ad_Storage: 'denied' });
  if (clarityLoaded) return;
  clarityLoaded = true;
  const script = win.document.createElement('script'); script.async = true;
  script.src = 'https://www.clarity.ms/tag/' + clarityId; script.dataset.vizitorClarity = '';
  win.document.head.appendChild(script);
 }
 function apply() {
  // Retired CookieYes / marketing identifiers must not revive an older advertising grant.
  clearCookies(/^(cookieyes-consent|_gcl_[a-z]+|_fbp|_fbc)$/);
  applyClarity();
  const allowed = Boolean(analyticsId && choice?.analytics);
  if (analyticsId) (win as unknown as Record<string, unknown>)['ga-disable-' + analyticsId] = !allowed;
  win.gtag!('consent', 'update', consentSignals(allowed));
  if (!allowed) { clearAnalyticsCookies(); return; }
  if (loaded) return;
  loaded = true;
  win.gtag!('js', new Date());
  // These privacy choices remain disabled even when Analytics is accepted.
  win.gtag!('set', 'ads_data_redaction', true);
  win.gtag!('set', 'url_passthrough', false);
  const context = safePageContext(win.location.href, win.document.referrer, win.document.title);
  win.gtag!('set', { page_location: context.page_location, page_referrer: context.page_referrer });
  win.gtag!('config', analyticsId, { ...context, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 15552000, cookie_update: false });
  const script = win.document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + analyticsId;
  script.dataset.vizitorAnalytics = '';
  win.document.head.appendChild(script);
 }
 function save(analytics: boolean, experience = false) {
  const revoke = (loaded && !analytics) || (clarityLoaded && !experience);
  choice = { analytics: Boolean(analyticsId && analytics), experience: Boolean(clarityId && experience), savedAt: Date.now(), revision };
  let persisted = true;
  try { win.localStorage.setItem(CONSENT_KEY, JSON.stringify(choice)); } catch {
   persisted = false;
   // If a quota error prevents saving a rejection, do not retain an earlier grant.
   try { win.localStorage.removeItem(CONSENT_KEY); } catch { /* In-memory denial still disables collection. */ }
  }
  apply(); announce();
  // A fresh document removes the running library as well as its timers/listeners.
  if (revoke && persisted) win.location.reload();
  return persisted;
 }
 const sync = (event: StorageEvent) => {
  if (event.key !== CONSENT_KEY && event.key !== null) return;
  choice = read();
  apply(); announce();
  if ((loaded && !choice?.analytics) || (clarityLoaded && !choice?.experience)) win.location.reload();
 };
 win.addEventListener('storage', sync);
 // Respect expiry in a long-open or restored tab too, not only at navigation.
 const refresh = () => {
  if (win.document.visibilityState === 'hidden') return;
  if (choice && !parseConsent(JSON.stringify(choice), revision)) {
   choice = read(); apply(); announce(); if ((loaded && !choice?.analytics) || (clarityLoaded && !choice?.experience)) win.location.reload();
  }
 };
 win.document.addEventListener('visibilitychange', refresh);
 win.addEventListener('pageshow', refresh);
 const expiryTimer = win.setInterval(refresh, 60000);
 apply();
 return {
  getChoice: () => choice,
  hasAnalytics: Boolean(analyticsId),
  hasExperience: Boolean(clarityId),
  save,
  openSettings: () => win.dispatchEvent(new win.Event('vizitor:consent-open')),
  destroy: () => { win.removeEventListener('storage', sync); win.removeEventListener('pageshow', refresh); win.document.removeEventListener('visibilitychange', refresh); win.clearInterval(expiryTimer); },
 };
}
let manager: ReturnType<typeof createConsentManager>;
export function initConsent(config: ConsentConfig) { manager ||= createConsentManager(window, config); return manager; }
export function getConsentManager() { return manager; }
export function openConsentSettings() { manager?.openSettings(); }
