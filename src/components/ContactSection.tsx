import { track } from '../analytics';
import { Icon } from './Icon';
import { useEffect, useRef, useState, type FormEvent } from 'react';

export type ContactIntent = { service: string; plan?: string; key: number };
export const CONTACT_ENDPOINT = '/api/contact/';
type Status = 'idle' | 'sending' | 'success' | 'error';
type FieldErrors = { email?: string; message?: string };
function MessageArtwork({ active, sent }: { active: boolean; sent: boolean }) {
  const artwork = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = artwork.current;
    if (!host) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0, visible = true;
    const scroll = () => {
      if (frame || reduced.matches || !visible || document.hidden) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const bounds = host.getBoundingClientRect();
        const position = Math.max(-1, Math.min(1, (innerHeight * .5 - bounds.top - bounds.height * .5) / ((innerHeight + bounds.height) * .5)));
        host.style.setProperty('--art-scroll', `${(position * 14).toFixed(3)}px`);
        host.style.setProperty('--art-roll', `${(position * .8).toFixed(3)}deg`);
      });
    };
    const pointer = (event: PointerEvent) => {
      if (!fine.matches || reduced.matches || event.pointerType !== 'mouse') return;
      const bounds = host.getBoundingClientRect();
      const x = -Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1)) * 3;
      const y = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)) * 4;
      host.style.setProperty('--art-x', `${x.toFixed(3)}deg`);
      host.style.setProperty('--art-y', `${y.toFixed(3)}deg`);
    };
    const leave = () => { host.style.setProperty('--art-x', '0deg'); host.style.setProperty('--art-y', '0deg'); };
    const preference = () => {
      cancelAnimationFrame(frame); frame = 0; leave();
      host.style.setProperty('--art-scroll', '0px'); host.style.setProperty('--art-roll', '0deg');
      scroll();
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) scroll();
      else { cancelAnimationFrame(frame); frame = 0; }
    });
    observer.observe(host);
    host.addEventListener('pointermove', pointer); host.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', scroll, { passive: true }); window.addEventListener('resize', scroll);
    document.addEventListener('visibilitychange', scroll); reduced.addEventListener('change', preference);
    scroll();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      host.removeEventListener('pointermove', pointer); host.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll);
      document.removeEventListener('visibilitychange', scroll); reduced.removeEventListener('change', preference);
    };
  }, []);  return <div ref={artwork} className={'message-artwork'+(active?' is-writing':'')+(sent?' is-delivered':'')} aria-hidden="true"><svg viewBox="0 0 520 310" fill="none"><defs><linearGradient id="contact-paper" x1="173" y1="60" x2="335" y2="232" gradientUnits="userSpaceOnUse"><stop stopColor="#f6f7ef"/><stop offset="1" stopColor="#b9c6c9"/></linearGradient><linearGradient id="contact-orange" x1="154" y1="68" x2="317" y2="204" gradientUnits="userSpaceOnUse"><stop stopColor="#ffad82"/><stop offset=".35" stopColor="#ff5c35"/><stop offset="1" stopColor="#e13f24"/></linearGradient><linearGradient id="contact-fold" x1="270" y1="115" x2="214" y2="204" gradientUnits="userSpaceOnUse"><stop stopColor="#ac311d"/><stop offset="1" stopColor="#f4542b"/></linearGradient></defs>
    <g className="message-guide" stroke="#667e90" strokeWidth=".8"><path d="M54 232 259 292l209-98-204-69Z" opacity=".19"/><path d="m78 240 178 51 177-83" opacity=".12"/><path d="M79 129v13m-6-7h13M446 111v13m-6-6h13" opacity=".5"/></g>
    <g className="message-tray"><path d="m99 195 167-65 157 62v17l-160 66-164-62Z" fill="#15202a" stroke="#455a69" strokeWidth="1"/><path d="m99 195 164 64 160-67-157-62Z" fill="#24323c" stroke="#5c7280" strokeWidth=".8"/><path d="m123 194 143-55 132 53-136 57Z" fill="#18252e" stroke="#718795" strokeOpacity=".3"/></g>
    <g className="message-letter">
      <path d="m153 98 129-48 100 119v4l-135 51-94-122Z" fill="#879a9f"/>
      <path d="m153 94 129-48 100 119-135 51Z" fill="url(#contact-paper)" stroke="#f8fbf5" strokeOpacity=".7" strokeWidth=".8"/>
      <path d="m180 103 68-25m-55 42 70-26m-56 43 78-29" stroke="#6c7e86" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round"/>
      <path d="m245 177 48-18" stroke="#ff5c35" strokeWidth="2.5" strokeLinecap="round"/>
    </g>
    <g className="message-plane" strokeLinejoin="round">
      {/* Four faces share the same nose and folded spine, projected from one 3D model. */}
      <path d="M376 82 112 146 210.4 156.64Z" fill="url(#contact-orange)" stroke="#ff9b72" strokeWidth=".65"/>
      <path d="M376 82 210.4 156.64 220 188.8Z" fill="#ae341f" stroke="#c44829" strokeWidth=".5"/>
      <path d="M376 82 220 188.8 229.6 163.36Z" fill="#ff9262" stroke="#ffaf7d" strokeWidth=".55"/>
      <path d="M376 82 229.6 163.36 272 202Z" fill="url(#contact-orange)" stroke="#ffae80" strokeWidth=".65"/>
      <path d="M112 146 210.4 156.64 376 82M229.6 163.36 376 82" stroke="#ffd0a7" strokeWidth="1" strokeLinecap="round"/>
      <path d="m116 147 94.4 11.5 9.6 31.8" stroke="#96301f" strokeWidth="1.3" strokeOpacity=".55"/>
    </g>
    <path className="message-flight-path" d="M60 188c-31-63 45-112 80-75 33 35-22 70-6 103 11 24 50 30 74 10" stroke="#ff805e" strokeOpacity=".5" strokeWidth="1" strokeDasharray="3 6"/>
  </svg></div>;
}
export function ContactSection({ intent, standalone=false }: { intent?: ContactIntent; standalone?:boolean }) {
  const Heading=standalone?'h1':'h2';
  const Subheading=standalone?'h2':'h3';
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [message,setMessage]=useState('');
  const [service,setService]=useState('');
  const [plan,setPlan]=useState('');
  const [status,setStatus]=useState<Status>('idle');
  const [errors,setErrors]=useState<FieldErrors>({});
  const [failure,setFailure]=useState('');

  const [submittedEmail,setSubmittedEmail]=useState('');
  const emailRef=useRef<HTMLInputElement>(null);
  const messageRef=useRef<HTMLTextAreaElement>(null);
  const successRef=useRef<HTMLDivElement>(null);
  const busy=useRef(false);
  const abort=useRef<AbortController|null>(null);
  useEffect(()=>{if(intent&&!busy.current){setService(intent.service==='Más'?'':intent.service);setPlan(intent.plan||'');setStatus('idle');setFailure('');}},[intent]);
  useEffect(()=>{if(status==='success')successRef.current?.focus({preventScroll:true});},[status]);
  useEffect(()=>()=>abort.current?.abort(),[]);
  function fieldError(field: 'email'|'message') {
    if(field==='email') {
      if(!email.trim())return 'Add meg az e-mail-címed, hogy válaszolni tudjak.';
      if(!emailRef.current?.validity.valid||!email.trim().includes('@')||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))return 'Ellenőrizd az e-mail-címet, például: nev@pelda.hu.';
    } else if(!message.trim())return 'Írj pár szót arról, miben kérsz segítséget.';
    return undefined;
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(busy.current)return;
    const next={email:fieldError('email'),message:fieldError('message')};
    setErrors(next);
    if(next.email||next.message){if(next.email)track('inquiry_validation',{form_id:'inquiry',error_type:email.trim()?'email_invalid':'email_required'});if(next.message)track('inquiry_validation',{form_id:'inquiry',error_type:'message_required'});(next.email?emailRef:messageRef).current?.focus();return;}
    const form=event.currentTarget;
    const fields=new FormData(form);
    const data=JSON.stringify({name:name.trim(),email:email.trim(),message:message.trim(),service:service||'Egyeztetést kérek',package:plan,_gotcha:String(fields.get('_gotcha')||'')});
    track('inquiry_submit',{form_id:'inquiry',service_count:service?1:0,has_package:!!plan});
    busy.current=true;setStatus('sending');setFailure('');
    const controller=new AbortController();abort.current=controller;
    const timeout=window.setTimeout(()=>controller.abort(),20000);
    try {
      const response=await fetch(CONTACT_ENDPOINT,{method:'POST',body:data,headers:{Accept:'application/json','Content-Type':'application/json'},signal:controller.signal});
      const result=await response.json().catch(()=>null) as {ok?:boolean;errors?:{field?:string;message?:string}[]}|null;
      if(!response.ok||result?.ok!==true){
        track('inquiry_error',{form_id:'inquiry',error_type:response.status===429?'rate_limited':'server',http_status:response.status});
        setFailure(response.status===429?'Most túl sok kérés érkezett. Próbáld újra később, vagy írj közvetlenül e-mailt.':'Az üzenet nem ment el. Az adataid megmaradtak; próbáld újra, vagy írj közvetlenül e-mailt.');
        setStatus('error');return;
      }
      track('generate_lead',{form_id:'inquiry',service_count:service?1:0,has_package:!!plan,lead_source:'website_inquiry'});
      setSubmittedEmail(email.trim());setStatus('success');setMessage('');setErrors({});
    } catch(error) {
      track('inquiry_error',{form_id:'inquiry',error_type:error instanceof DOMException&&error.name==='AbortError'?'timeout':'network'});
      setFailure(error instanceof DOMException&&error.name==='AbortError'?'Nem érkezett visszaigazolás a küldésről. Az adataid megmaradtak; írj közvetlenül e-mailt, vagy próbáld újra később.':'Nem sikerült kapcsolódni. A kitöltött adataid megmaradtak; ellenőrizd az internetkapcsolatot, és próbáld újra.');
      setStatus('error');
    } finally {window.clearTimeout(timeout);busy.current=false;abort.current=null;}
  }
  const pending=status==='sending';
  const fallbackBody=`Szia!\n\n${name.trim()?'Név: '+name.trim()+'\n':''}Válaszcím: ${email.trim()}\n${service?'Amiben segítséget kérek: '+service+'\n':''}${plan?'Csomag: '+plan+'\n':''}\n${message.trim()}`;
  return <section className="inquiry-section section" id="kapcsolat" aria-labelledby="contact-title"><div className="wrap inquiry-layout">
    <div className="inquiry-intro"><p className="eyebrow">Kapcsolat</p><Heading id="contact-title">Beszéljük<br/>meg<span>.</span></Heading><p className="inquiry-lead">Írd meg, mire van szükséged.<br/>A többit átbeszéljük.</p><MessageArtwork active={pending} sent={status==='success'}/><div className="inquiry-direct"><p>Inkább közvetlenül?</p><a href="mailto:info@vizitor.hu"><span>info@vizitor.hu</span><span aria-hidden="true"><Icon name="arrow-up-right"/></span></a><a href="tel:+36205180921" className="inquiry-phone">+36 20 518 0921</a></div></div>
    <div data-clarity-mask="true" className={'inquiry-card'+(status==='success'?' inquiry-complete':'')}>
      {status==='success'?<div className="inquiry-success" ref={successRef} tabIndex={-1} role="status"><span className="inquiry-success-icon" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><path d="m17 33 10 10 21-23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="32" cy="32" r="29" stroke="currentColor" strokeOpacity=".2"/></svg></span><p className="eyebrow">Köszönöm a megkeresést</p><Subheading>Üzenet elküldve<span>.</span></Subheading><p>Erre a címre fogok válaszolni:<br/><strong>{submittedEmail}</strong></p><p className="inquiry-success-next">Elolvasom az üzeneted, és e-mailben válaszolok.</p><button type="button" onClick={()=>{setStatus('idle');setPlan('');requestAnimationFrame(()=>emailRef.current?.focus());}}>Másik üzenetet írok<span aria-hidden="true"><Icon name="arrow-up-right"/></span></button></div>:<form id="inquiry-form" className="inquiry-form" aria-label="Kapcsolatfelvétel a Vizitorral" action={CONTACT_ENDPOINT} method="POST" noValidate onSubmit={submit} aria-busy={pending}>
        <div className="inquiry-form-heading"><Subheading>Miben segíthetek?</Subheading><p>Elég az e-mail-címed és néhány mondat.</p></div>
        {plan&&<div className="inquiry-context"><div><span>Erről érdeklődsz</span><p>{plan}</p></div><button type="button" disabled={pending} aria-label="Csomagválasztás törlése" onClick={()=>setPlan('')}><Icon name="close"/></button></div>}
        <div className="inquiry-field"><label htmlFor="inquiry-email">E-mail-címed</label><input ref={emailRef} id="inquiry-email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required maxLength={254} placeholder="nev@pelda.hu" value={email} disabled={pending} aria-invalid={!!errors.email} aria-describedby={errors.email?'inquiry-email-error':undefined} onChange={event=>{setEmail(event.target.value);if(errors.email)setErrors(previous=>({...previous,email:undefined}));}} onBlur={()=>{if(email.trim())setErrors(previous=>({...previous,email:fieldError('email')}));}}/>{errors.email&&<p className="inquiry-field-error" id="inquiry-email-error" role="alert">{errors.email}</p>}</div>
        <div className="inquiry-field"><label htmlFor="inquiry-message">Mire van szükséged?</label><textarea ref={messageRef} id="inquiry-message" name="message" rows={4} maxLength={5000} required placeholder="Például: van már weboldalam, de több érdeklődőt szeretnék elérni." value={message} disabled={pending} aria-invalid={!!errors.message} aria-describedby={'inquiry-message-hint'+(errors.message?' inquiry-message-error':'')} onChange={event=>{setMessage(event.target.value);if(errors.message)setErrors(previous=>({...previous,message:undefined}));}}/>{errors.message&&<p className="inquiry-field-error" id="inquiry-message-error" role="alert">{errors.message}</p>}<p className="inquiry-field-hint" id="inquiry-message-hint">Ha van weboldalad, a linkjét is elküldheted.</p></div>
        <div className="inquiry-field"><label htmlFor="inquiry-name">Hogy szólíthatlak? <span>nem kötelező</span></label><input id="inquiry-name" name="name" autoComplete="name" maxLength={100} placeholder="Neved" value={name} disabled={pending} onChange={event=>setName(event.target.value)}/></div>
        <div className="inquiry-trap" aria-hidden="true"><label htmlFor="inquiry-website">Ezt hagyd üresen</label><input id="inquiry-website" name="_gotcha" tabIndex={-1} autoComplete="off"/></div>
        {status==='error'&&<div className="inquiry-send-error" role="alert"><p>{failure}</p><button type="button" onClick={()=>{track('contact_click',{method:'email',location:'contact'});window.location.href='mailto:info@vizitor.hu?subject='+encodeURIComponent('Vizitor megkeresés')+'&body='+encodeURIComponent(fallbackBody);}}>Megnyitom e-mailben<span aria-hidden="true"><Icon name="arrow-up-right"/></span></button></div>}
        <button className="inquiry-submit" type="submit" disabled={pending}>{pending?<><span className="inquiry-spinner" aria-hidden="true"/>Küldés folyamatban…</>:<>Üzenet küldése<span className="inquiry-submit-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m4 11 16-7-7 16-2-7-7-2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="m11 13 9-9" stroke="currentColor" strokeWidth="1.4"/></svg></span></>}</button>
        <p className="inquiry-privacy">Az adataidat a megkeresés megválaszolásához használom. <a href="/adatvedelem/" target="_blank" rel="noopener noreferrer">Adatkezelési tájékoztató<span className="sr-only"> (új lapon)</span></a></p>
      </form>}
    </div>
  </div></section>;
}
