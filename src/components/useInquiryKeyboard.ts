import { useEffect, type RefObject } from 'react';

/** Follow the visible viewport, including Safari's keyboard, without locking page scroll. */
export function useInquiryKeyboard(cardRef: RefObject<HTMLDivElement>) {
  useEffect(() => {
    const card = cardRef.current;
    const viewport = window.visualViewport;
    if (!card || !viewport) return;
    const mobile = window.matchMedia('(max-width: 1024px) and (pointer: coarse)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, settle = 0;
    let baselineHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    let baselineWidth = window.innerWidth;

    const editable = () => {
      const active = document.activeElement;
      return active instanceof HTMLElement && card.contains(active) && active.matches('.inquiry-field input, .inquiry-field textarea') ? active : null;
    };
    const update = () => {
      frame = 0;
      const active = editable();
      const layoutHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
      if (Math.abs(window.innerWidth - baselineWidth) > 80) {
        baselineWidth = window.innerWidth;
        baselineHeight = layoutHeight;
      }
      if (!active) baselineHeight = layoutHeight;
      if (!mobile.matches || !active || viewport.scale >= 1.05) {
        card.removeAttribute('data-keyboard-open');
        return;
      }
      const inset = Math.max(0, layoutHeight - viewport.height - viewport.offsetTop);
      const bounds = card.getBoundingClientRect();
      const open = mobile.matches && !!active && viewport.scale < 1.05 &&
        Math.max(inset, baselineHeight - viewport.height) > 120 &&
        bounds.bottom > viewport.offsetTop + 100 && bounds.top < viewport.offsetTop + viewport.height - 80;
      if (open) {
        const padding = parseFloat(getComputedStyle(card).paddingLeft);
        const left = Math.max(12, bounds.left + padding);
        card.style.setProperty('--inquiry-visible-height', `${Math.round(viewport.height)}px`);
        card.style.setProperty('--inquiry-keyboard-inset', `${Math.round(inset)}px`);
        card.style.setProperty('--inquiry-actions-left', `${left}px`);
        card.style.setProperty('--inquiry-actions-width', `${Math.max(0, Math.min(bounds.width - padding * 2, window.innerWidth - left - 12))}px`);
      }
      card.toggleAttribute('data-keyboard-open', open);
    };
    const schedule = () => {
      if (!frame && (card.hasAttribute('data-keyboard-open') || (mobile.matches && editable()))) frame = requestAnimationFrame(update);
    };
    const revealField = () => {
      settle = 0;
      update();
      const active = editable();
      if (!active || !card.hasAttribute('data-keyboard-open')) return;
      const bounds = active.getBoundingClientRect();
      const top = viewport.offsetTop + Math.min(84, viewport.height * .25);
      const bottom = viewport.offsetTop + viewport.height - 90;
      const delta = bounds.top < top ? bounds.top - top : bounds.bottom > bottom ? Math.min(bounds.bottom - bottom, bounds.top - top) : 0;
      if (Math.abs(delta) > 2) window.scrollBy({top: delta, behavior: reduced.matches ? 'instant' : 'smooth'});
    };
    const resizeOrFocus = () => {
      schedule();
      window.clearTimeout(settle);
      // Let the native keyboard animation finish before making a small scroll correction.
      settle = window.setTimeout(revealField, 180);
    };
    viewport.addEventListener('resize', resizeOrFocus);
    viewport.addEventListener('scroll', schedule);
    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', resizeOrFocus);
    card.addEventListener('focusin', resizeOrFocus);
    card.addEventListener('focusout', resizeOrFocus);
    mobile.addEventListener('change', resizeOrFocus);
    return () => {
      cancelAnimationFrame(frame); window.clearTimeout(settle);
      viewport.removeEventListener('resize', resizeOrFocus);
      viewport.removeEventListener('scroll', schedule);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resizeOrFocus);
      card.removeEventListener('focusin', resizeOrFocus);
      card.removeEventListener('focusout', resizeOrFocus);
      mobile.removeEventListener('change', resizeOrFocus);
      card.removeAttribute('data-keyboard-open');
    };
  }, [cardRef]);
}
