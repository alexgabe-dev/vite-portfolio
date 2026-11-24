import { useEffect, useRef, useState } from 'react';
import { getConsentManager } from '../consent';

function ConsentMark() {
 return <svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><rect x="4.5" y="4.5" width="27" height="27" rx="8" stroke="currentColor"/><path d="M11 13h14m-14 10h14" stroke="currentColor" strokeLinecap="round"/><circle cx="15" cy="13" r="3" fill="#19232c" stroke="currentColor"/><circle cx="22" cy="23" r="3" fill="#19232c" stroke="currentColor"/></svg>;
}
export function ConsentBanner() {
 const [visible, setVisible] = useState(false);
 const [settings, setSettings] = useState(false);
 const [analytics, setAnalytics] = useState(false);
 const [experience, setExperience] = useState(false);
 const [available, setAvailable] = useState(false);
 const [storageError, setStorageError] = useState(false);
 const dialog = useRef<HTMLDialogElement>(null);
 const opener = useRef<HTMLElement | null>(null);
 const settingsButton = useRef<HTMLButtonElement>(null);
 useEffect(() => {
  const manager = getConsentManager();
  const sync = () => { setVisible(!manager.getChoice()); setAnalytics(Boolean(manager.getChoice()?.analytics)); setAvailable(manager.hasAnalytics || manager.hasExperience); setExperience(Boolean(manager.getChoice()?.experience)); };
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
   <div className="consent-heading"><ConsentMark/><span className="consent-kicker">A te beállításaid</span></div>
   <h2 id="consent-title">Sütik. Te döntesz.</h2>
   <p id="consent-description">{available ? 'Google Analytics a látogatottsághoz, Microsoft Clarity hőtérképhez és munkamenet-visszajátszáshoz. Csak engedéllyel indulnak el; az oldal nélkülük is működik.' : 'Jelenleg nem használok analitikai vagy hirdetési követőket. A döntésedet ezen a böngészőn jegyezzük meg.'}</p>
   <a className="consent-policy" href="/adatvedelem/" target="_blank" rel="noopener noreferrer">Adatkezelési tájékoztató<span className="sr-only"> (új lapon)</span><span aria-hidden="true"> ↗</span></a>
   <div className="consent-actions">{available && <button type="button" onClick={() => save(false)}>Elutasítom</button>}<button type="button" onClick={() => save(available)}>{available ? 'Elfogadom' : 'Rendben'}</button></div>
   <button ref={settingsButton} className="consent-customize" type="button" onClick={() => { opener.current = settingsButton.current; setSettings(true); }}>Beállítások testreszabása<span aria-hidden="true"> +</span></button>
  </section>}
  <dialog ref={dialog} className="consent-dialog" aria-labelledby="consent-settings-title" aria-describedby="consent-settings-description" onCancel={event => { event.preventDefault(); close(); }}>
   <div className="consent-dialog-top"><span className="consent-kicker">Vizitor · Adatvédelem</span><button type="button" className="consent-close" aria-label="Beállítások bezárása mentés nélkül" onClick={close} autoFocus><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5"/></svg></button></div>
   <div className="consent-dialog-content"><h2 id="consent-settings-title">A döntés a tiéd.</h2><p id="consent-settings-description">Csak azt engedélyezd, amit szeretnél. A választásod 180 napig érvényes, és a lábléc „Sütibeállítások” pontjában bármikor módosíthatod.</p>
    <div className="consent-category"><div className="consent-category-head"><h3>Alapvető működés</h3><span className="consent-required">Mindig aktív</span></div><p>A sütibeállításaid megjegyzése és az ajánlatkérésnél kiválasztott szolgáltatás továbbvitele. Ezek nem követnek más oldalakon.</p><details><summary>Mi kerül a böngésződbe?</summary><p><code>vizitor.consent.v1</code>: helyi tárhely, 180 nap. A döntésed, időpontja és a tájékoztató verziója; nincs benne név vagy e-mail.</p><p><code>vizitor.inquiry-selection</code> és <code>vizitor.package-category</code>: munkamenet-tárhely. Az ajánlatkérő vagy az ároldalon egyszer felhasználom és törlöm; legkésőbb a munkamenet végén törlődnek. A szolgáltatásválasztás 15 perc után lejár.</p></details></div>
    <div className="consent-category"><div className="consent-category-head"><label htmlFor="consent-analytics">Látogatottságmérés</label><input id="consent-analytics" type="checkbox" role="switch" checked={analytics} disabled={!available} onChange={event => setAnalytics(event.target.checked)} aria-describedby="consent-analytics-description"/></div><p id="consent-analytics-description">{available ? 'Google Analytics 4: oldalak, kampányforrások, csomagválasztás, űrlaplépések és sikeres ajánlatkérések. Görgetési mélység, aktív idő és sebességadatok, az űrlap tartalma nélkül.' : 'Jelenleg nem használom.'}</p>{available && <details><summary>Szolgáltató és megőrzés</summary><p>Google Ireland Limited. Sütik: <code>_ga</code> és <code>_ga_*</code>, legfeljebb 180 nap. Az adatok között böngésző- és eszközadatok, megtekintett oldalak és interakciók szerepelhetnek. A Google az Európai Gazdasági Térségen kívül is kezelhet adatokat.</p><a href="https://policies.google.com/privacy?hl=hu" target="_blank" rel="noopener noreferrer">A Google adatvédelmi tájékoztatója (új lapon) ↗</a></details>}</div>
    <div className="consent-category"><div className="consent-category-head"><label htmlFor="consent-experience">Hőtérkép és visszajátszás</label><input id="consent-experience" type="checkbox" role="switch" checked={experience} onChange={event => setExperience(event.target.checked)} aria-describedby="consent-experience-description"/></div><p id="consent-experience-description">Microsoft Clarity: kattintások, görgetés és az oldal használatának visszajátszása. Az űrlap és a visszaigazolás személyes tartalmát kitakarom. Hirdetési adattovábbítás nélkül.</p><details><summary>Szolgáltató és megőrzés</summary><p>Microsoft Corporation. Saját sütik: <code>_clck</code> (látogatóazonosító, legfeljebb 1 év), <code>_clsk</code> (munkamenet, legfeljebb 1 nap). A felvételek jellemzően 30 napig, a kiválasztott felvételek és hőtérképek legfeljebb 9 hónapig érhetők el. Az adatok az EGT-n kívül is feldolgozhatók.</p><a href="https://privacy.microsoft.com/hu-hu/privacystatement" target="_blank" rel="noopener noreferrer">A Microsoft adatvédelmi nyilatkozata (új lapon) ↗</a></details></div>
    <div className="consent-category"><div className="consent-category-head"><h3>Hirdetési követés</h3><span className="consent-inactive">Nem használom</span></div><p>Nincs Google Ads- vagy Meta Pixel-követő. Hirdetési adattovábbítást és személyre szabást sem engedélyezek.</p></div>
    <a className="consent-policy" href="/adatvedelem/" target="_blank" rel="noopener noreferrer">Teljes adatkezelési tájékoztató (új lapon) ↗</a>
   </div><div className="consent-dialog-bottom"><div className="consent-actions"><button type="button" onClick={() => save(false)}>Elutasítom</button><button type="button" onClick={() => save(available)}>Elfogadom</button></div><button className="consent-save" type="button" onClick={() => save(analytics, experience)}>Kiválasztott beállítások mentése<span aria-hidden="true"> ↗</span></button></div>
  </dialog>
  <p className={storageError ? 'consent-storage-message' : 'sr-only'} role="status">{storageError ? 'A böngésződ nem engedi a beállítás mentését. A döntésed ezen az oldalon érvényes; új megnyitáskor ismét megkérdezlek.' : ''}</p>
 </>;
}
