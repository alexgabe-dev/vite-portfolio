// Adapted from Aceternity UI 3D Card Effect by Manu Arora (MIT).
// https://ui.aceternity.com/registry/3d-card.json
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react';
const MouseEnterContext = createContext(false);
export function CardContainer({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const enabled = () => window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches;
  function move(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current || !enabled()) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 55;
    const y = -(e.clientY - top - height / 2) / 65;
    ref.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    ref.current.style.setProperty('--pointer-x', `${e.clientX - left}px`);
    ref.current.style.setProperty('--pointer-y', `${e.clientY - top}px`);
  }
  function reset() { setEntered(false); if (ref.current) ref.current.style.transform = 'rotateY(0deg) rotateX(0deg)'; }
  return <MouseEnterContext.Provider value={entered}><div className="card-container"><div className="tilt-card" ref={ref} onMouseEnter={() => enabled() && setEntered(true)} onMouseMove={move} onMouseLeave={reset}>{children}</div></div></MouseEnterContext.Provider>;
}
export function CardItem({ children, translateZ = 0, className = '' }: { children: ReactNode; translateZ?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const entered = useContext(MouseEnterContext);
  useEffect(() => { if (ref.current) ref.current.style.transform = entered ? `translateZ(${translateZ}px)` : 'translateZ(0px)'; }, [entered, translateZ]);
  return <div className={'card-item ' + className} ref={ref}>{children}</div>;
}
