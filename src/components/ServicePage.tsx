import { Icon } from './Icon';
import type { MouseEvent } from 'react';
import { rememberInquiry } from '../contact-intent';
import { services } from '../content/services';
import { categories } from '../content/packages';
import { Sculpture } from './Sculpture';
const money=(value:number)=>new Intl.NumberFormat('hu-HU').format(value);
export function ServicePage({path}:{path:string}){
 const service=services.find(item=>item.path===path)!;
 const category=categories.find(item=>item.id===service.category);
 const plans=category?.plans.filter(plan=>!service.planNames.length||service.planNames.includes(plan.name));
 function prepareInquiry(event:MouseEvent<HTMLAnchorElement>,plan?:string){if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;rememberInquiry(path,plan);}
 return <main id="main" className="service-page">
  <section className="wrap service-page-hero" aria-labelledby="service-page-title">
   <nav className="page-breadcrumb" aria-label="Morzsamenü"><a href="/">Főoldal</a><span aria-hidden="true">/</span><span aria-current="page">{service.label}</span></nav>
   <div className="service-page-hero-grid"><div><p className="eyebrow">Vizitor · Szolgáltatások</p><h1 id="service-page-title">{service.h1}<br/><span>{service.accent}</span></h1><p className="service-page-lead">{service.lead}</p><div className="service-page-actions"><a className="button orange" href="/#kapcsolat" onClick={event=>prepareInquiry(event)}>Ajánlatot kérek</a>{category&&<a className="text-link" href="#szolgaltatas-arak">Csomagok és árak</a>}</div></div><div className="service-page-art"><Sculpture kind={service.art}/></div></div>
  </section>
  <div className="service-page-paper"><div className="wrap">
   <section className="service-explanation" aria-labelledby="service-intro"><h2 id="service-intro">{service.intro}</h2><div>{service.paragraphs.map(text=><p key={text}>{text}</p>)}</div></section>
   <section className="service-scope" aria-labelledby="service-scope-title"><h2 id="service-scope-title">{service.scopeTitle}</h2><ul>{service.scope.map(text=><li key={text}><span aria-hidden="true"><Icon name="plus"/></span>{text}</li>)}</ul></section>
   <section className="service-explanation" aria-labelledby="service-detail-title"><h2 id="service-detail-title">{service.detailTitle}</h2><div>{service.details.map(text=><p key={text}>{text}</p>)}</div></section>
   {category&&plans&&<section id="szolgaltatas-arak" className="service-page-pricing" aria-labelledby="service-prices-title"><div className="service-subheading"><p className="eyebrow">Csomagok</p><h2 id="service-prices-title">{category.id==='care'?'WordPress- és WooCommerce-csomagok':service.label+': árak és tartalom'}</h2><p>{category.id==='web'?'Egyszeri tervezési és fejlesztési díjak.':'Havi díjak. Éves előrefizetéssel 20% kedvezmény a szolgáltatási díjból.'}</p></div><div className="service-price-grid">{plans.map(plan=><article className="service-price-card" key={plan.name}><p className="eyebrow">{plan.scope}</p><h3>{plan.name}</h3><p className="service-detail-price"><strong>{money(plan.price)}</strong><span>{category.id==='web'?' Ft-tól':' Ft/hó'}</span></p><p>{plan.description}</p><ul>{plan.features.map(feature=><li key={feature}>{feature}</li>)}</ul>{category.id!=='web'&&<p className="service-annual-price">Éves fizetéssel {money(Math.round(plan.price*.8))} Ft/hó<br/>{money(Math.round(plan.price*.8)*12)} Ft/év, egy összegben</p>}<a className="service-plan-link" href="/#kapcsolat" onClick={event=>prepareInquiry(event,service.label+' / '+plan.name+' · '+money(plan.price)+(category.id==='web'?' Ft-tól':' Ft/hó'))}>Erről kérek ajánlatot</a></article>)}</div><p className="service-price-note">{category.note}</p></section>}
   <section className="service-page-faq" aria-labelledby="service-faq-title"><h2 id="service-faq-title">Amit még érdemes tudnod</h2><div>{service.faq.map(([question,answer])=><details key={question}><summary>{question}<span aria-hidden="true"><Icon name="plus"/></span></summary><p>{answer}</p></details>)}</div></section>
  </div></div>
  <section className="wrap service-next"><div><p className="eyebrow">Beszéljük meg</p><h2>Mire van szükséged?</h2><p>Írd meg röviden. Ha van már weboldalad, a linkjét is elküldheted.</p></div><a className="button orange" href="/#kapcsolat" onClick={event=>prepareInquiry(event)}>Kapcsolatfelvétel</a></section>
 </main>;
}
