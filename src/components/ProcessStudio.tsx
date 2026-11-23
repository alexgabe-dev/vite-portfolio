import { track as trackEvent } from '../analytics';
import { Icon } from './Icon';
import { useEffect, useRef, useState } from 'react';
const stages = [
  { label: 'Terv', title: 'Először a feladat.', text: 'Átbeszéljük, kiknek szól az oldal és mi legyen a feladata. A felépítést, a tartalmat, a díjat és a határidőt még fejlesztés előtt rögzítjük.', caption: 'Felépítés és irány', note: 'A vázlatnál még könnyű változtatni.' },
  { label: 'Felület', title: 'Aztán a megvalósítás.', text: 'Először a dizájnt nézzük át, utána kipróbálhatod a működő oldalt. A visszajelzéseid alapján haladunk, az előre egyeztetett módosítási körökben.', caption: 'Dizájn és fejlesztés', note: 'Már készülés közben kipróbálhatod.' },
  { label: 'Indulás', title: 'Végül élesben.', text: 'Mobilon és asztali gépen is teszteljük az oldalt, az űrlapokat és a megbeszélt funkciókat. Élesítéskor megkapod a hozzáféréseket és a kezelési útmutatót.', caption: 'Ellenőrzés és átadás', note: 'Átadáskor a használatát is ismered.' },
];
function Blueprint() {
  return <div className="studio-blueprint" aria-hidden="true"><div className="blueprint-sheet sheet-behind"/><div className="blueprint-sheet sheet-front"><div className="blueprint-ruler"><span>OLDALVÁZLAT</span><span>VIZITOR / PÉLDA</span></div><div className="wire-nav"><img src="/vizitor-logo.svg" alt="" width="92" height="29"/><div><i/><i/><i/></div></div><div className="wire-hero"><span className="selection-corner corner-tl"/><span className="selection-corner corner-tr"/><span className="selection-corner corner-bl"/><span className="selection-corner corner-br"/><div className="wire-copy"><span className="wire-eyebrow"/><strong>A fő üzeneted.<br/>Egyértelműen.</strong><i/><i/><div className="wire-buttons"><b/><span/></div></div><div className="wire-visual"><span className="wire-orbit"/><span className="wire-orbit orbit-secondary"/><div className="wire-object"/></div><span className="wire-dimension">NYITÓKÉPERNYŐ</span></div><div className="wire-flow"><div><span/>Bemutatkozás</div><i/><div><span/>Szolgáltatások</div><i/><div><span/>Kapcsolat</div></div><div className="wire-footer"><i/><i/><span/></div></div><div className="studio-pointer"><svg viewBox="0 0 22 27" fill="none"><path d="M2 2l16 13-8 1-4 8L2 2Z" fill="#ff5c35" stroke="#fff" strokeWidth="1.5"/></svg><span>Előbb a felépítés.</span></div></div>;
}
function Surface() {
  return <div className="studio-surface" aria-hidden="true"><div className="surface-backplate"/><div className="surface-window"><div className="surface-chrome"><div><i/><i/><i/></div><span>VIZITOR / VIZUÁLIS PÉLDA</span></div><img src="/process/desktop.webp" alt="" width="1200" height="680" loading="lazy" decoding="async"/></div><div className="surface-swatch"><span/><div><b>Saját karakter.</b><small>Az eredeti Vizitor-arculatból.</small></div><span className="swatch-mark" aria-hidden="true"><Icon name="spark"/></span></div></div>;
}
function Launch() {
  return <div className="studio-launch" aria-hidden="true"><div className="launch-desktop"><div className="launch-chrome"><span/><span/><span/></div><img src="/process/desktop.webp" alt="" width="1200" height="680" loading="lazy" decoding="async"/></div><div className="launch-phone"><div className="phone-speaker"/><img src="/process/mobile.webp" alt="" width="360" height="797" loading="lazy" decoding="async"/></div></div>;
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
      root.style.setProperty('--journey', String(value / 2));
      for (let i = 0; i < 3; i++) {
        const base = Math.floor(value);
        const blend = Math.max(0, Math.min(1, ((value - base) - .2) / .6));
        const visual = base + blend * blend * (3 - 2 * blend);
        const distance = Math.max(-1, Math.min(1, visual - i));
        const opacity = Math.max(0, 1 - Math.abs(distance));
        const eased = opacity * opacity * (3 - 2 * opacity);
        root.style.setProperty('--scene-' + i, String(eased));
        root.style.setProperty('--text-' + i, String(Math.max(0, (eased - .5) * 2)));
        root.style.setProperty('--shift-' + i, `${motion.matches ? 0 : -distance * 46}px`);
        root.style.setProperty('--scale-' + i, String(motion.matches ? 1 : 1 - Math.abs(distance) * .055));
      }
      setActive(Math.round(value));
    };
    const tick = (now: number) => {
      const delta = previous ? Math.min(now - previous, 64) : 16;
      previous = now;
      const next = progress.current + (target - progress.current) * (1 - Math.exp(-delta / (compact.matches ? 180 : 95)));
      paint(Math.abs(target - next) < .0003 ? target : next);
      if (Math.abs(target - progress.current) > .0003) frame = requestAnimationFrame(tick);
      else { frame = 0; previous = 0; }
    };
    const measure = () => {
      if (!enabled || !track.current) return;
      const root = track.current;
      const pin = root.firstElementChild as HTMLElement;
      const range = root.offsetHeight - pin.offsetHeight;
      const top = parseFloat(getComputedStyle(pin).top) || 0;
      const raw = range > 0 ? (top - root.getBoundingClientRect().top) / range : 0;
      target = Math.max(0, Math.min(2, compact.matches ? raw * 2 : raw * 2.6 - .3));
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
    window.addEventListener('resize', configure);
    motion.addEventListener('change', configure);
    return () => {
      disposed = true;
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', measure);
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
      const fraction = index === 0 ? 0 : index === 2 ? 1 : .5;
      window.scrollTo({ top: window.scrollY + root.getBoundingClientRect().top - top + fraction * (root.offsetHeight - pin.offsetHeight), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    } else {
      progress.current = index; setActive(index);
      const root = track.current;
      for (let i = 0; i < 3; i++) {
        root?.style.setProperty('--scene-' + i, i === index ? '1' : '0');
        root?.style.setProperty('--text-' + i, i === index ? '1' : '0');
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