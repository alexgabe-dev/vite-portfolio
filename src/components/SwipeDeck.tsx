import { track } from '../analytics';
import { Icon } from './Icon';
import { Children, useEffect, useRef, useState, type ReactNode } from 'react';

/** Native touch scrolling, with buttons and keyboard access to every card. */
export function SwipeDeck({ children, className, label, resetKey = '' }: { children: ReactNode; className: string; label: string; resetKey?: string }) {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const lastMeasured = useRef(0);
  const count = Children.count(children);
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    let settleTimer = 0;
    let positions: number[] = [];
    let moving = false;
    const setMoving = (value: boolean) => {
      if (moving === value) return;
      moving = value;
      element.toggleAttribute('data-rail-scrolling', value);
      element.querySelectorAll('.sculpture').forEach(host => host.dispatchEvent(new Event('sculpture-pause')));
    };
    const update = () => {
      if (!positions.length) return;
      let closest = 0, distance = Infinity;
      positions.forEach((position, index) => { const next = Math.abs(position - element.scrollLeft); if (next < distance) { closest = index; distance = next; } });
      if(closest!==lastMeasured.current){track('card_swipe',{deck_id:className==='capability-grid'?'services':'packages_'+resetKey,card_index:closest});lastMeasured.current=closest;}
      setActive(closest);
    };
    const settle = () => { clearTimeout(settleTimer); setMoving(false); update(); };
    const onScroll = () => {
      setMoving(true);
      clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, 180);
    };
    const onTouchStart = () => { clearTimeout(settleTimer); setMoving(true); };
    const onTouchEnd = () => { clearTimeout(settleTimer); settleTimer = window.setTimeout(settle, 180); };
    const measure = () => {
      const cards = Array.from(element.children) as HTMLElement[];
      const origin = cards[0]?.offsetLeft ?? 0;
      positions = cards.map(card => card.offsetLeft - origin);
      if (!moving) update();
    };
    element.addEventListener('scroll', onScroll, { passive: true });
    element.addEventListener('scrollend', settle);
    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchend', onTouchEnd, { passive: true });
    element.addEventListener('touchcancel', onTouchEnd, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    Array.from(element.children).forEach(card => observer.observe(card));
    measure();
    return () => {
      clearTimeout(settleTimer); setMoving(false); observer.disconnect();
      element.removeEventListener('scroll', onScroll); element.removeEventListener('scrollend', settle);
      element.removeEventListener('touchstart', onTouchStart); element.removeEventListener('touchend', onTouchEnd); element.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [count, className, resetKey]);
  useEffect(() => { if (rail.current) rail.current.scrollLeft = 0; setActive(0); lastMeasured.current=0; }, [resetKey]);
  function select(index: number) {
    const element = rail.current;
    if (!element) return;
    const cards = element.children as HTMLCollectionOf<HTMLElement>;
    const target = cards[Math.max(0, Math.min(count - 1, index))];
    if (!target) return;
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    element.scrollTo({ left: target.offsetLeft - cards[0].offsetLeft, behavior });
    const bounds = element.getBoundingClientRect();
    const top = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 94;
    if (bounds.top < top - 4 || bounds.top > window.innerHeight - 150) window.scrollTo({ top: window.scrollY + bounds.top - top, behavior });
  }
  return <div className="swipe-deck" role="region" aria-label={label}>
    <div className={className + ' swipe-rail'} ref={rail}>{children}</div>
    <div className="swipe-controls">
      <span className="swipe-count" aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, '0')}<span> / {String(count).padStart(2, '0')}</span></span>
      <div className="swipe-dots" role="group" aria-label="Kártya kiválasztása">{Array.from({ length: count }, (_, index) => <button key={index} type="button" aria-label={`${index + 1}. kártya`} aria-pressed={index === active} onClick={() => select(index)}><span/></button>)}</div>
      <div className="swipe-arrows"><button type="button" aria-label="Előző kártya" disabled={active === 0} onClick={() => select(active - 1)}><Icon name="arrow-left"/></button><button type="button" aria-label="Következő kártya" disabled={active === count - 1} onClick={() => select(active + 1)}><Icon name="arrow-right"/></button></div>
    </div>
  </div>;
}
