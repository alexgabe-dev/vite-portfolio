import { track } from './analytics';
import { ConsentBanner } from './components/ConsentBanner';
import { Icon } from './components/Icon';
export { pageMetadata } from './seo';
export { Privacy } from './components/Privacy';
import { Impressum } from './components/Impressum';
export { ServicePage } from './components/ServicePage';
import { NotFound } from './components/NotFound';
import { takeInquiry, rememberSelection, rememberPackageCategory, takePackageCategory } from './contact-intent';
import { projects } from './content/projects';
import { canonicalRoutes, normalizePath, isServicePath, sectionPages } from './routes';
import { SwipeDeck } from './components/SwipeDeck';
import { Hero } from './components/Hero';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ContactSection, type ContactIntent } from './components/ContactSection';
import { FAQ } from './components/FAQ';
import { Pricing, type PackageCategory } from './components/Pricing';
import { ProcessStudio } from './components/ProcessStudio';
import { Sculpture } from './components/Sculpture';
import { CardContainer, CardItem } from './components/ui/3d-card';
import { useEffect, useState, type ReactNode } from 'react';


function RecruitIllustration() { return <div className="recruit-art" role="img" aria-label="A Recruit Planner funkcióit bemutató sematikus felületi illusztráció, nem valódi ügyféladatokkal"><div className="recruit-sidebar"><b>rp<span>.</span></b><i/><i/><i/><i/><i/></div><div className="recruit-main"><div className="recruit-top"><span>Recruit Planner</span><span className="avatar">RP</span></div><h3>Minden kampány.<br/>Egy helyen.</h3><div className="recruit-metrics"><div>Hirdetések<span>Áttekintés</span></div><div>Partnerek<span>Kapcsolatok</span></div></div><div className="recruit-calendar"><div>HÉT<span>H</span><span>K</span><span>SZ</span><span>CS</span><span>P</span></div><div className="calendar-bars"><i/><i/><i/></div></div><span className="illustration-label">FELÜLETI ILLUSZTRÁCIÓ</span></div></div>; }

function usePageExperience() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.setAttribute('data-revealed','');observer.unobserve(entry.target);}}), { threshold:.08, rootMargin:'0px 0px -25px 0px' });
    if(!reduced.matches)document.documentElement.classList.add('motion-ready');
    document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));
    function focusDestination(event: MouseEvent) {
      if(event.ctrlKey||event.metaKey||event.shiftKey||event.button!==0)return;
      const link=(event.target as Element)?.closest('a[href]');if(!link)return;
      const url=new URL((link as HTMLAnchorElement).href);if(url.origin!==location.origin||url.pathname!==location.pathname||url.search!==location.search||!url.hash)return;
      const target=document.getElementById(decodeURIComponent(url.hash.slice(1)));if(!target)return;
      if(url.hash==='#top'){event.preventDefault();window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});target.setAttribute('tabindex','-1');target.focus({preventScroll:true});return;}
      event.preventDefault();target.scrollIntoView({behavior:reduced.matches?'instant':'smooth'});if(!target.hasAttribute('tabindex'))target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
    }
    // Align deep links after the sticky process section has its final height.
    let disposed = false;
    let interacted = false;
    const markInteraction = () => { interacted = true; };
    window.addEventListener('wheel', markInteraction, { passive: true, once: true });
    window.addEventListener('pointerdown', markInteraction, { once: true });
    window.addEventListener('keydown', markInteraction, { once: true });
    const initialHash = location.hash;
    const legacy=sectionPages.find(item=>'#'+item.id===initialHash);
    if(location.pathname==='/'&&legacy)location.replace(legacy.path);
    const alignInitialLink = () => requestAnimationFrame(() => requestAnimationFrame(() => {
      if (disposed || interacted || !initialHash || initialHash !== location.hash) return;
      try { document.getElementById(decodeURIComponent(initialHash.slice(1)))?.scrollIntoView({ behavior: 'instant' }); } catch { /* Ignore a malformed fragment. */ }
    }));
    void document.fonts.ready.then(alignInitialLink);
    document.addEventListener('click',focusDestination);
    return ()=>{disposed=true;observer.disconnect();window.removeEventListener('wheel',markInteraction);window.removeEventListener('pointerdown',markInteraction);window.removeEventListener('keydown',markInteraction);document.documentElement.classList.remove('motion-ready');document.removeEventListener('click',focusDestination);};
  },[]);
}
function ProjectArchive() {
  const [filter, setFilter] = useState('all');
  return <main id="main" className="archive-main"><section className="archive-heading wrap"><nav className="page-breadcrumb" aria-label="Morzsamenü"><a href="/">Főoldal</a><span aria-hidden="true">/</span><span aria-current="page">Projektek</span></nav><p className="eyebrow">Válogatott projektek</p><h1>Weboldalak.<br/><span>És ami mögöttük van.</span></h1><div className="archive-intro"><p>Közösségi kampány, vendéglátóhely, üzleti alkalmazás, bemutatkozó oldal. Itt néhány megvalósítás szerepel; a további fejlesztések és kísérletek a GitHubon találhatók.</p><div className="filters" role="group" aria-label="Projektek szűrése">{[['all','Minden'],['web','Weboldalak'],['app','Alkalmazások']].map(([v,l])=><button key={v} aria-pressed={filter===v} onClick={()=>{if(v!==filter)track('project_filter',{filter_id:v});setFilter(v);}}>{l}</button>)}</div></div></section><section className="wrap archive-projects" aria-label="Válogatott projektek"><div className="project-grid">{projects.filter(p=>filter==='all'||filter===p.type).map(p=><CardContainer key={p.name}><article className={'project '+p.className}><CardItem translateZ={35}><a className="project-visual" href={p.href} target="_blank" rel="noopener noreferrer" aria-label={p.name+' — '+p.label+' (új lapon)'}>{p.image?<div className="browser-frame"><div className="browser-chrome"><span/><span/><span/><i>{new URL(p.href).hostname}</i></div><img src={p.image} alt={p.alt} width="1120" height="747" loading="lazy" decoding="async"/></div>:<RecruitIllustration/>}<span className="project-hover">{p.label}</span></a></CardItem><CardItem translateZ={18}><div className="project-info"><div><p className="project-category">{p.category}</p><h2><a href={p.href} target="_blank" rel="noopener noreferrer">{p.name}</a></h2></div></div><p className="project-description">{p.description}</p></CardItem></article></CardContainer>)}</div><a className="github-link" href="https://github.com/alexgabe-dev?tab=repositories" target="_blank" rel="noopener noreferrer">További projektek és kísérletek a GitHubon<span aria-hidden="true"><Icon name="plus"/></span></a></section><section className="archive-contact wrap"><h2>Te mit építenél?</h2><a className="button orange" href="/kapcsolat/">Beszéljünk róla</a></section></main>;
}

function ServicesSection({request,setPricingCategory,standalone=false}:{request:(service:string,plan?:string)=>void;setPricingCategory:(category:PackageCategory)=>void;standalone?:boolean}){
 const Heading=standalone?'h1':'h2';
 const CardHeading=standalone?'h2':'h3';
 return <section className="intro-section wrap section" id="szolgaltatasok" aria-labelledby="services-title"><div className="service-background-art" aria-hidden="true"><svg viewBox="0 0 1440 1120" fill="none" preserveAspectRatio="xMidYMid slice"><g stroke="#ff5c35" strokeWidth="1.4"><path d="M780-130C640 1 730 178 889 180C1068 182 1114 30 1007-5C892-43 817 63 902 150C991 241 1144 196 1180 89" opacity=".24"/><path d="M805-130C665 1 755 178 914 180C1093 182 1139 30 1032-5C917-43 842 63 927 150C1016 241 1169 196 1205 89" opacity=".12"/><path d="M1478 344C1323 359 1308 512 1438 578" opacity=".32"/><path d="M1498 365C1343 380 1328 533 1458 599" opacity=".14"/><path d="M-151 785C-3 693 109 796 48 929C-14 1061 167 1176 314 1080C451 991 510 1105 434 1204" opacity=".24"/><path d="M-138 810C10 718 122 821 61 954C-1 1086 180 1201 327 1105C464 1016 523 1130 447 1229" opacity=".12"/><path d="M1119 1181L1424 942M1142 1198L1447 959" opacity=".15"/></g><circle cx="-16" cy="950" r="171" fill="#ff5c35" opacity=".045"/><circle cx="-16" cy="950" r="222" stroke="#ff5c35" strokeWidth="1" opacity=".1"/><rect x="1056" y="56" width="21" height="21" rx="4" transform="rotate(24 1056 56)" fill="#ff5c35" opacity=".16"/><g stroke="#ff5c35" strokeWidth="1.4" opacity=".45"><path d="M49 310v14m-7-7h14M1374 855v14m-7-7h14"/></g></svg></div><div className="section-intro"><div><p className="eyebrow">Miben segít a Vizitor?</p><Heading id="services-title">A jó megjelenés<br/>csak a kezdet.</Heading></div><p className="section-side">Új weboldal, több érdeklődő vagy kevesebb kézi munka? Mondd el, mire van szükséged, és megnézzük, mi visz közelebb hozzá.</p></div><SwipeDeck className="capability-grid" label="A Vizitor szolgáltatásai">{[{kind:'web' as const,path:'/weboldalkeszites/',title:'Weboldalkészítés',tag:'DIZÁJN + FEJLESZTÉS',text:'Bemutatkozó oldal, webshop vagy teljes újratervezés. A látogatód értse, mit kínálsz, és könnyen eljusson a következő lépésig.',items:['Egyedi dizájn és felépítés','Mobilra tervezett felület','WordPress vagy egyedi fejlesztés'],cta:'Weboldalt szeretnék',service:'Weboldal'},{kind:'systems' as const,path:'/egyedi-webfejlesztes/',title:'Egyedi fejlesztések',tag:'RENDSZER + AUTOMATIZÁLÁS',text:'Webalkalmazások, AI-chatbotok és automatizációk. Kapcsoljuk össze a rendszereidet, és egyszerűsítsük a napi munkát.',items:['Webalkalmazások és API-integrációk','AI-chatbotok saját tudásanyagból','Automatizált üzleti folyamatok'],cta:'Rendszert építenék',service:'Egyedi fejlesztés'},{kind:'growth' as const,path:'/online-marketing/',title:'Marketing és mérés',tag:'KAMPÁNY + OPTIMALIZÁLÁS',text:'Google Ads- és Meta-hirdetéskezelés, SEO, webanalitika és MarTech. A kampányokat és a mérést együtt nézzük, hogy lásd, miből érkeznek érdeklődők.',items:['Google Ads, Facebook és Instagram','GA4, Tag Manager és Meta Pixel','SEO és konverziómérés'],cta:'Marketingben kérek segítséget',service:'Marketing és mérés'}].map(s=><article className="capability-card" key={s.kind} data-reveal><div className="capability-art"><Sculpture kind={s.kind}/></div><div className="capability-copy"><p className="eyebrow">{s.tag}</p><CardHeading><a href={s.path}>{s.title}</a></CardHeading><p>{s.text}</p><ul>{s.items.map(i=><li key={i}>{i}</li>)}</ul><a className="capability-cta" href="/kapcsolat/" onClick={()=>request(s.service)}>{s.cta}<span aria-hidden="true"><Icon name="plus"/></span></a></div></article>)}</SwipeDeck><div className="service-care"><div><CardHeading>Az indulás után is legyen kire számítani.</CardHeading><p>Weboldalak, alkalmazások és e-mail-rendszerek karbantartása. Frissítések, mentések és működésellenőrzés, az adott rendszerhez igazított havidíjjal.</p></div><a href="/arak/" onClick={()=>setPricingCategory('care')}>Karbantartási csomagok<span aria-hidden="true"><Icon name="arrow-up-right"/></span></a></div></section>;
}
function ProcessSection({standalone=false}:{standalone?:boolean}){return <section className="process-section section" id="folyamat" aria-labelledby="process-title"><div className="wrap"><ProcessStudio standalone={standalone}/><div className="archive-teaser"><span>Nézd meg, milyen feladatokon dolgoztam.</span><a href="/munkak/">Projektek megtekintése<span aria-hidden="true"><Icon name="plus"/></span></a></div></div></section>;}

export default function App({page='/',privacyContent,serviceContent}:{page?:string;privacyContent?:ReactNode;serviceContent?:ReactNode}) {
  page=normalizePath(page);
  const service=isServicePath(page);
  const sectionPage=sectionPages.find(item=>item.path===page);
  const missing=!canonicalRoutes.includes(page);
  const archive=/^\/munkak\/?$/.test(page);
  const imprint=page==='/impresszum/';
  const legal=/^\/adatvedelem\/?$/.test(page)||imprint;

  const [intent,setIntent]=useState<ContactIntent>();
  const [pricingCategory,setPricingCategory]=useState<PackageCategory>('web');
  useEffect(()=>{if(page==='/kapcsolat/'){const selection=takeInquiry();if(selection)setIntent(selection);}if(page==='/arak/'){const category=takePackageCategory();if(category)setPricingCategory(category);}},[page]);
  usePageExperience();
  const request=(service:string,plan?:string)=>{rememberSelection(service,plan);setIntent({service,plan,key:Date.now()});};
  const showPackages=(category:PackageCategory)=>{rememberPackageCategory(category);setPricingCategory(category);};
  return <><a href="#main" className="skip-link">Ugrás a tartalomhoz</a><Header archive={archive} legal={legal||service||missing} activeSection={sectionPage?.id}/>{missing?<NotFound/>:service?serviceContent:imprint?<Impressum/>:legal?privacyContent:archive?<ProjectArchive/>:<main id="main" className={sectionPage?'section-page section-page-'+sectionPage.id:undefined}>
    {sectionPage&&<nav className="page-breadcrumb wrap section-breadcrumb" aria-label="Morzsamenü"><a href="/">Főoldal</a><span aria-hidden="true">/</span><span aria-current="page">{sectionPage.label}</span></nav>}
    {!sectionPage&&<Hero/>}
    {(!sectionPage||sectionPage.id==='szolgaltatasok')&&<ServicesSection request={request} setPricingCategory={showPackages} standalone={!!sectionPage}/>}
    {(!sectionPage||sectionPage.id==='folyamat')&&<ProcessSection standalone={!!sectionPage}/>}
    {(!sectionPage||sectionPage.id==='csomagok')&&<Pricing onRequest={request} category={pricingCategory} onCategoryChange={setPricingCategory} standalone={!!sectionPage}/>}
    {(!sectionPage||sectionPage.id==='kerdesek')&&<FAQ onShowPackages={showPackages} standalone={!!sectionPage}/>}
    {(!sectionPage||sectionPage.id==='kapcsolat')&&<ContactSection intent={intent} standalone={!!sectionPage}/>}
  </main>}<Footer archive={archive||legal||service||missing}/><ConsentBanner/></>;
}
