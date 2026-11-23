import { sectionPath } from '../routes';
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';

const mainLinks=[{id:'szolgaltatasok',label:'Szolgáltatások'},{id:'folyamat',label:'Így dolgozunk'},{id:'csomagok',label:'Árak'}];
const sectionIds=['szolgaltatasok','folyamat','csomagok','kerdesek','kapcsolat'];
function Arrow(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
export function Header({archive,legal=false,activeSection}:{archive:boolean;legal?:boolean;activeSection?:string}) {
  const subpage=archive||legal||!!activeSection;
  const [active,setActive]=useState(activeSection||(archive?'projects':''));
  const [scrolled,setScrolled]=useState(false);
  const [contactGlint,setContactGlint]=useState(false);
  const contactSeen=useRef(false);
  const [hovered,setHovered]=useState<string|null>(null);
  const [menu,setMenu]=useState<'closed'|'open'|'closing'>('closed');
  const desktop=useRef<HTMLElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const firstLink=useRef<HTMLAnchorElement>(null);
  const closeTimer=useRef<number|undefined>(undefined);
  const visible=menu!=='closed';
  useEffect(()=>{
    let frame=0;
    const update=()=>{frame=0;setScrolled(window.scrollY>36);if(subpage)return;let next='';const probe=Math.min(window.innerHeight*.32,300);for(const id of sectionIds){const element=document.getElementById(id);if(element&&element.getBoundingClientRect().top<=probe)next=id;}setActive(next);};
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    schedule();window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
    void document.fonts.ready.then(schedule);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
  },[subpage]);
  useEffect(()=>{
    if((subpage&&!activeSection)||active!=='kapcsolat'||contactSeen.current)return;
    contactSeen.current=true;
    setContactGlint(true);
  },[active,subpage,activeSection]);
  useEffect(()=>{
    const nav=desktop.current;
    if(!nav)return;
    const measure=()=>{const item=nav.querySelector<HTMLAnchorElement>(`[data-section="${hovered||active}"]`);nav.style.setProperty('--nav-highlight-opacity',item?'1':'0');if(item){nav.style.setProperty('--nav-highlight-x',`${item.offsetLeft}px`);nav.style.setProperty('--nav-highlight-width',`${item.offsetWidth}px`);}};
    measure();const observer=new ResizeObserver(measure);observer.observe(nav);void document.fonts.ready.then(measure);
    return()=>observer.disconnect();
  },[active,hovered]);
  useEffect(()=>{
    if(!visible)return;
    const node=dialog.current;
    if(!node)return;
    const previous=document.body.style.overflow;
    document.body.style.overflow='hidden';
    node.showModal();firstLink.current?.focus({preventScroll:true});
    return()=>{document.body.style.overflow=previous;};
  },[visible]);
  useEffect(()=>()=>{if(closeTimer.current!==undefined)window.clearTimeout(closeTimer.current);},[]);
  function closeMenu(after?:()=>void){
    if(closeTimer.current!==undefined)return;
    setMenu('closing');
    const finish=()=>{dialog.current?.close();setMenu('closed');closeTimer.current=undefined;if(after)requestAnimationFrame(after);else trigger.current?.focus({preventScroll:true});};
    closeTimer.current=window.setTimeout(finish,window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:220);
  }
  function follow(event:MouseEvent<HTMLAnchorElement>){
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const url=new URL(event.currentTarget.href);
    event.preventDefault();
    closeMenu(()=>{
      if(url.origin!==location.origin||url.pathname!==location.pathname||url.search!==location.search){location.assign(url.href);return;}
      const target=document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if(!target)return;
      
      const behavior=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
      if(url.hash==='#top')window.scrollTo({top:0,behavior});else target.scrollIntoView({behavior,block:'start'});
      if(!target.hasAttribute('tabindex'))target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
    });
  }
  const sectionLink=sectionPath;
  const menuLinks=[...(subpage?[{id:'home',label:'Főoldal',href:'/'}]:[]),...mainLinks.map(link=>({...link,href:sectionLink(link.id)})),{id:'kerdesek',label:'Kérdések és válaszok',href:sectionLink('kerdesek')},{id:'projects',label:'Projektek',href:'/munkak/'}];
  return <header id="top" className={'navigation-header'+(subpage?' is-archive':' is-home')+(active?' has-section':'')+(scrolled?' is-scrolled':'')}>
    <div className="nav-shell"><a className="nav-brand" href="/" aria-label="Vizitor főoldal"><span className={'nav-brand-wordmark'+(contactGlint?' has-contact-glint':'')} onAnimationEnd={()=>setContactGlint(false)}><img src="/vizitor-logo.svg" alt="Vizitor" width="328" height="103"/></span></a>
      <nav className="nav-desktop" aria-label="Fő navigáció" ref={desktop} onMouseLeave={()=>setHovered(null)} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null)&&!event.currentTarget.matches(':hover'))setHovered(null);}}><span className="nav-highlight" aria-hidden="true"/>{mainLinks.map(link=><a key={link.id} href={sectionLink(link.id)} data-section={link.id} aria-current={active===link.id?'location':undefined} onMouseEnter={()=>setHovered(link.id)} onFocus={()=>setHovered(link.id)}><span>{link.label}</span></a>)}</nav>
      <div className="nav-actions"><a className="nav-inquiry" href={sectionLink('kapcsolat')} aria-current={active==='kapcsolat'?'location':undefined}><span className="nav-cta-desktop">Ajánlatot kérek</span><span className="nav-cta-mobile">Beszéljünk</span><span className="nav-inquiry-arrow"><Arrow/></span></a><span className="nav-action-divider" aria-hidden="true"/><button type="button" ref={trigger} className={'nav-menu-trigger'+(visible?' is-open':'')} aria-label={visible?'Menü bezárása':'Menü megnyitása'} aria-haspopup="dialog" aria-expanded={visible} aria-controls="navigation-dialog" onClick={()=>{if(visible)closeMenu();else setMenu('open');}}><span className="nav-menu-lines" aria-hidden="true"><i/><i/></span></button></div>
    </div>
    <dialog ref={dialog} id="navigation-dialog" className="nav-drawer" data-state={menu} aria-labelledby="navigation-dialog-title" onKeyDown={event=>{if(event.key!=='Tab')return;const items=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),[tabindex="0"]')).filter(item=>item.getClientRects().length>0);const first=items[0],last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}} onCancel={event=>{event.preventDefault();closeMenu();}} onClose={()=>setMenu('closed')} onClick={event=>{if(event.target!==event.currentTarget)return;const b=event.currentTarget.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)closeMenu();}}>
      <div className="nav-drawer-bar"><h2 id="navigation-dialog-title">Nézz körül</h2><button className="nav-drawer-close" type="button" onClick={()=>closeMenu()} aria-label="Menü bezárása"><span>Bezárás</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg></button></div>
      <div className="nav-drawer-content"><nav className="nav-drawer-links" aria-label="Teljes navigáció">{menuLinks.map((link,index)=><a ref={index===0?firstLink:undefined} key={link.id} href={link.href} onClick={follow} aria-current={active===link.id?(archive?'page':'location'):undefined} style={{'--nav-order':index} as CSSProperties}><span className="nav-link-index" aria-hidden="true">0{index+1}</span><span>{link.label}</span><span className="nav-link-arrow"><Arrow/></span></a>)}</nav><aside className="nav-drawer-contact" aria-label="Közvetlen elérhetőségek"><p>Közvetlenül</p><a className="nav-drawer-email" href="mailto:info@vizitor.hu">info@vizitor.hu</a><a className="nav-drawer-phone" href="tel:+36205180921">+36 20 518 0921</a><a className="nav-drawer-inquiry" href={sectionLink('kapcsolat')} onClick={follow}>Írok egy üzenetet<Arrow/></a><span className="nav-drawer-services">Weboldal · Marketing · Karbantartás</span></aside></div>
    </dialog>
  </header>;
}
