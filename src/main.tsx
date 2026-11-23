import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { normalizePath, isServicePath } from './routes';
import './style.css';
import { initConsent } from './consent';
import { consentConfig } from './consent-config';
const consent = initConsent(consentConfig);
let analyticsEnabled = false, analyticsGeneration = 0;
let stopAnalytics: (() => void) | undefined;
function syncAnalytics() {
 const next = Boolean(consent.hasAnalytics && consent.getChoice()?.analytics);
 if (next === analyticsEnabled) return;
 analyticsEnabled = next;
 const generation = ++analyticsGeneration;
 if (!next) { stopAnalytics?.(); stopAnalytics = undefined; return; }
 void import('./analytics-observer').then(({ startAnalytics }) => {
  if (analyticsEnabled && generation === analyticsGeneration) stopAnalytics = startAnalytics();
 }).catch(() => { /* Analytics failure must never break navigation or the form. */ });
}
window.addEventListener('vizitor:consent-change', syncAnalytics);
syncAnalytics();
async function start() {
 const page=normalizePath(window.location.pathname);
 const Privacy=/^\/adatvedelem\/?$/.test(page) ? (await import('./components/Privacy')).Privacy : null;
 const ServicePage=isServicePath(page)?(await import('./components/ServicePage')).ServicePage:null;
 const root=document.getElementById('root')!;
 const app=<React.StrictMode><App page={page} privacyContent={Privacy?<Privacy/>:undefined} serviceContent={ServicePage?<ServicePage path={page}/>:undefined}/></React.StrictMode>;
 if(root.hasChildNodes())hydrateRoot(root,app);else createRoot(root).render(app);
}
void start();
