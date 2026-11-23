import { getConsentManager, parseConsent, consentRevision } from './consent';
import { consentConfig } from './consent-config';
import { cleanEvent, safePageContext, type AnalyticsEvent, type EventParams } from './analytics-schema';

export function analyticsAllowed() {
 if (typeof window === 'undefined') return false;
 const manager = getConsentManager();
 const choice = manager?.getChoice();
 return Boolean(manager?.hasAnalytics && choice?.analytics && parseConsent(JSON.stringify(choice), consentRevision(consentConfig)));
}
export function track(name: AnalyticsEvent, params: EventParams = {}) {
 const manager = typeof window !== 'undefined' ? getConsentManager() : undefined;
 const recording = Boolean(manager?.getChoice()?.experience && parseConsent(JSON.stringify(manager.getChoice()), consentRevision(consentConfig)));
 const analytics = analyticsAllowed();
 if (!analytics && !recording) return false;
 const clean = cleanEvent(name, params);
 if (!clean) return false;
 const context = safePageContext(location.href, document.referrer, document.title);
 const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
 if (!gtag) return false;
 if (recording && ['generate_lead', 'inquiry_submit', 'package_select', 'contact_click'].includes(name)) {
  (window as unknown as { clarity?: (...args: unknown[]) => void }).clarity?.('event', name);
 }
 if (!analytics) return recording;
 gtag('event', name, { ...clean, ...context, send_to: consentConfig.analyticsId });
 // Only sanitized metadata is exposed to the local funnel observer.
 (window as unknown as { dataLayer: unknown[] }).dataLayer.push({ event: 'vizitor_analytics', vizitor_event: name, vizitor_params: { ...clean, ...context } });
 window.dispatchEvent(new CustomEvent('vizitor:analytics-event', { detail: { name, params: clean } }));
 return true;
}
