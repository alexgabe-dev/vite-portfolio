import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';
import { track, analyticsAllowed } from './analytics';
import { serviceIds } from './analytics-schema';
import { canonicalRoutes, normalizePath } from './routes';

let vitalsRegistered = false;
export function startAnalytics() {
 let stopped = false;
 const cleanup: (() => void)[] = [];
 const seen = new Set<string>();
 const completed = new Set<string>();
 let started = false, attempted = false, lead = false, summarized = false;
 let activeSeconds = 0, tickAt = performance.now(), lastInteraction = performance.now();
 let maxPercent = 0, scrollFrame = 0;
 const listen = (target: EventTarget, name: string, handler: EventListener, options?: AddEventListenerOptions | boolean) => {
  target.addEventListener(name, handler, options); cleanup.push(() => target.removeEventListener(name, handler, options));
 };
 const once = (key: string, run: () => boolean) => { if (!seen.has(key) && run()) seen.add(key); };
 const area = (element: Element) => element.closest('header') ? 'header' : element.closest('footer') ? 'footer' :
  element.closest('.hero-story') ? 'hero' : element.closest('#szolgaltatasok') ? 'services' :
  element.closest('#csomagok') ? 'pricing' : element.closest('#kerdesek') ? 'faq' :
  element.closest('#kapcsolat') ? 'contact' : element.closest('.archive-main') ? 'projects' : 'other';
 listen(document, 'click', ((event: MouseEvent) => {
  if (!event.isTrusted || event.button !== 0) return;
  const target = event.target instanceof Element ? event.target : null;
  const anchor = target?.closest<HTMLAnchorElement>('a[href]');
  if (!anchor || anchor.closest('.consent-banner,.consent-dialog')) return;
  const location = area(anchor);
  const url = new URL(anchor.href);
  if (url.protocol === 'mailto:' || url.protocol === 'tel:') {
   track('contact_click', { method: url.protocol === 'mailto:' ? 'email' : 'phone', location }); return;
  }
  if (!/^https?:$/.test(url.protocol)) return;
  if (url.origin !== window.location.origin) { track('external_link', { link_domain: url.hostname, location }); return; }
  const path = normalizePath(url.pathname);
  if (path === '/kapcsolat/') track('inquiry_open', { location });
  else if (serviceIds[path]) track('service_select', { service_id: serviceIds[path], location });
  else if (canonicalRoutes.includes(path) && !url.hash) track('navigation_click', { destination_path: path, location });
 }) as EventListener);
 listen(document, 'input', ((event: Event) => {
  if (!event.isTrusted) return;
  const field = event.target;
  if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) || !field.closest('#inquiry-form') || field.name === '_gotcha') return;
  if (!started || lead) { started = true; lead = false; attempted = false; completed.clear(); track('inquiry_start', { form_id: 'inquiry' }); }
 }) as EventListener);
 listen(document, 'focusout', ((event: FocusEvent) => {
  const field = event.target;
  if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) || !field.closest('#inquiry-form')) return;
  if (!['name', 'email', 'message'].includes(field.name) || !field.value.trim() || !field.validity.valid) return;
  if (!completed.has(field.name) && track('inquiry_field_complete', { form_id: 'inquiry', field_id: field.name })) completed.add(field.name);
 }) as EventListener);
 listen(window, 'vizitor:analytics-event', ((event: CustomEvent) => {
  if (event.detail.name === 'inquiry_submit') { attempted = true; lead = false; }
  if (event.detail.name === 'generate_lead') lead = true;
  if (event.detail.name === 'inquiry_start') { started = true; lead = false; }
 }) as EventListener);
 const scroll = () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
   scrollFrame = 0;
   const distance = document.documentElement.scrollHeight - innerHeight;
   if (distance <= 0) return;
   const percent = Math.min(100, Math.max(0, scrollY / distance * 100));
   for (const value of [25, 50, 75, 90, 100]) if (percent >= value - (value === 100 ? .5 : 0)) {
    if (trackDepth(value)) maxPercent = Math.max(maxPercent, value);
   }
  });
 };
 const trackDepth = (value: number) => {
  if (seen.has('depth:' + value)) return true;
  if (!track('scroll_depth', { percent: value })) return false;
  seen.add('depth:' + value); return true;
 };
 listen(window, 'scroll', (() => { lastInteraction = performance.now(); scroll(); }) as EventListener, { passive: true });
 listen(document, 'pointerdown', (() => { lastInteraction = performance.now(); }) as EventListener, { passive: true });
 listen(document, 'keydown', (() => { lastInteraction = performance.now(); }) as EventListener, { passive: true });
 const tick = () => {
  const now = performance.now();
  if (!document.hidden && now - lastInteraction <= 30000) activeSeconds += Math.min(5, (now - tickAt) / 1000);
  tickAt = now;
  for (const seconds of [15, 30, 60, 120]) if (activeSeconds >= seconds) once('time:' + seconds, () => track('engagement_milestone', { seconds }));
 };
 const timer = window.setInterval(tick, 5000);
 cleanup.push(() => clearInterval(timer));
 listen(document, 'visibilitychange', (() => { tickAt = performance.now(); }) as EventListener);
 listen(window, 'pagehide', (() => {
  if (summarized || stopped) return;
  summarized = true; tick();
  track('visit_summary', { seconds: Math.min(7200, Math.floor(activeSeconds)), percent: maxPercent });
  if (started && !lead) track('inquiry_exit', { form_id: 'inquiry', stage: attempted ? 'attempted' : 'started', completed_fields: completed.size });
 }) as EventListener);
 listen(window, 'pageshow', (() => { summarized = false; tickAt = performance.now(); lastInteraction = tickAt; }) as EventListener);
 const errorKinds = new Set<string>();
 listen(window, 'error', ((event: ErrorEvent) => {
  const resource = event.target;
  const resourceType = resource instanceof HTMLScriptElement ? 'script' : resource instanceof HTMLLinkElement ? 'style' : resource instanceof HTMLImageElement ? 'image' : 'other';
  const errorType = event.target === window ? 'runtime' : 'resource';
  const key = errorType + resourceType;
  if (!errorKinds.has(key) && track('site_error', { error_type: errorType, resource_type: resourceType })) errorKinds.add(key);
 }) as EventListener, true);
 listen(window, 'unhandledrejection', (() => once('rejection', () => track('site_error', { error_type: 'unhandled_rejection', resource_type: 'other' }))) as EventListener);
 const viewTimers = new Map<Element, number>();
 const sectionNames: Record<string, string> = { 'hero-title': 'hero', 'services-title': 'services', 'process-title': 'process', 'pricing-title': 'pricing', 'faq-title': 'faq', 'contact-title': 'contact' };
 const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
   const element = entry.target as HTMLElement;
   if (!entry.isIntersecting || entry.intersectionRatio < .25) { clearTimeout(viewTimers.get(element)); viewTimers.delete(element); continue; }
   if (viewTimers.has(element)) continue;
   viewTimers.set(element, window.setTimeout(() => {
    viewTimers.delete(element);
    if (document.hidden || stopped || !analyticsAllowed()) return;
    if (element.dataset.trackPackage) track('package_view', { package_id: element.dataset.trackPackage, package_category: element.dataset.packageCategory! });
    else if (sectionNames[element.id]) track('section_view', { section_id: sectionNames[element.id] });
    observer.unobserve(element);
   }, 600));
  }
 }, { threshold: [.25] });
 for (const element of document.querySelectorAll('[data-track-package],#hero-title,#services-title,#process-title,#pricing-title,#faq-title,#contact-title')) observer.observe(element);
 cleanup.push(() => { observer.disconnect(); viewTimers.forEach(clearTimeout); });
 if (!canonicalRoutes.includes(normalizePath(location.pathname))) track('page_not_found');
 if (!vitalsRegistered) {
  vitalsRegistered = true;
  const report = (metric: Metric) => {
   // No element selectors, DOM text, URLs, stacks or form values in performance data.
   track('web_vital', { metric_name: metric.name, metric_value: metric.value, metric_delta: metric.delta, metric_rating: metric.rating, metric_id: metric.id });
  };
  onCLS(report); onINP(report); onLCP(report); onFCP(report); onTTFB(report);
 }
 return () => { stopped = true; cancelAnimationFrame(scrollFrame); cleanup.forEach(stop => stop()); };
}
