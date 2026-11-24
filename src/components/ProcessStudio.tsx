import { track as trackEvent } from '../analytics';
import { Icon } from './Icon';
import { useEffect, useRef, useState } from 'react';
const stages = [
  { label: 'Terv', title: 'Először a feladat.', text: 'Átbeszéljük, kiknek szól az oldal és mi legyen a feladata. A felépítést, a tartalmat, a díjat és a határidőt még fejlesztés előtt rögzítjük.', caption: 'Felépítés és irány', note: 'A vázlatnál még könnyű változtatni.' },
  { label: 'Felület', title: 'Aztán a megvalósítás.', text: 'Először a dizájnt nézzük át, utána kipróbálhatod a működő oldalt. A visszajelzéseid alapján haladunk, az előre egyeztetett módosítási körökben.', caption: 'Dizájn és fejlesztés', note: 'Már készülés közben kipróbálhatod.' },
  { label: 'Indulás', title: 'Végül élesben.', text: 'Mobilon és asztali gépen is tesztelem az oldalt, az űrlapokat és a megbeszélt funkciókat. Élesítéskor megkapod a hozzáféréseket és a kezelési útmutatót.', caption: 'Ellenőrzés és átadás', note: 'Átadáskor a használatát is ismered.' },
];
// Scroll position (0–1 across the pinned range) where each stage rests.
const LEAD = .1, SPAN = 2 + LEAD * 2;
const stageRaw = (index: number) => (index + LEAD) / SPAN;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smoother = (x: number) => { x = clamp01(x); return x * x * x * (x * (x * 6 - 15) + 10); };
const ramp = (from: number, to: number, x: number) => smoother((x - from) / (to - from));
function Blueprint() {
  return <div className="studio-blueprint" aria-hidden="true"><div className="blueprint-sheet sheet-behind"/><div className="blueprint-sheet sheet-front"><div className="blueprint-ruler"><span>OLDALVÁZLAT</span><span>VIZITOR / PÉLDA</span></div><div className="wire-nav"><img src="/vizitor-logo.svg" alt="" width="92" height="29"/><div><i/><i/><i/></div></div><div className="wire-hero"><span className="selection-corner corner-tl"/><span className="selection-corner corner-tr"/><span className="selection-corner corner-bl"/><span className="selection-corner corner-br"/><div className="wire-copy"><span className="wire-eyebrow"/><strong>A fő üzeneted.<br/>Egyértelműen.</strong><i/><i/><div className="wire-buttons"><b/><span/></div></div><div className="wire-visual"><span className="wire-orbit"/><span className="wire-orbit orbit-secondary"/><div className="wire-object"/></div><span className="wire-dimension">NYITÓKÉPERNYŐ</span></div><div className="wire-flow"><div><span/>Bemutatkozás</div><i/><div><span/>Szolgáltatások</div><i/><div><span/>Kapcsolat</div></div><div className="wire-footer"><i/><i/><span/></div></div><div className="studio-pointer"><svg viewBox="0 0 22 27" fill="none"><path d="M2 2l16 13-8 1-4 8L2 2Z" fill="#ff5c35" stroke="#fff" strokeWidth="1.5"/></svg><span>Előbb a felépítés.</span></div></div>;
}
function Surface() {
  return <div className="studio-surface" aria-hidden="true"><div className="surface-backplate"/><div className="surface-window"><div className="surface-chrome"><div><i/><i/><i/></div><span>VIZITOR / VIZUÁLIS PÉLDA</span></div><img src="/process/desktop.webp" srcSet="/process/desktop-700.webp 700w, /process/desktop.webp 1200w" sizes="(max-width: 600px) 310px, (max-width: 1100px) 540px, 690px" alt="" width="1200" height="680" loading="lazy" decoding="async"/></div><div className="surface-swatch"><span/><div><b>Saját karakter.</b><small>Az eredeti Vizitor-arculatból.</small></div><span className="swatch-mark" aria-hidden="true"><Icon name="spark"/></span></div></div>;
}
function Launch() {
  return <div className="studio-launch" aria-hidden="true"><div className="launch-desktop"><div className="launch-chrome"><span/><span/><span/></div><img src="/process/desktop.webp" srcSet="/process/desktop-700.webp 700w, /process/desktop.webp 1200w" sizes="(max-width: 600px) 310px, (max-width: 1100px) 540px, 690px" alt="" width="1200" height="680" loading="lazy" decoding="async"/></div><div className="launch-phone"><div className="phone-speaker"/><img src="/process/mobile.webp" srcSet="/process/mobile-180.webp 180w, /process/mobile.webp 360w" sizes="125px" alt="" width="360" height="797" loading="lazy" decoding="async"/></div></div>;
}
export function ProcessStudio({standalone=false}:{standalone?:boolean}) {
  const Heading=standalone?'h1':'h2';
  const Subheading=standalone?'h2':'h3';
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [horizontal, setHorizontal] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const progress = useRef(0);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compact = window.matchMedia('(max-width: 800px)');
    const space = window.matchMedia('(min-height: 600px)');
    let frame = 0, previous = 0, target = 0, enabled = false;
    const paint = (value: number) => {
      value = motion.matches ? Math.round(value) : value;
      progress.current = value;
      const root = track.current;
      if (!root) return;
      // Each stage rests for a while, then hands over along an eased curve.
      const base = Math.min(1, Math.floor(value));
      const local = value - base;
      const eased = ramp(.14, .86, local);
      const visual = base + eased;
      root.style.setProperty('--journey', String(visual / 2));
      const travel = compact.matches ? 18 : 26;
      for (let i = 0; i < 3; i++) {
        const d = visual - i;
        let scene = 0, copy = 0, shift = 0, scale = 1;
        if (d > -1 && d < 1) {
          if (d >= 0) { // leaving (lower layer): stays solid until covered, recedes
            scene = 1 - ramp(.42, .9, d); copy = 1 - ramp(0, .42, d);
            shift = -d * travel * .6; scale = 1 - d * .045;
          } else { // arriving (upper layer): becomes opaque early, rises into place
            const e = 1 + d;
            scene = ramp(.1, .62, e); copy = ramp(.58, 1, e);
            shift = (1 - e) * travel; scale = .965 + e * .035;
          }
        }
        if (motion.matches) { shift = 0; scale = 1; }
        root.style.setProperty('--scene-' + i, scene.toFixed(4));
        root.style.setProperty('--copy-' + i, copy.toFixed(4));
        root.style.setProperty('--text-' + i, copy.toFixed(4));
        root.style.setProperty('--shift-' + i, shift.toFixed(2) + 'px');
        root.style.setProperty('--scale-' + i, scale.toFixed(4));
      }
      setActive(Math.round(visual));
    };
    const tick = (now: number) => {
      const delta = previous ? Math.min(now - previous, 64) : 16;
      previous = now;
      const next = progress.current + (target - progress.current) * (1 - Math.exp(-delta / (compact.matches ? 85 : 110)));
      paint(Math.abs(target - next) < .0003 ? target : next);
      if (Math.abs(target - progress.current) > .0003) frame = requestAnimationFrame(tick);
      else { frame = 0; previous = 0; }
    };
    // When scrolling stops mid-handover, glide to the nearest stage instead of freezing half-blended.
    let settleTimer = 0, touching = false, settling = false, heading = 0, lastTarget = 0;
    const settle = () => {
      settleTimer = 0;
      if (!enabled || motion.matches || touching || !track.current) return;
      const local = target - Math.floor(target);
      if (target >= 2 || local < .14 || local > .86) { settling = false; return; }
      if (settling) return;
      const root = track.current;
      const pin = root.firstElementChild as HTMLElement;
      const range = root.offsetHeight - pin.offsetHeight;
      const top = parseFloat(getComputedStyle(pin).top) || 0;
      // Follow the visitor's direction once they are a third of the way through a handover.
      const index = Math.floor(target) + (heading > 0 ? (local > .34 ? 1 : 0) : heading < 0 ? (local > .66 ? 1 : 0) : Math.round(local));
      settling = true;
      window.scrollTo({ top: window.scrollY + root.getBoundingClientRect().top - top + stageRaw(index) * range, behavior: 'smooth' });
      window.setTimeout(() => { settling = false; }, 900);
    };
    const scheduleSettle = () => {
      if (settling) return;
      clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, 520);
    };
    const onScrollEnd = () => { if (!settling) { clearTimeout(settleTimer); settleTimer = window.setTimeout(settle, 320); } };
    const touchStart = () => { touching = true; clearTimeout(settleTimer); };
    const touchEnd = () => { touching = false; };
    const measure = () => {
      if (!enabled || !track.current) return;
      const root = track.current;
      const pin = root.firstElementChild as HTMLElement;
      const range = root.offsetHeight - pin.offsetHeight;
      const top = parseFloat(getComputedStyle(pin).top) || 0;
      const raw = range > 0 ? (top - root.getBoundingClientRect().top) / range : 0;
      target = Math.max(0, Math.min(2, raw * SPAN - LEAD));
      if (!settling && Math.abs(target - lastTarget) > .002) heading = Math.sign(target - lastTarget);
      lastTarget = target;
      scheduleSettle();
      if (motion.matches) paint(target);
      else if (!frame && Math.abs(target - progress.current) > .0003) frame = requestAnimationFrame(tick);
    };
    const configure = () => {
      enabled = space.matches;
      setPinned(enabled); setHorizontal(compact.matches);
      cancelAnimationFrame(frame); frame = 0; previous = 0;
      if (!enabled) paint(Math.round(progress.current));
      requestAnimationFrame(() => {
        const pin = track.current?.firstElementChild as HTMLElement | undefined;
        if (enabled && track.current?.classList.contains('is-pinned') && pin && pin.firstElementChild && pin.firstElementChild.getBoundingClientRect().height > pin.clientHeight + 1) { enabled = false; setPinned(false); }
        measure();
      });
    };
    const resizeObserver = new ResizeObserver(() => {
      const root = track.current;
      const pin = root?.firstElementChild as HTMLElement | undefined;
      const stage = root?.querySelector<HTMLElement>('.studio-stage');
      if (stage) root?.style.setProperty('--blueprint-fit', String(Math.min(1, stage.clientHeight / (window.innerWidth <= 600 ? 302 : 330))));
      if (enabled && root?.classList.contains('is-pinned') && pin?.firstElementChild && pin.firstElementChild.getBoundingClientRect().height > pin.clientHeight + 1) {
        enabled = false;
        setPinned(false);
        cancelAnimationFrame(frame); frame = 0;
        paint(Math.round(progress.current));
      }
    });
    const layout = track.current?.querySelector('.process-studio-layout');
    const stage = track.current?.querySelector('.studio-stage');
    if (layout) resizeObserver.observe(layout);
    if (stage) resizeObserver.observe(stage);
    let disposed = false;
    configure();
    void document.fonts.ready.then(()=>{if(!disposed)configure();});
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('scrollend', onScrollEnd);
    window.addEventListener('touchstart', touchStart, { passive: true });
    window.addEventListener('touchend', touchEnd, { passive: true });
    window.addEventListener('touchcancel', touchEnd, { passive: true });
    window.addEventListener('resize', configure);
    motion.addEventListener('change', configure);
    return () => {
      disposed = true;
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('scrollend', onScrollEnd);
      window.removeEventListener('touchstart', touchStart);
      window.removeEventListener('touchend', touchEnd);
      window.removeEventListener('touchcancel', touchEnd);
      clearTimeout(settleTimer);
      window.removeEventListener('resize', configure);
      motion.removeEventListener('change', configure);
    };
  }, []);
  const select = (index: number) => {
    trackEvent('process_step',{card_index:index});
    if (pinned && track.current) {
      const root = track.current;
      const pin = root.firstElementChild as HTMLElement;
      const top = parseFloat(getComputedStyle(pin).top) || 0;
      const fraction = stageRaw(index);
      window.scrollTo({ top: window.scrollY + root.getBoundingClientRect().top - top + fraction * (root.offsetHeight - pin.offsetHeight), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    } else {
      progress.current = index; setActive(index);
      const root = track.current;
      for (let i = 0; i < 3; i++) {
        root?.style.setProperty('--scene-' + i, i === index ? '1' : '0');
        root?.style.setProperty('--text-' + i, i === index ? '1' : '0');
        root?.style.setProperty('--copy-' + i, i === index ? '1' : '0');
        root?.style.setProperty('--shift-' + i, '0px');
        root?.style.setProperty('--scale-' + i, '1');
      }
      root?.style.setProperty('--journey', String(index / 2));
    }
  };
  return <div ref={track} className={'process-scroll-track' + (pinned ? ' is-pinned' : '')}>
    <div className="process-pin"><div className="process-studio-layout">
      <div className="process-studio-copy"><p className="eyebrow">Így lesz belőle kész oldal</p><Heading id="process-title">Egy asztalnál.<br/>Az elejétől.</Heading><p className="studio-intro">Közvetlenül azzal egyeztetsz, aki megtervezi és megépíti az oldaladat.</p>
        <div className="process-stage-tabs" role="tablist" aria-label="A közös munka lépései" aria-orientation={horizontal?'horizontal':'vertical'}>{stages.map((stage,i)=><button key={stage.label} id={'process-tab-'+i} ref={el=>{refs.current[i]=el;}} role="tab" aria-selected={active===i} aria-controls="process-stage-panel" tabIndex={active===i?0:-1} onClick={()=>select(i)} onKeyDown={e=>{if(['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?2:(i+(['ArrowDown','ArrowRight'].includes(e.key)?1:2))%3;select(next);refs.current[next]?.focus({preventScroll:true});}}}><span className="stage-tab-symbol" aria-hidden="true"><Icon name={(['diamond','grid','spark'] as const)[i]}/></span><span className="stage-tab-copy"><b>{stage.label}</b><span>{stage.title}</span></span><span className="stage-tab-indicator" aria-hidden="true">{String(i+1).padStart(2,'0')}</span></button>)}</div>
        <p className="studio-action-hint">{pinned?<><span className="studio-scroll-cue" aria-hidden="true"><Icon name="arrow-down"/></span> Görgess tovább. Lépésről lépésre.</>:'Válts a lépések között, és nézd meg a részleteket.'}</p>
      </div>
      <div className="process-stage-panel" id="process-stage-panel" role="tabpanel" aria-labelledby={'process-tab-'+active} tabIndex={0}>
        <div className="studio-board">
          <div className="studio-stage studio-continuous">{[<Blueprint/>,<Surface/>,<Launch/>].map((scene,i)=><div className={'studio-scene studio-scene-'+i} key={i} aria-hidden="true">{scene}</div>)}</div>
          <div className="studio-board-bottom"><div className="studio-caption-stack">{stages.map((stage,i)=><span className={'studio-caption studio-caption-'+i} key={i} aria-hidden={active!==i}>{stage.caption}</span>)}</div><span className="studio-counter" aria-hidden="true">0{active+1}<span> / 03</span></span></div>
          <div className="studio-journey-line" aria-hidden="true"><i/></div>
        </div>
        <div className="studio-description-stack">{stages.map((stage,i)=><div className={'studio-stage-description studio-description-'+i} key={i} aria-hidden={active!==i}><Subheading>{stage.note}</Subheading><p>{stage.text}</p></div>)}</div>
      </div>
    </div></div>
  </div>;
}