// Interactivity for the shared Vizitor header, footer and consent UI on static blog pages.
// Plain DOM code (no framework). Consent and analytics reuse the site's own modules,
// so storage, Consent Mode signals and GA4/Clarity behave exactly like on the main site.
import { initConsent } from '../../../src/consent';
import { consentConfig } from '../../../src/consent-config';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends Element>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);

/* Header: scrolled state + navigation drawer */
const header = $<HTMLElement>('.navigation-header');
// On article pages the header steps aside while reading down and returns on any upward scroll.
const reading = !!document.getElementById('cikk');
let lastY = scrollY;
const onScroll = () => {
  const y = scrollY;
  header?.classList.toggle('is-scrolled', y > 36);
  if (reading && header && drawer?.dataset.state !== 'open' && !header.contains(document.activeElement)) {
    if (y > 480 && y > lastY + 6) header.classList.add('is-tucked');
    else if (y < lastY - 6 || y <= 480) header.classList.remove('is-tucked');
  }
  if (Math.abs(y - lastY) > 6) lastY = y;
};

const trigger = $<HTMLButtonElement>('.nav-menu-trigger');
const drawer = $<HTMLDialogElement>('#navigation-dialog');
let closing = 0;
addEventListener('scroll', onScroll, { passive: true }); onScroll();
function openMenu() {
  if (!drawer || !trigger) return;
  drawer.dataset.state = 'open'; drawer.showModal(); document.body.style.overflow = 'hidden';
  trigger.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true'); trigger.setAttribute('aria-label', 'Menü bezárása');
  $<HTMLAnchorElement>('.nav-drawer-links a', drawer)?.focus({ preventScroll: true });
}
function closeMenu(after?: () => void) {
  if (!drawer || !trigger || closing) return;
  drawer.dataset.state = 'closing';
  closing = window.setTimeout(() => {
    drawer.close(); drawer.dataset.state = 'closed'; document.body.style.overflow = ''; closing = 0;
    trigger.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); trigger.setAttribute('aria-label', 'Menü megnyitása');
    if (after) after(); else trigger.focus({ preventScroll: true });
  }, reduced() ? 0 : 220);
}
trigger?.addEventListener('click', () => (drawer?.open ? closeMenu() : openMenu()));
$('.nav-drawer-close')?.addEventListener('click', () => closeMenu());
drawer?.addEventListener('cancel', e => { e.preventDefault(); closeMenu(); });
drawer?.addEventListener('click', e => {
  if (e.target !== drawer) return;
  const b = drawer.getBoundingClientRect();
  if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) closeMenu();
});
drawer?.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(a => a.addEventListener('click', e => {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault(); closeMenu(() => location.assign(a.href));
}));
drawer?.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const items = [...drawer.querySelectorAll<HTMLElement>('a[href],button:not(:disabled)')].filter(i => i.getClientRects().length);
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
});

/* Footer */
const stage = $<HTMLElement>('.footer-wordmark-stage');
if (stage && !reduced()) {
  stage.classList.add('is-armed');
  const io = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { stage.classList.add('is-visible'); io.disconnect(); } }, { threshold: 0.18 });
  io.observe(stage);
}
$('.footer-return')?.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced() ? 'instant' : 'smooth' }));
const copy = $<HTMLButtonElement>('.footer-copy');
copy?.addEventListener('click', async () => {
  const status = $<HTMLElement>('.footer-copy-feedback');
  try { await navigator.clipboard.writeText('info@vizitor.hu'); if (status) status.textContent = 'E-mail-cím másolva.'; }
  catch { if (status) status.textContent = 'A másolás nem sikerült. A cím kijelölhető.'; }
});

/* Consent */
const manager = initConsent(consentConfig);
const root = document.documentElement;
const banner = $<HTMLElement>('.consent-banner');
const dialog = $<HTMLDialogElement>('.consent-dialog');
const analyticsBox = $<HTMLInputElement>('#consent-analytics');
const experienceBox = $<HTMLInputElement>('#consent-experience');
const status = dialog?.parentElement?.querySelector<HTMLElement>('p[role="status"]');
let opener: HTMLElement | null = null;
let observing = false;
function sync() {
  const choice = manager.getChoice();
  root.classList.toggle('consent-pending', !choice);
  if (analyticsBox) analyticsBox.checked = Boolean(choice?.analytics);
  if (experienceBox) experienceBox.checked = Boolean(choice?.experience);
  if (choice?.analytics && !observing) { observing = true; void import('../../../src/analytics-observer').then(m => m.startAnalytics()).catch(() => { observing = false; }); }
}
function save(analytics: boolean, experience = analytics) {
  const persisted = manager.save(analytics, experience);
  if (status) { status.textContent = persisted ? '' : 'A böngésződ nem engedi a beállítás mentését. A döntésed ezen az oldalon érvényes; új megnyitáskor ismét megkérdezlek.'; status.className = persisted ? 'sr-only' : 'consent-storage-message'; }
  if (dialog?.open) closeSettings();
  else if (document.activeElement?.closest('.consent-banner')) { const main = $<HTMLElement>('#main'); main?.setAttribute('tabindex', '-1'); main?.focus({ preventScroll: true }); }
}
function openSettings(from?: HTMLElement | null) {
  if (!dialog) return; opener = from || (document.activeElement as HTMLElement);
  sync(); document.body.style.overflow = 'hidden'; dialog.showModal();
}
function closeSettings() {
  if (!dialog) return; dialog.close(); document.body.style.overflow = '';
  if (opener?.isConnected) opener.focus({ preventScroll: true });
}
const [reject, accept] = banner ? [...banner.querySelectorAll<HTMLButtonElement>('.consent-actions button')] : [];
reject?.addEventListener('click', () => save(false));
accept?.addEventListener('click', () => save(true));
$<HTMLButtonElement>('.consent-customize')?.addEventListener('click', e => openSettings(e.currentTarget as HTMLElement));
if (dialog) {
  const [dReject, dAccept] = [...dialog.querySelectorAll<HTMLButtonElement>('.consent-dialog-bottom .consent-actions button')];
  dReject?.addEventListener('click', () => save(false));
  dAccept?.addEventListener('click', () => save(true));
  $('.consent-save', dialog)?.addEventListener('click', () => save(Boolean(analyticsBox?.checked), Boolean(experienceBox?.checked)));
  $('.consent-close', dialog)?.addEventListener('click', closeSettings);
  dialog.addEventListener('cancel', e => { e.preventDefault(); closeSettings(); });
}
$<HTMLButtonElement>('.footer-consent')?.addEventListener('click', e => openSettings(e.currentTarget as HTMLElement));
addEventListener('vizitor:consent-change', sync);
sync();

/* Article table of contents: current-section marker and the mobile "jump to" select. */
const toc = document.querySelectorAll<HTMLAnchorElement>('.privacy-toc a[href^="#"]:not(.privacy-toc-top)');
const jump = document.querySelector<HTMLSelectElement>('[data-toc-select]');
if (toc.length || jump) {
  const headings = [...document.querySelectorAll<HTMLElement>('.post-prose h2[id], .post-prose h3[id]')];
  const mark = (id: string) => {
    toc.forEach(a => (a.getAttribute('href') === '#' + id ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
    if (jump && [...jump.options].some(o => o.value === id)) jump.value = id;
  };
  let frame = 0;
  const update = () => {
    frame = 0;
    let current = headings[0]?.id;
    for (const h of headings) if (h.getBoundingClientRect().top < innerHeight * 0.3) current = h.id;
    if (current) mark(current);
  };
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  update();
  jump?.addEventListener('change', () => {
    const target = document.getElementById(jump.value);
    if (!target) return;
    target.scrollIntoView({ behavior: reduced() ? 'instant' : 'smooth', block: 'start' });
    target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true });
  });
}

/* Article: reading progress next to the TOC. */
const layout = document.querySelector<HTMLElement>('.blog-layout');
const article = document.getElementById('cikk');
if (layout && article) {
  let raf = 0;
  const progress = () => {
    raf = 0;
    const r = article.getBoundingClientRect();
    const total = r.height - innerHeight * 0.6;
    layout.style.setProperty('--read', String(Math.max(0, Math.min(1, (innerHeight * 0.4 - r.top) / Math.max(total, 1)))));
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(progress); }, { passive: true });
  progress();
}

/* Blog index: instant search across every published post (title, excerpt, topic), accent-insensitive. */
const searchForm = document.querySelector<HTMLFormElement>('[data-blog-search]');
const indexEl = document.getElementById('blog-search-index');
if (searchForm && indexEl) {
  type Hit = { t: string; e: string; c: string; u: string; d: string; m: number };
  const items = JSON.parse(indexEl.textContent || '[]') as Hit[];
  const input = searchForm.querySelector<HTMLInputElement>('input')!;
  const results = document.querySelector<HTMLElement>('[data-blog-results]')!;
  const fallback = document.querySelector<HTMLElement>('[data-blog-default]')!;
  const status = document.querySelector<HTMLElement>('[data-blog-status]');
  const hero = document.querySelector<HTMLElement>('.bl-hero');
  const fold = (s: string) => s.toLocaleLowerCase('hu').normalize('NFD').replace(/\p{M}/gu, '');
  const esc = (s: string) => s.replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]!);
  const prepared = items.map(it => ({ it, title: fold(it.t), body: fold(`${it.e} ${it.c}`) }));
  // Wrap matches in <mark> using the folded text for positions (same length as the original after NFD folding of precomposed letters).
  const mark = (text: string, words: string[]) => {
    const folded = fold(text);
    if (folded.length !== text.length) return esc(text);
    const ranges: [number, number][] = [];
    for (const w of words) { let i = folded.indexOf(w); while (i !== -1) { ranges.push([i, i + w.length]); i = folded.indexOf(w, i + w.length); } }
    ranges.sort((a, b) => a[0] - b[0]);
    let out = '', at = 0;
    for (const [s, e] of ranges) { if (s < at) continue; out += esc(text.slice(at, s)) + '<mark>' + esc(text.slice(s, e)) + '</mark>'; at = e; }
    return out + esc(text.slice(at));
  };
  const run = () => {
    const q = input.value.trim();
    const words = fold(q).split(/\s+/).filter(w => w.length > 1);
    const url = new URL(location.href);
    if (q) url.searchParams.set('q', q); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    hero?.classList.toggle('is-searching', words.length > 0);
    if (!words.length) { results.hidden = true; fallback.hidden = false; if (status) status.textContent = ''; return; }
    const hits = prepared
      .filter(p => words.every(w => p.title.includes(w) || p.body.includes(w)))
      .map(p => ({ ...p, score: words.reduce((s, w) => s + (p.title.includes(w) ? 3 : 1), 0) }))
      .sort((a, b) => b.score - a.score);
    fallback.hidden = true; results.hidden = false;
    const label = `„${esc(q)}”`;
    results.innerHTML = hits.length
      ? `<p class="bl-results-head"><strong>${hits.length}</strong> találat erre: ${label}</p><ol class="bl-hits">${hits.map(({ it }) =>
          `<li><a class="bl-hit" href="${esc(it.u)}"><span class="bl-eyebrow">${esc(it.c)} · ${esc(it.d)} · ${it.m} perc</span><strong>${mark(it.t, words)}</strong><span class="bl-hit-excerpt">${mark(it.e, words)}</span></a></li>`).join('')}</ol>`
      : `<div class="bl-empty"><p class="bl-results-head">Erre nincs még cikk: ${label}</p><p>Lehet, hogy pont ebből lesz a következő. <a href="/kapcsolat/">Írd meg, mire vagy kíváncsi</a>, vagy nézz körül a témák között.</p></div>`;
    if (status) status.textContent = hits.length ? `${hits.length} találat` : 'Nincs találat';
  };
  let t = 0;
  input.addEventListener('input', () => { clearTimeout(t); t = window.setTimeout(run, 120); });
  searchForm.addEventListener('submit', e => { e.preventDefault(); run(); });
  input.addEventListener('keydown', e => { if (e.key === 'Escape' && input.value) { input.value = ''; run(); } });
  addEventListener('keydown', e => {
    const el = document.activeElement as HTMLElement | null;
    if (e.key === '/' && !e.metaKey && !e.ctrlKey && !(el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)))) { e.preventDefault(); input.focus(); }
  });
  const initial = new URLSearchParams(location.search).get('q');
  if (initial) { input.value = initial; run(); }
}

/* Blog index: topic filters tuck behind an icon; open state is remembered only for this visit. */
const filterToggle = document.querySelector<HTMLButtonElement>('[data-filter-toggle]');
const filterPanel = document.querySelector<HTMLElement>('[data-filter-panel]');
if (filterToggle && filterPanel) {
  const set = (open: boolean) => { filterPanel.dataset.state = open ? 'open' : 'closed'; filterToggle.setAttribute('aria-expanded', String(open)); };
  let remembered = false;
  try { remembered = sessionStorage.getItem('vz-filters') === 'open'; } catch { /* storage blocked */ }
  filterPanel.style.transition = 'none';
  set(remembered);
  void filterPanel.offsetHeight;
  filterPanel.style.transition = '';
  filterToggle.addEventListener('click', () => {
    const open = filterPanel.dataset.state !== 'open';
    set(open);
    try { sessionStorage.setItem('vz-filters', open ? 'open' : 'closed'); } catch { /* storage blocked */ }
  });
  filterPanel.addEventListener('keydown', e => { if (e.key === 'Escape') { set(false); filterToggle.focus(); } });
}
