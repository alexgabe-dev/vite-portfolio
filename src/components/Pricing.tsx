import { Icon } from './Icon';
import { SwipeDeck } from './SwipeDeck';
import { useRef, useState } from 'react';

import { categories, type PackageCategory } from '../content/packages';
export type { PackageCategory } from '../content/packages';
type Category = PackageCategory;
const money = (value: number) => new Intl.NumberFormat('hu-HU').format(value);
function PackageArt({ category, tier }: { category: Category; tier: number }) {
  return <svg className={'package-art art-'+category+' art-tier-'+tier} viewBox="0 0 160 112" fill="none" aria-hidden="true">
    {category === 'web' ? <><path d="m20 49 69-31 54 27-68 34z" fill="currentColor" opacity=".07"/><path d="m20 59 55 29 68-31M20 69l55 29 68-31" stroke="currentColor" opacity=".22"/><path d="m20 49 69-31 54 27-68 34z" stroke="currentColor" strokeWidth="1.2"/><path d="m33 49 54-24 39 19-54 25z" fill="#ff5c35" opacity={.35+tier*.25}/><path d="m40 47 28 14m-17-19 28 14" stroke="currentColor" opacity=".55"/>{tier>0&&<path d="m104 31 14-6 17 8-14 7z" fill="#ff5c35"/>}{tier>1&&<path d="m110 70 16-7 14 7-16 8z" fill="#ff5c35"/>}</> : category==='marketing' ? <><ellipse cx="78" cy="60" rx="61" ry="27" transform="rotate(-24 78 60)" stroke="currentColor" opacity=".25"/><ellipse cx="78" cy="60" rx="43" ry="19" transform="rotate(-24 78 60)" stroke="currentColor" opacity=".5"/><path d="m44 79 24-18 20 6 31-35" stroke="#ff5c35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="m108 33 13-4-2 14" stroke="#ff5c35" strokeWidth="2" strokeLinecap="round"/><circle cx="44" cy="79" r="4" fill="#ff5c35"/><circle cx="88" cy="67" r="4" fill="#ff5c35"/>{tier>0&&<circle cx="124" cy="78" r="7" stroke="currentColor" opacity=".4"/>}{tier>1&&<path d="M27 27v12m-6-6h12" stroke="currentColor" opacity=".4"/>}</> : <><path d="m80 14 41 18v30c0 20-27 34-41 40-14-6-41-20-41-40V32z" stroke="currentColor" opacity=".3"/><path d="m80 25 30 13v24c0 13-19 25-30 30-11-5-30-17-30-30V38z" fill="currentColor" opacity=".06"/><path d="m65 57 10 10 21-24" stroke="#ff5c35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>{tier>0&&<path d="M29 49v25m102-25v25" stroke="currentColor" opacity=".35"/>}{tier>1&&<path d="M20 55v13m120-13v13" stroke="#ff5c35" opacity=".65"/>}</>}
  </svg>;
}
export function Pricing({ onRequest, category, onCategoryChange: setCategory, standalone=false }: { standalone?:boolean; onRequest: (service: string, plan: string) => void; category: Category; onCategoryChange: (category: Category) => void }) {
  const Heading=standalone?'h1':'h2';
  const Subheading=standalone?'h2':'h3';
  const [annual, setAnnual] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  return <section className="packages-section section" id="csomagok" aria-labelledby="pricing-title"><div className="wrap">
    <div className="packages-heading"><div><p className="eyebrow">Csomagok és árak</p><Heading id="pricing-title">Tudd, mivel számolj.</Heading></div><p>Weboldal egyszeri díjjal.<br/>Marketing és karbantartás havi együttműködésben.</p></div>
    <div className="package-navigation" role="tablist" aria-label="Szolgáltatáscsomagok">{categories.map((item,index)=><button key={item.id} ref={el=>{tabs.current[index]=el;}} type="button" role="tab" id={'package-tab-'+item.id} aria-selected={category===item.id} aria-controls={'package-panel-'+item.id} tabIndex={category===item.id?0:-1} onClick={()=>setCategory(item.id)} onKeyDown={event=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?2:(index+(event.key==='ArrowRight'?1:2))%3;setCategory(categories[next].id);tabs.current[next]?.focus();}}}><span className="package-tab-number" aria-hidden="true">0{index+1}</span>{item.label}<span className="package-tab-arrow" aria-hidden="true"><Icon name="arrow-up-right"/></span></button>)}</div>
    {categories.map(selected=>{const subscription=selected.id!=='web';const discounted=subscription&&annual;return <div key={selected.id} className="package-panel" id={'package-panel-'+selected.id} role="tabpanel" aria-labelledby={'package-tab-'+selected.id} hidden={category!==selected.id}>
      <div className="package-toolbar"><p>{selected.description}</p>{subscription?<div className="billing-choice" role="group" aria-label="Fizetési gyakoriság"><span className={'billing-slider'+(annual?' is-annual':'')} aria-hidden="true"/><button type="button" aria-pressed={!annual} onClick={()=>setAnnual(false)}>Havonta</button><button type="button" aria-pressed={annual} onClick={()=>setAnnual(true)}>Évente <span>−20%</span></button></div>:<span className="one-time-label"><i aria-hidden="true"/>Egyszeri projekt, egyszeri díj</span>}</div>
      <SwipeDeck className="package-grid" label={selected.label+' csomagok'} resetKey={category}>{selected.plans.map((plan,index)=>{const monthly=discounted?Math.round(plan.price*.8):plan.price;const label=selected.label+' / '+plan.name+(subscription?' · '+(annual?'éves fizetés':'havi fizetés'):'');return <article className={'package-card'+(index===1?' package-card-featured':'')} key={plan.name}>
        <div className="package-card-top"><p>{plan.scope}</p><PackageArt category={selected.id} tier={index}/></div>
        <Subheading>{plan.name}</Subheading>
        <div className="package-price-block"><div className="package-price" key={monthly}><strong>{money(monthly)}</strong><span>Ft{subscription?'/hó':'-tól'}</span></div><p className="package-payment-note">{subscription?(annual?<><s>{money(plan.price)} Ft/hó</s><span>Éves fizetéssel</span></>:'Havonta fizetve, éves elköteleződés nélkül'):'Egyszeri tervezési és fejlesztési díj'}</p>
        <div className="package-annual-detail">{subscription&&annual?<><span>{money(monthly*12)} Ft / év, egy összegben</span><b>Évente {money((plan.price-monthly)*12)} Ft megtakarítás</b></>:subscription?<span>Éves fizetéssel {money(Math.round(plan.price*.8))} Ft/hó</span>:<span>A pontos díjat indulás előtt rögzítjük.</span>}</div></div>
        <a className="package-cta" href="/kapcsolat/" aria-label={selected.label+' – '+plan.name+' csomagról kérek ajánlatot'} onClick={()=>onRequest(selected.service,label+' · '+money(monthly)+(subscription?' Ft/hó'+(annual?' · '+money(monthly*12)+' Ft/év':''):' Ft-tól'))}>Erről beszéljünk<span aria-hidden="true"><Icon name="arrow-up-right"/></span></a>
        <div className="package-includes"><ul aria-label="A csomag tartalma">{plan.features.map(feature=><li key={feature}><span aria-hidden="true"><Icon name="check"/></span>{feature}</li>)}</ul></div>
      </article>})}</SwipeDeck>
      <div className="package-footnotes"><p>{selected.note}</p><p>{subscription?'Éves előfizetésnél 12 hónap díja előre fizetendő, 20% kedvezménnyel. A kedvezmény a szolgáltatási díjra vonatkozik.':'Az összegek induló árak, a megadott tartalomra. A végleges ajánlatot a feladat egyeztetése után kapod meg.'}</p></div>
    </div>})}
    <a className="package-custom" href="/kapcsolat/" onClick={()=>onRequest('Más','Egyedi összeállítás')}><span>Másra van szükséged? <b>Kérj egyedi ajánlatot.</b></span><span aria-hidden="true"><Icon name="arrow-up-right"/></span></a>
  </div></section>;
}
