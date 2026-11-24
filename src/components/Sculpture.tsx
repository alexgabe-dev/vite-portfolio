import { useEffect, useRef, useState } from 'react';
import type { SculptureKind } from './sculpture-engine';

let sceneQueue = Promise.resolve();
// 3D is an enhancement over identical static artwork: start it only once the page has
// fully loaded and the visitor shows intent (or the browser has been idle for a while).
let readyToEnhance: Promise<void> | undefined;
// Software WebGL (no GPU, blocklisted driver, many VMs) compiles shaders on the CPU and
// freezes the page for seconds. Those visitors keep the identical static artwork.
let hardwareWebGL: boolean | undefined;
function hasHardwareWebGL() {
  if (hardwareWebGL !== undefined) return hardwareWebGL;
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) || canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true })) as WebGLRenderingContext | null;
    if (!gl) return hardwareWebGL = false;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    hardwareWebGL = !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  } catch { hardwareWebGL = false; }
  return hardwareWebGL;
}
function enhancementWindow() {
  return readyToEnhance ??= new Promise<void>(resolve => {
    const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise<void>(done => window.addEventListener('load', () => done(), { once: true }));
    void loaded.then(() => {
      const events = ['pointermove', 'pointerdown', 'wheel', 'scroll', 'keydown', 'touchstart'] as const;
      let fallback = 0;
      const start = () => { events.forEach(name => window.removeEventListener(name, start)); clearTimeout(fallback); resolve(); };
      events.forEach(name => window.addEventListener(name, start, { once: true, passive: true }));
      fallback = window.setTimeout(() => { if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 1500 }); else start(); }, 3500);
    });
  });
}
const idle = () => new Promise<void>(resolve => {
  if ('requestIdleCallback' in window) window.requestIdleCallback(() => resolve(), { timeout: 1400 });
  else setTimeout(resolve, 32);
});

export function Sculpture({ kind = 'signature', paused = false }: { kind?: SculptureKind; paused?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const pauseRef = useRef(paused);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => { pauseRef.current = paused; host.current?.dispatchEvent(new Event('sculpture-pause')); }, [paused]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let timer = 0, near = false, scheduled = false;
    let teardown: (() => void) | undefined;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(entries => {
      near = entries.some(e => e.isIntersecting && e.intersectionRatio >= (kind === 'signature' ? .05 : .22));
      if (!near || scheduled || motion.matches || element.closest('[data-rail-scrolling]')) return;
      scheduled = true;
      // Paint the page first; compile only visible scenes, one at a time.
      timer = window.setTimeout(() => {
        sceneQueue = sceneQueue.then(async () => {
          if (disposed) return;
          await enhancementWindow();
          if (disposed) return;
          if (!hasHardwareWebGL()) { observer.disconnect(); return; }
          await idle();
          if (disposed) return;
          if (!near || motion.matches || element.closest('[data-rail-scrolling]')) { scheduled = false; return; }
          try {
            const { createSculpture } = await import('./sculpture-engine');
            if (disposed) return;
            if (!near || motion.matches || element.closest('[data-rail-scrolling]')) { scheduled = false; return; }
            const cleanup = await createSculpture(element, kind, () => pauseRef.current || !!element.closest('[data-rail-scrolling]'));
            if (disposed) cleanup();
            else { teardown = cleanup; setReady(true); observer.disconnect(); }
          } catch { if (!disposed) { setFailed(true); observer.disconnect(); } }
        });
      }, kind === 'signature' ? 450 : 220);
    }, { rootMargin: '60px 0px', threshold: kind === 'signature' ? .05 : .22 });
    // The matching static artwork is enough when motion is explicitly disabled.
    const observe = () => { if (!motion.matches && !teardown) observer.observe(element); };
    const resumeAfterSwipe = () => {
      if (!teardown && !scheduled && !element.closest('[data-rail-scrolling]')) { observer.unobserve(element); observe(); }
    };
    element.addEventListener('sculpture-pause', resumeAfterSwipe);
    observe();
    motion.addEventListener('change', observe);
    return () => { disposed = true; clearTimeout(timer); element.removeEventListener('sculpture-pause', resumeAfterSwipe); observer.disconnect(); motion.removeEventListener('change', observe); teardown?.(); };
  }, [kind]);
  return <div className={'sculpture sculpture-' + kind + (ready ? ' ready' : '') + (failed ? ' unavailable' : '')} ref={host} aria-hidden="true" data-ready={ready}>
    <div className="sculpture-fallback" aria-hidden="true"><picture>{kind==='signature'&&<source media="(max-width: 600px)" srcSet="/vizitor-logo.svg"/>}<img src={kind==='signature'?'/graphics/signature-clean.webp':'/graphics/'+kind+(kind==='architecture'?'.svg':'.webp')} {...(kind==='signature'?{srcSet:'/graphics/signature-clean-660.webp 660w, /graphics/signature-clean.webp 1320w',sizes:'(max-width: 1100px) 500px, (max-width: 1599px) 660px, 730px'}:{})} alt="" width={kind==='signature'?660:400} height={kind==='signature'?600:235} loading={kind==='signature'?'eager':'lazy'} {...{fetchpriority:kind==='signature'?'high':'low'}} decoding="async"/></picture></div>
  </div>;
}
