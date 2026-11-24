import { track } from '../analytics';
import { openConsentSettings } from '../consent';
import { FooterSocials } from './FooterSocials';
import { Icon } from './Icon';
import { useEffect, useRef, useState } from 'react';
import { serviceLinks, sectionPath } from '../routes';

export function Footer({ archive }: { archive: boolean }) {
  const wordmark = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const host=wordmark.current;
    if(!host||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    host.classList.add('is-armed');
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting))return;
      host.classList.add('is-visible');
      observer.disconnect();
    },{threshold:.18});
    observer.observe(host);
    return()=>{observer.disconnect();host.classList.remove('is-armed','is-visible');};
  },[]);

  const [copyState,setCopyState]=useState<'idle'|'copied'|'error'>('idle');
  const link=sectionPath;
  async function copyEmail(){try{await navigator.clipboard.writeText('info@vizitor.hu');setCopyState('copied');track('contact_click',{method:'copy_email',location:'footer'});}catch{setCopyState('error');}}
  return <footer className="signature-footer" id="lablec" aria-label="Vizitor lábléc"><div className="wrap">
    <details className="footer-services"><summary><span>Szolgáltatások</span><Icon name="plus"/></summary><nav aria-label="Szolgáltatások részletesen"><div>{serviceLinks.map(item=><a key={item.path} href={item.path}>{item.label}</a>)}</div></nav></details><div className="signature-footer-top">
      <div className="footer-contact-block"><p className="footer-section-label">Maradjunk kapcsolatban</p><div className="footer-address-row"><a className="footer-address" href="mailto:info@vizitor.hu">info@vizitor.hu<span aria-hidden="true"><Icon name="arrow-up-right"/></span></a><button className="footer-copy" type="button" onClick={copyEmail} aria-label="E-mail-cím másolása"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">{copyState==='copied'?<path d="m5 12 4 4 10-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>:<><rect x="8" y="8" width="11" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="1.3"/></>}</svg></button></div><a className="footer-telephone" href="tel:+36205180921">+36 20 518 0921</a><div className="footer-contact-actions"><a href={link('kapcsolat')} className="footer-inquiry">Írok egy üzenetet<span aria-hidden="true"><Icon name="arrow-up-right"/></span></a><p className="footer-copy-feedback" role="status" aria-live="polite">{copyState==='copied'?'E-mail-cím másolva.':copyState==='error'?'A másolás nem sikerült. A cím kijelölhető.':''}</p></div><FooterSocials/></div>
      <nav className="footer-explore" aria-label="Navigáció a láblécben"><p className="footer-section-label">Nézz körül</p>{[['szolgaltatasok','Szolgáltatások'],['folyamat','Így dolgozom'],['csomagok','Csomagok és árak'],['kerdesek','Kérdések és válaszok']].map(([id,title])=><a href={link(id)} key={id}><span>{title}</span><span aria-hidden="true"><Icon name="arrow-up-right"/></span></a>)}</nav>
      <nav className="footer-elsewhere" aria-label="Munkák és további információk"><p className="footer-section-label">A többi részlet</p><a href="/munkak/"><span>Projektek</span><span aria-hidden="true"><Icon name="arrow-up-right"/></span></a><a href="/adatvedelem/" target="_blank" rel="noopener noreferrer"><span>Adatkezelés</span><span aria-hidden="true"><Icon name="arrow-up-right"/></span><span className="sr-only"> (új lapon)</span></a><button type="button" className="footer-consent" onClick={openConsentSettings}>Sütibeállítások<span aria-hidden="true"><Icon name="plus"/></span></button></nav>
    </div>
    <div className="signature-footer-bottom"><div className="footer-signoff"><span>©︎ {new Date().getFullYear()} Vizitor</span><span>Weboldal · Marketing · Karbantartás</span></div><button className="footer-return" type="button" onClick={()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}><span>Vissza a tetejére</span><span className="footer-return-disc" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 19V5m-6 6 6-6 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></span></button></div>
    <div className="footer-wordmark-stage" ref={wordmark}><img className="footer-logo-front" src="/vizitor-logo.svg" alt="Vizitor" width="328" height="103" decoding="async"/></div>
  </div></footer>;
}
