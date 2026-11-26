import { useEffect, useRef, useState } from 'react';
import { getConsentManager } from '../consent';
import { consentConfig } from '../consent-config';

// Prerendered for first paint; the inline head script and CSS decide whether it is shown,
// so first-time visitors see it immediately instead of after the JavaScript bundle runs.
const configured = Boolean(consentConfig.analyticsId || consentConfig.clarityId);
function markPending(pending: boolean) { document.documentElement.classList.toggle('consent-pending', pending); }

type GlyphName='cookie'|'sliders'|'shield'|'chart'|'cursor'|'megaphone';
const glyphs:Record<GlyphName,JSX.Element>={
 cookie:<><path d="M20.5 12.5A8.5 8.5 0 1 1 11.5 3.5a3 3 0 0 0 4 3.5 3 3 0 0 0 5 5.5Z"/><circle cx="8.5" cy="10" r="1.15" fill="currentColor" stroke="none"/><circle cx="12" cy="15.5" r="1.15" fill="currentColor" stroke="none"/><circle cx="16" cy="13" r="1.15" fill="currentColor" stroke="none"/></>,
 sliders:<><path d="M4 7h9m4 0h3M4 17h3m4 0h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></>,
 shield:<><path d="M12 3 5 6v5.5c0 4.2 3 7.8 7 9.5 4-1.7 7-5.3 7-9.5V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></>,
 chart:<path d="M4 20h16M7 16v-4m5 4V8m5 8v-6"/>,
 cursor:<><path d="m6 4 12 6.5-5.2 1.3L10.5 17 6 4Z"/><path d="M13 12l4.5 4.5"/></>,
 megaphone:<><path d="M4 10v4h3l7 4V6l-7 4H4Z"/><path d="M17.5 9.5a3.5 3.5 0 0 1 0 5"/><path d="m4 4 16 16"/></>,
};
function Glyph({name}:{name:GlyphName}){return <svg className="consent-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{glyphs[name]}</svg>;}
export function ConsentBanner() {
 const [visible, setVisible] = useState(true);
 const [settings, setSettings] = useState(false);
 const [analytics, setAnalytics] = useState(false);
 const [experience, setExperience] = useState(false);
 const [available, setAvailable] = useState(configured);
 const [storageError, setStorageError] = useState(false);
 const dialog = useRef<HTMLDialogElement>(null);
 const opener = useRef<HTMLElement | null>(null);
 const settingsButton = useRef<HTMLButtonElement>(null);
 useEffect(() => {
  const manager = getConsentManager();
  const sync = () => { const pending = !manager.getChoice(); markPending(pending); setVisible(pending); setAnalytics(Boolean(manager.getChoice()?.analytics)); setAvailable(manager.hasAnalytics || manager.hasExperience); setExperience(Boolean(manager.getChoice()?.experience)); };
  const open = () => { opener.current = document.activeElement as HTMLElement; sync(); setSettings(true); };
  sync();
  window.addEventListener('vizitor:consent-change', sync);
  window.addEventListener('vizitor:consent-open', open);
  return () => { window.removeEventListener('vizitor:consent-change', sync); window.removeEventListener('vizitor:consent-open', open); };
 }, []);
 useEffect(() => {
  if (!settings) return;
  const node = dialog.current!;
  const previous = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  node.showModal();
  return () => { node.close(); document.body.style.overflow = previous; };
 }, [settings]);
 function close() {
  setSettings(false);
  requestAnimationFrame(() => {
   if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
   else { const main = document.getElementById('main'); main?.setAttribute('tabindex', '-1'); main?.focus({ preventScroll: true }); }
  });
 }
 function save(value: boolean, recording = value) {
  const persisted = getConsentManager().save(value, recording);
  setStorageError(!persisted);
  if (settings) close();
  else if (document.activeElement?.closest('.consent-banner')) {
   // Keep keyboard focus useful when the banner itself disappears.
   const main = document.getElementById('main');
   if (main) { main.setAttribute('tabindex', '-1'); main.focus({ preventScroll: true }); }
  }
 }
 return <>
  {visible && <section className="consent-banner" aria-labelledby="consent-title" aria-describedby="consent-description">
   <span className="consent-banner-icon"><Glyph name="cookie"/></span>
   <div className="consent-banner-copy"><h2 id="consent-title">Sütik</h2><p id="consent-description">{available ? 'Engedélyeddel látogatottságmérést (Google Analytics) és hőtérképet (Microsoft Clarity) használok. Nélkülük is működik az oldal.' : 'Nem használok analitikai vagy hirdetési követést.'} <a className="consent-policy" href="/adatvedelem/" target="_blank" rel="noopener noreferrer">Részletek<span className="sr-only"> az adatkezelési tájékoztatóban (új lapon)</span></a></p></div>
   <div className="consent-banner-actions"><button ref={settingsButton} className="consent-icon-button" type="button" aria-label="Sütibeállítások" title="Beállítások" onClick={() => { opener.current = settingsButton.current; setSettings(true); }}><Glyph name="sliders"/></button>{available && <button type="button" className="consent-choice consent-reject" onClick={() => save(false)}>Elutasítom</button>}<button type="button" className="consent-choice consent-accept" onClick={() => save(available)}>{available ? 'Elfogadom' : 'Rendben'}</button></div>
  </section>}
  <dialog ref={dialog} className="consent-dialog" aria-labelledby="consent-settings-title" aria-describedby="consent-settings-description" onCancel={event => { event.preventDefault(); close(); }}>
   <div className="consent-dialog-top"><span className="consent-kicker"><Glyph name="sliders"/>Sütibeállítások</span><button type="button" className="consent-close" aria-label="Beállítások bezárása mentés nélkül" onClick={close} autoFocus><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5"/></svg></button></div>
   <div className="consent-dialog-content"><h2 id="consent-settings-title">Mit engedélyezel?</h2><p id="consent-settings-description">A döntésed 180 napig érvényes. A lábléc „Sütibeállítások” pontjában bármikor módosíthatod.</p>
    <div className="consent-category"><div className="consent-category-head"><h3><Glyph name="shield"/>Alapvető működés</h3><span className="consent-required">Mindig aktív</span></div><p>Megjegyzi a beállításaidat és az ajánlatkérésnél választott szolgáltatást. Nem követ más oldalakon.</p><details><summary>Mi kerül a böngésződbe?</summary><p><code>vizitor.consent.v1</code>: helyi tárhely, 180 nap. A döntésed, időpontja és a tájékoztató verziója; nincs benne név vagy e-mail.</p><p><code>vizitor.inquiry-selection</code> és <code>vizitor.package-category</code>: munkamenet-tárhely. Az ajánlatkérő vagy az ároldalon egyszer felhasználom és törlöm; legkésőbb a munkamenet végén törlődnek. A szolgáltatásválasztás 15 perc után lejár.</p></details></div>
    <div className="consent-category"><div className="consent-category-head"><label htmlFor="consent-analytics"><Glyph name="chart"/>Látogatottságmérés</label><input id="consent-analytics" type="checkbox" role="switch" checked={analytics} disabled={!available} onChange={event => setAnalytics(event.target.checked)} aria-describedby="consent-analytics-description"/></div><p id="consent-analytics-description">{available ? 'Google Analytics: mely oldalakat nézik, honnan érkeznek a látogatók és hány ajánlatkérés lesz belőle. Az űrlap tartalmát nem méri.' : 'Jelenleg nem használom.'}</p>{available && <details><summary>Szolgáltató és megőrzés</summary><p>Google Ireland Limited. Sütik: <code>_ga</code> és <code>_ga_*</code>, legfeljebb 180 nap. Az adatok között böngésző- és eszközadatok, megtekintett oldalak és interakciók szerepelhetnek. A Google az Európai Gazdasági Térségen kívül is kezelhet adatokat.</p><a href="https://policies.google.com/privacy?hl=hu" target="_blank" rel="noopener noreferrer">A Google adatvédelmi tájékoztatója (új lapon) ↗</a></details>}</div>
    <div className="consent-category"><div className="consent-category-head"><label htmlFor="consent-experience"><Glyph name="cursor"/>Hőtérkép és visszajátszás</label><input id="consent-experience" type="checkbox" role="switch" checked={experience} onChange={event => setExperience(event.target.checked)} aria-describedby="consent-experience-description"/></div><p id="consent-experience-description">Microsoft Clarity: kattintások, görgetés és a látogatás visszajátszása. A személyes adatokat kitakarom.</p><details><summary>Szolgáltató és megőrzés</summary><p>Microsoft Corporation. Saját sütik: <code>_clck</code> (látogatóazonosító, legfeljebb 1 év), <code>_clsk</code> (munkamenet, legfeljebb 1 nap). A felvételek jellemzően 30 napig, a kiválasztott felvételek és hőtérképek legfeljebb 9 hónapig érhetők el. Az adatok az EGT-n kívül is feldolgozhatók.</p><a href="https://privacy.microsoft.com/hu-hu/privacystatement" target="_blank" rel="noopener noreferrer">A Microsoft adatvédelmi nyilatkozata (új lapon) ↗</a></details></div>
    <div className="consent-category"><div className="consent-category-head"><h3><Glyph name="megaphone"/>Hirdetési követés</h3><span className="consent-inactive">Nem használom</span></div><p>Nem használok hirdetési követést, és nem adok át adatot hirdetőknek.</p></div>
    <a className="consent-policy" href="/adatvedelem/" target="_blank" rel="noopener noreferrer">Teljes adatkezelési tájékoztató (új lapon) ↗</a>
   </div><div className="consent-dialog-bottom"><div className="consent-actions"><button type="button" className="consent-reject" onClick={() => save(false)}>Elutasítom</button><button type="button" className="consent-accept" onClick={() => save(available)}>Elfogadom</button></div><button className="consent-save" type="button" onClick={() => save(analytics, experience)}>Kiválasztottak mentése</button></div>
  </dialog>
  <p className={storageError ? 'consent-storage-message' : 'sr-only'} role="status">{storageError ? 'A böngésződ nem engedi a beállítás mentését. A döntésed ezen az oldalon érvényes; új megnyitáskor ismét megkérdezlek.' : ''}</p>
 </>;
}
