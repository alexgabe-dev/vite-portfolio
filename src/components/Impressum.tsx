type Row = { label: string; value: string; href?: string };
type Block = { id: string; eyebrow: string; title: string; note?: string; rows: Row[]; links?: { href: string; label: string }[] };

const blocks: Block[] = [
 { id: 'szolgaltato', eyebrow: 'A weboldal üzemeltetője', title: 'Szolgáltató', rows: [
  { label: 'Név', value: 'Gábor Sándor egyéni vállalkozó' },
  { label: 'Márkanév', value: 'Vizitor' },
  { label: 'Székhely', value: '1136 Budapest, Pannónia utca 14. 4. em. 4.' },
  { label: 'Nyilvántartási szám', value: '60178884' },
  { label: 'Nyilvántartó', value: 'Egyéni vállalkozók nyilvántartása (Belügyminisztérium)' },
  { label: 'Adószám', value: '90834965-1-41' },
 ] },
 { id: 'elerhetoseg', eyebrow: 'Közvetlen kapcsolat', title: 'Elérhetőség', rows: [
  { label: 'E-mail', value: 'info@vizitor.hu', href: 'mailto:info@vizitor.hu' },
  { label: 'Telefon', value: '+36 20 518 0921', href: 'tel:+36205180921' },
  { label: 'Weboldal', value: 'vizitor.hu', href: 'https://vizitor.hu/' },
  { label: 'Ajánlatkérés', value: 'vizitor.hu/kapcsolat', href: '/kapcsolat/' },
 ] },
 { id: 'tarhely', eyebrow: 'Ahol az oldal fut', title: 'Tárhelyszolgáltató', rows: [
  { label: 'Név', value: 'Vercel Inc.' },
  { label: 'Cím', value: '440 N Barranca Avenue #4133, Covina, CA 91723, Amerikai Egyesült Államok' },
  { label: 'E-mail', value: 'privacy@vercel.com', href: 'mailto:privacy@vercel.com' },
  { label: 'Weboldal', value: 'vercel.com', href: 'https://vercel.com/' },
 ] },
 { id: 'domain', eyebrow: 'A vizitor.hu domain', title: 'Domainregisztrátor', note: 'A vizitor.hu domainnevet a Rackhost Zrt. mint regisztrátor tartja nyilván.', rows: [
  { label: 'Név', value: 'Rackhost Zrt.' },
  { label: 'Székhely', value: '6722 Szeged, Tisza Lajos körút 41.' },
  { label: 'Cégjegyzékszám', value: '06-10-000489 (Szegedi Törvényszék Cégbírósága)' },
  { label: 'Adószám', value: '25333572-2-06' },
  { label: 'E-mail', value: 'info@rackhost.hu', href: 'mailto:info@rackhost.hu' },
  { label: 'Weboldal', value: 'rackhost.hu', href: 'https://www.rackhost.hu/' },
 ] },
 { id: 'jogvita', eyebrow: 'Fogyasztói jogviták', title: 'Békéltető testület', note: 'Fogyasztói panasz esetén először írj az info@vizitor.hu címre. Ha a panaszt nem sikerül rendezni, a székhely szerint illetékes békéltető testülethez fordulhatsz.', rows: [
  { label: 'Név', value: 'Budapesti Békéltető Testület' },
  { label: 'Cím', value: '1016 Budapest, Krisztina körút 99. I. em. 111.' },
  { label: 'Levelezési cím', value: '1253 Budapest, Pf. 10.' },
  { label: 'E-mail', value: 'bekelteto.testulet@bkik.hu', href: 'mailto:bekelteto.testulet@bkik.hu' },
  { label: 'Telefon', value: '+36 1 488 2131', href: 'tel:+3614882131' },
  { label: 'Weboldal', value: 'bekeltet.bkik.hu', href: 'https://bekeltet.bkik.hu/' },
 ] },
];

function isExternal(href: string) { return /^https?:/.test(href) && !href.startsWith('https://vizitor.hu'); }

export function Impressum() {
 return <main id="main" className="privacy-page imprint-page">
  <section className="privacy-hero wrap" aria-labelledby="imprint-title">
   <nav className="page-breadcrumb" aria-label="Morzsamenü"><a href="/">Főoldal</a><span aria-hidden="true">/</span><span aria-current="page">Impresszum</span></nav>
   <div className="privacy-hero-grid"><div><p className="eyebrow"><span className="copper-rule"/>Vizitor · Jogi adatok</p><h1 id="imprint-title">Impresszum.<br/><span>Ki áll az oldal mögött.</span></h1><p className="privacy-lead">A szolgáltató, a tárhely és a domain adatai egy helyen, az elektronikus kereskedelmi szolgáltatásokról szóló törvény szerint.</p></div>
    <div className="privacy-emblem" aria-hidden="true"><svg viewBox="0 0 280 280" fill="none"><circle cx="140" cy="140" r="113" stroke="currentColor" opacity=".12"/><circle cx="140" cy="140" r="86" stroke="currentColor" opacity=".12" strokeDasharray="2 8"/><rect x="88" y="62" width="104" height="146" rx="8" fill="#ff5c35" fillOpacity=".06" stroke="#ff5c35" strokeWidth="1.2"/><path d="M106 94h68M106 114h68M106 134h44" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.2" strokeLinecap="round"/><circle cx="168" cy="184" r="22" fill="#0c0e11" stroke="#ff5c35" strokeWidth="1.2"/><path d="m158 184 7 7 13-14" stroke="#ff5c35" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
   </div>
   <div className="privacy-meta"><span>Utolsó frissítés <time dateTime="2026-11-24">2026. november 24.</time></span><a href="mailto:info@vizitor.hu">Kérdésed van? info@vizitor.hu</a></div>
  </section>
  <div className="privacy-paper"><div className="wrap imprint-layout">
   <div className="imprint-grid">
    {blocks.map((block, index) => <section className={'imprint-card imprint-'+block.id} key={block.id} aria-labelledby={'imprint-'+block.id+'-title'}>
     <header><span className="imprint-index" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><p className="eyebrow">{block.eyebrow}</p><h2 id={'imprint-'+block.id+'-title'}>{block.title}</h2></header>
     {block.note&&<p className="imprint-note">{block.note}</p>}
     <dl>{block.rows.map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.href?<a href={row.href} {...(isExternal(row.href)?{target:'_blank',rel:'noopener noreferrer'}:{})}>{row.value}{isExternal(row.href)&&<span className="sr-only"> (új lapon)</span>}</a>:row.value}</dd></div>)}</dl>
    </section>)}
    <section className="imprint-card imprint-copyright" aria-labelledby="imprint-copyright-title">
     <header><span className="imprint-index" aria-hidden="true">06</span><p className="eyebrow">Szellemi tulajdon</p><h2 id="imprint-copyright-title">Szerzői jog</h2></header>
     <p className="imprint-note">A vizitor.hu szövegei, grafikái, a Vizitor-logó és az oldal arculata szerzői jogi védelem alatt állnak. Előzetes írásos engedély nélkül nem másolhatók és nem használhatók fel, kivéve a jogszabály által megengedett eseteket, például a forrás megjelölésével történő idézést. A referenciák között bemutatott weboldalak az ügyfelek tulajdonát képezik.</p>
     <p className="imprint-note">A személyes adatok kezeléséről az <a href="/adatvedelem/">adatkezelési tájékoztatóban</a> olvashatsz.</p>
    </section>
   </div>
   <p className="imprint-legal">Az adatok közzététele az elektronikus kereskedelmi szolgáltatások, valamint az információs társadalommal összefüggő szolgáltatások egyes kérdéseiről szóló 2001. évi CVIII. törvény 4. §-a alapján történik.</p>
  </div></div>
 </main>;
}
