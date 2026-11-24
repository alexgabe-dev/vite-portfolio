type Field = { label: string; value: string; href?: string; wide?: boolean };
type Group = { id: string; title: string; note?: string; fields: Field[] };

const groups: Group[] = [
 { id: 'szolgaltato', title: 'Szolgáltató', fields: [
  { label: 'Név', value: 'Gábor Sándor egyéni vállalkozó' },
  { label: 'Márkanév', value: 'Vizitor' },
  { label: 'Székhely', value: '1136 Budapest, Pannónia utca 14. 4. em. 4.' },
  { label: 'Nyilvántartási szám', value: '60178884' },
  { label: 'Adószám', value: '90834965-1-41' },
  { label: 'Nyilvántartó', value: 'Egyéni vállalkozók nyilvántartása (Belügyminisztérium)' },
  { label: 'E-mail', value: 'info@vizitor.hu', href: 'mailto:info@vizitor.hu' },
  { label: 'Telefon', value: '+36 20 518 0921', href: 'tel:+36205180921' },
 ] },
 { id: 'tarhely', title: 'Tárhely', fields: [
  { label: 'Szolgáltató', value: 'Vercel Inc.' },
  { label: 'Cím', value: '440 N Barranca Avenue #4133, Covina, CA 91723, USA', wide: true },
  { label: 'E-mail', value: 'privacy@vercel.com', href: 'mailto:privacy@vercel.com' },
 ] },
 { id: 'domain', title: 'Domain', note: 'A vizitor.hu domainnevet a Rackhost Zrt. mint regisztrátor tartja nyilván.', fields: [
  { label: 'Regisztrátor', value: 'Rackhost Zrt.' },
  { label: 'Székhely', value: '6722 Szeged, Tisza Lajos körút 41.' },
  { label: 'Cégjegyzékszám', value: '06-10-000489' },
  { label: 'Adószám', value: '25333572-2-06' },
  { label: 'E-mail', value: 'info@rackhost.hu', href: 'mailto:info@rackhost.hu' },
 ] },
 { id: 'jogvita', title: 'Jogvita', note: 'Panasszal először az info@vizitor.hu címen keress. Rendezetlen fogyasztói panasz esetén a békéltető testülethez fordulhatsz.', fields: [
  { label: 'Testület', value: 'Budapesti Békéltető Testület' },
  { label: 'Cím', value: '1016 Budapest, Krisztina krt. 99. I. em. 111.' },
  { label: 'E-mail', value: 'bekelteto.testulet@bkik.hu', href: 'mailto:bekelteto.testulet@bkik.hu' },
  { label: 'Telefon', value: '+36 1 488 2131', href: 'tel:+3614882131' },
 ] },
];

export function Impressum() {
 return <main id="main" className="imprint-page">
  <div className="wrap imprint-wrap">
   <nav className="page-breadcrumb" aria-label="Morzsamenü"><a href="/">Főoldal</a><span aria-hidden="true">/</span><span aria-current="page">Impresszum</span></nav>
   <header className="imprint-head">
    <div><p className="eyebrow"><span className="copper-rule"/>Vizitor · Jogi adatok</p><h1>Impresszum<span>.</span></h1></div>
    <p>A szolgáltató, a tárhely és a domain adatai.<br/><time dateTime="2026-11-24">Frissítve: 2026. november 24.</time></p>
   </header>
   <div className="imprint-sheet">
    {groups.map((group, index) => <section className="imprint-row" key={group.id} aria-labelledby={'imprint-'+group.id}>
     <h2 id={'imprint-'+group.id}><span aria-hidden="true">{String(index+1).padStart(2,'0')}</span>{group.title}</h2>
     <div className="imprint-body">
      <dl>{group.fields.map(field => <div key={field.label} className={field.wide?'is-wide':undefined}><dt>{field.label}</dt><dd>{field.href?<a href={field.href}>{field.value}</a>:field.value}</dd></div>)}</dl>
      {group.note&&<p className="imprint-note">{group.note}</p>}
     </div>
    </section>)}
   </div>
   <footer className="imprint-foot">
    <p>Az oldal szövegei, grafikái és a Vizitor-arculat szerzői jogi védelem alatt állnak; engedély nélkül nem használhatók fel. A referenciák az ügyfelek tulajdonát képezik. Adatkezelés: <a href="/adatvedelem/">adatkezelési tájékoztató</a>.</p>
    <p>Közzététel a 2001. évi CVIII. törvény (Ekertv.) 4. §-a alapján.</p>
   </footer>
  </div>
 </main>;
}
