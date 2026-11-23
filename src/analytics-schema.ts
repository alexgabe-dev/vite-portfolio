import { canonicalRoutes, normalizePath } from './routes';

const oneOf = (...values: (string | number | boolean)[]) => (value: unknown): value is string | number | boolean => values.includes(value as string);
const integer = (max: number) => (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= max;
const number = (max: number) => (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= max;
export const eventSchemas = {
 section_view: ['section_id'], package_view: ['package_id', 'package_category'],
 service_select: ['service_id', 'location'], navigation_click: ['destination_path', 'location'],
 inquiry_open: ['location'], contact_click: ['method', 'location'], external_link: ['link_domain', 'location'],
 package_category: ['package_category'], billing_change: ['package_category', 'billing_period'],
 package_select: ['package_id', 'package_category', 'billing_period', 'listed_price'],
 faq_open: ['question_id', 'topic_id'], faq_topic: ['topic_id'], process_step: ['card_index'],
 card_swipe: ['deck_id', 'card_index'], project_filter: ['filter_id'],
 inquiry_start: ['form_id'], inquiry_field_complete: ['form_id', 'field_id'],
 inquiry_interest: ['service_id', 'selection'], inquiry_validation: ['form_id', 'error_type'],
 inquiry_submit: ['form_id', 'service_count', 'has_package'],
 inquiry_error: ['form_id', 'error_type', 'http_status'],
 generate_lead: ['form_id', 'service_count', 'has_package', 'lead_source'],
 inquiry_exit: ['form_id', 'stage', 'completed_fields'],
 scroll_depth: ['percent'], engagement_milestone: ['seconds'],
 visit_summary: ['seconds', 'percent'], page_not_found: [],
 web_vital: ['metric_name', 'metric_value', 'metric_delta', 'metric_rating', 'metric_id'],
 site_error: ['error_type', 'resource_type'],
} as const;
export type AnalyticsEvent = keyof typeof eventSchemas;
export type EventParams = Record<string, string | number | boolean>;
const rules: Record<string, (value: unknown) => boolean> = {
 section_id: oneOf('hero', 'services', 'process', 'pricing', 'faq', 'contact', 'projects'),
 package_id: value => typeof value === 'string' && /^(web|marketing|care)_[012]$/.test(value),
 package_category: oneOf('web', 'marketing', 'care'), billing_period: oneOf('once', 'monthly', 'annual'),
 listed_price: integer(100000000), destination_path: value => typeof value === 'string' && canonicalRoutes.includes(value),
 service_id: oneOf('website', 'development', 'ai', 'automation', 'marketing', 'seo', 'analytics', 'maintenance', 'email'),
 location: oneOf('header', 'footer', 'hero', 'services', 'pricing', 'faq', 'contact', 'projects', 'other'),
 method: oneOf('email', 'phone', 'copy_email'),
 link_domain: oneOf('facebook.com', 'www.facebook.com', 'linkedin.com', 'www.linkedin.com', 'github.com', 'www.palackverseny.hu', 'palackverseny.hu', 'magyar-ertekmentes.hu', 'kiwireels.vercel.app', 'policies.google.com', 'vercel.com', 'formspree.io'),
 question_id: oneOf('first', 'existing', 'content', 'timing', 'contact', 'preview', 'edit', 'handover', 'annual', 'adspend', 'extra', 'maintenance'),
 topic_id: oneOf('start', 'work', 'fees'), card_index: integer(2),
 deck_id: oneOf('services', 'packages_web', 'packages_marketing', 'packages_care'),
 filter_id: oneOf('all', 'web', 'app'), form_id: oneOf('inquiry'), field_id: oneOf('email', 'name', 'message'),
 selection: oneOf('selected', 'removed'), error_type: oneOf('email_required', 'email_invalid', 'message_required', 'rate_limited', 'server', 'network', 'timeout', 'runtime', 'resource', 'unhandled_rejection'),
 http_status: integer(599), service_count: integer(6), has_package: oneOf(true, false),
 lead_source: oneOf('website_inquiry'), stage: oneOf('started', 'attempted'), completed_fields: integer(3),
 percent: oneOf(0, 25, 50, 75, 90, 100), seconds: integer(7200),
 metric_name: oneOf('CLS', 'INP', 'LCP', 'FCP', 'TTFB'), metric_value: number(3600000), metric_delta: number(3600000),
 metric_rating: oneOf('good', 'needs-improvement', 'poor'),
 metric_id: value => typeof value === 'string' && /^v[0-9]+-[0-9]+-[0-9]+$/.test(value),
 resource_type: oneOf('script', 'style', 'image', 'other'),
};
export function cleanEvent(name: AnalyticsEvent, params: EventParams = {}): EventParams | null {
 if (!Object.hasOwn(eventSchemas, name)) return null;
 const result: EventParams = {};
 for (const key of eventSchemas[name]) if (rules[key]?.(params[key])) result[key] = params[key];
 return result;
}
export function safePageContext(href: string, referrer: string, title: string) {
 const url = new URL(href);
 const path = normalizePath(url.pathname);
 const pagePath = canonicalRoutes.includes(path) ? path : '/404/';
 const clean = new URL(pagePath, url.origin);
 // Campaign slugs only. Never pass arbitrary query parameters, fragments or link bodies.
 for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_content']) {
  const value = url.searchParams.get(key);
  if (value && /^[a-zA-Z][a-zA-Z0-9_.-]{0,79}$/.test(value)) clean.searchParams.set(key, value);
 }
 let referringOrigin = '';
 try { const source = new URL(referrer); if (/^https?:$/.test(source.protocol)) referringOrigin = source.origin + '/'; } catch { /* No referrer. */ }
 return { page_location: clean.href, page_referrer: referringOrigin, page_title: title.slice(0, 120), page_path: pagePath };
}
export const serviceIds: Record<string, string> = {
 '/weboldalkeszites/': 'website', '/egyedi-webfejlesztes/': 'development', '/online-marketing/': 'marketing',
 '/keresooptimalizalas/': 'seo', '/weboldal-karbantartas/': 'maintenance', '/ai-chatbot-keszites/': 'ai',
 '/automatizalas/': 'automation', '/email-szerver-uzemeltetes/': 'email', '/webanalitika-meres/': 'analytics',
 'Weboldal': 'website', 'Egyedi fejlesztés': 'development', 'AI és automatizálás': 'ai',
 'Marketing és mérés': 'marketing', 'Karbantartás': 'maintenance', 'E-mail-rendszer': 'email',
};

// Clarity records the browser URL itself: exclude unknown routes and arbitrary URL data.
export function canRecordPage(href: string, referrer = '') {
 try {
  const url = new URL(href);
  if (!canonicalRoutes.includes(normalizePath(url.pathname)) || url.hash) return false;
  const clean = new URL(safePageContext(href, '', '').page_location);
  for (const [key, value] of url.searchParams) {
   if (url.searchParams.getAll(key).length !== 1 || clean.searchParams.get(key) !== value) return false;
  }
  if (referrer) {
   const source = new URL(referrer);
   if (source.origin === url.origin) { if (!canRecordPage(referrer)) return false; }
   else if (source.pathname !== '/' || source.search || source.hash) return false;
  }
  return true;
 } catch { return false; }
}
