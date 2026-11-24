import { openConsentSettings } from '../consent';
import { useEffect, useState } from 'react';

const chapters = [["alapelvek", "Alapelvek"], ["adatkezelo", "Az adatkezelő"], ["adatkezelesek", "Kezelt adatok"], ["adatfeldolgozok", "Adatfeldolgozók"], ["sutik", "Sütik"], ["jogaid", "Az érintett jogai"], ["adatbiztonsag", "Adatbiztonság"], ["jogorvoslat", "Jogorvoslat"], ["jogszabalyok", "Jogszabályok"], ["modositasok", "Módosítások"], ["zaro-rendelkezesek", "Záró rendelkezések"], ["kapcsolat", "Kapcsolat"]];
export function Privacy() {
 const [active,setActive] = useState('alapelvek');
 useEffect(()=>{
  const visible=new Set<Element>();
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target);});
   const current=Array.from(visible).sort((a,b)=>b.getBoundingClientRect().top-a.getBoundingClientRect().top)[0];
   if(current)setActive(current.id.replace('privacy-',''));
  },{rootMargin:'-100px 0px -55% 0px',threshold:0});
  document.querySelectorAll('.privacy-section').forEach(section=>observer.observe(section));
  return()=>observer.disconnect();
 },[]);
 function selectChapter(id:string){
  const target=document.getElementById('privacy-'+id);if(!target)return;

  target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  target.focus({preventScroll:true});
 }
 return <main id="main" className="privacy-page">
  <section className="privacy-hero wrap" aria-labelledby="privacy-title">
   <nav className="page-breadcrumb" aria-label="Morzsamenü"><a href="/">Főoldal</a><span aria-hidden="true">/</span><span aria-current="page">Adatvédelem</span></nav>
   <div className="privacy-hero-grid"><div><p className="eyebrow"><span className="copper-rule"/>Vizitor · Adatvédelem</p><h1 id="privacy-title">Adatkezelési<br/><span>tájékoztató.</span></h1><p className="privacy-lead">Milyen adatokat kezelek, miért van rájuk szükség,<br className="privacy-desktop-break"/> és milyen jogaid vannak? Itt megtalálod a részleteket.</p></div>
   <div className="privacy-emblem" aria-hidden="true"><svg viewBox="0 0 280 280" fill="none"><circle cx="140" cy="140" r="113" stroke="currentColor" opacity=".12"/><circle cx="140" cy="140" r="86" stroke="currentColor" opacity=".12" strokeDasharray="2 8"/><path d="m140 47 70 30v62c0 42-46 74-70 89-24-15-70-47-70-89V77Z" fill="#ff5c35" fillOpacity=".06" stroke="#ff5c35" strokeWidth="1.2"/><path d="m140 69 51 22v48c0 28-28 53-51 68-23-15-51-40-51-68V91Z" fill="#ff5c35" fillOpacity=".08"/><rect x="117" y="126" width="46" height="40" rx="6" stroke="#ff5c35" strokeWidth="1.6"/><path d="M126 126v-12a14 14 0 0 1 28 0v12m-14 16v9" stroke="#ff5c35" strokeWidth="1.6" strokeLinecap="round"/><path d="M33 60v14m-7-7h14m194 140v14m-7-7h14" stroke="currentColor" opacity=".35"/></svg></div></div>
   <div className="privacy-meta"><span>Utolsó tartalmi frissítés <time dateTime="2026-11-23">2026. november 23.</time></span><a href="mailto:info@vizitor.hu">Adatvédelemmel kapcsolatos kérdésed van?</a></div>
  </section>
  <div className="privacy-paper"><div className="wrap privacy-layout">
   <aside className="privacy-sidebar" aria-label="A tájékoztató fejezetei"><nav className="privacy-toc" aria-label="Tartalomjegyzék"><p className="eyebrow">A tájékoztatóban</p>{chapters.map(([id,label])=><a key={id} href={'#privacy-'+id} aria-current={active===id?'location':undefined}>{label}<span aria-hidden="true">·</span></a>)}<a className="privacy-toc-top" href="#top">Az oldal tetejére</a></nav>
    <div className="privacy-mobile-jump"><label htmlFor="privacy-chapter">Ugrás a témához</label><select id="privacy-chapter" value={active} onChange={event=>selectChapter(event.target.value)}>{chapters.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></div>
   </aside>
   <article className="privacy-document" aria-label="Adatkezelési tájékoztató"><p className="privacy-document-intro">
              Ez a tájékoztató részletesen ismerteti, hogy <span>Gábor Sándor</span> egyéni vállalkozó, (továbbiakban: az "Adatkezelő") miként végzi az egyes szolgáltatásaihoz kapcsolódó adatkezelést. Tájékoztatjuk Önt, mint a <span>vizitor.hu</span> honlap látogatóját és szolgáltatásaink potenciális igénybevevőjét az adatkezelés céljairól, módjáról, a technikai és szervezési intézkedésekről, az érintettek jogairól, valamint a panaszkezelés és jogorvoslati lehetőségek részleteiről.
            </p>
<section className="privacy-section" id="privacy-alapelvek" tabIndex={-1}>
            <h2>
              1. Alapelvek és általános rendelkezések
            </h2>
            <p>
              Az Adatkezelő a személyes adatok kezelésénél az alábbi alapelveket követi:
            </p>
            <ul>
              <li>
                <div>
                  <strong>Jogszerűség és tisztességes kezelés:</strong>
                  <span> Csak olyan személyes adatokat gyűjtünk, melyek kezelésének jogalapja fennáll (pl. hozzájárulás, szerződéses kötelezettség, jogszabályi előírás vagy jogos érdek).</span>
                </div>
              </li>
              <li>
                <div>
                  <strong>Célhoz kötöttség:</strong>
                  <span> Az adatokat kizárólag az itt meghatározott célokra használjuk.</span>
                </div>
              </li>
              <li>
                <div>
                  <strong>Adatminimalizálás:</strong>
                  <span> Csak a szolgáltatások ellátásához szükséges, releváns adatokat gyűjtünk.</span>
                </div>
              </li>
              <li>
                <div>
                  <strong>Pontosság és frissesség:</strong>
                  <span> Törekszünk az adatok pontosságára, rendszeresen ellenőrizzük és szükség esetén helyesbítjük azokat.</span>
                </div>
              </li>
              <li>
                <div>
                  <strong>Biztonság:</strong>
                  <span> Megfelelő technikai és szervezési intézkedésekkel védjük az adatokat a jogosulatlan hozzáférés, megsemmisítés, módosítás vagy egyéb jogellenes kezelés ellen.</span>
                </div>
              </li>
              <li>
                <div>
                  <strong>Átláthatóság:</strong>
                  <span> Minden érintett számára biztosítjuk a tájékoztatást az adatkezelés menetéről és az érintettek jogainak érvényesítéséhez szükséges elérhetőségekről.</span>
                </div>
              </li>
            </ul>
          
</section>
<section className="privacy-section" id="privacy-adatkezelo" tabIndex={-1}>
            <h2>
              2. Vállalkozás adatai és az adatkezelő
            </h2>
            <ul>
              <li>
                <div>
                  <strong>Egyéni vállalkozó neve:</strong>
                  <span> Gábor Sándor (az "Adatkezelő")</span>
                </div>
              </li>
              <li><div><strong>Nyilvántartási szám:</strong><span> 60178884</span></div></li>
              <li><div><strong>Adószám:</strong><span> 90834965-1-41</span></div></li>
              <li>
                <div>
                  <strong>Székhely:</strong>
                  <span> Magyarország, 1136 Budapest, Pannónia utca 14. (4. emelet, ajtó: 4)</span>
                </div>
              </li>
              <li>
                <div>
                  <strong>Elérhetőségi e-mail:</strong>
                  <span> info@vizitor.hu</span>
                </div>
              </li>
              <li>
                <div>
                  <strong>Domain:</strong>
                  <span> vizitor.hu</span>
                </div>
              </li>
            </ul>
            <p>
              <strong>Adatkezelő – felelős tevékenységek:</strong>
              <span> Gábor Sándor (e.v.) felelős az összes tevékenységért, amelyet a fenti adatok alapján végzünk.</span>
            </p>
          
</section>
<section className="privacy-section" id="privacy-adatkezelesek" tabIndex={-1}>
            <h2>
              3. Adatkezelés céljai, kezelt adatok és megőrzési időtartamok
            </h2>
            <div>
              <h3>
                3.1. Honlap látogatása
              </h3>
              <div>
                <div>
                  <h4>Gyűjtött adatok:</h4>
                  <ul>
                    <li>IP cím</li>
                    <li>Böngésző- és eszközspecifikus adatok</li>
                    <li>Sütik (cookie-k) és egyéb technikai azonosítók</li>
                  </ul>
                </div>
                <div>
                  <h4>Cél:</h4>
                  <ul>
                    <li>A weboldal zavartalan működésének biztosítása</li>
                    <li>Statisztikai elemzések, látogatottsági adatok gyűjtése</li>
                    <li>Biztonsági okokból történő naplózás</li>
                  </ul>
                </div>
                <div>
                  <h4>Megőrzés:</h4>
                  <ul>
                    <li>Általában a szükséges ideig, jellemzően legfeljebb 1 évig (jogszerű előírások esetén hosszabb időtartam is előfordulhat).</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3>
                3.2. Regisztráció
              </h3>
              <div>
                <div>
                  <h4>Gyűjtött adatok:</h4>
                  <ul>
                    <li>Név</li>
                    <li>E-mail cím</li>
                    <li>Telefonszám</li>
                    <li>Esetlegesen születési dátum és egyéb, a szolgáltatás specifikus adatok</li>
                  </ul>
                </div>
                <div>
                  <h4>Cél:</h4>
                  <ul>
                    <li>Felhasználói fiók létrehozása, azonosítása és karbantartása</li>
                    <li>Kapcsolattartás, jelszó visszaállítás, valamint a szolgáltatás zavartalan nyújtása</li>
                  </ul>
                </div>
                <div>
                  <h4>Megőrzés:</h4>
                  <ul>
                    <li>Az ügyfélkapcsolat fennállásáig, illetve a jogszabályban előírt időtartamok szerint (általában 5–10 év a könyvelési, számlázási kötelezettségek miatt).</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3>
                3.3. Hírlevélküldés
              </h3>
              <div>
                <div>
                  <h4>Gyűjtött adatok:</h4>
                  <ul>
                    <li>E-mail cím</li>
                    <li>Amennyiben rendelkezésre áll, név</li>
                  </ul>
                </div>
                <div>
                  <h4>Cél:</h4>
                  <ul>
                    <li>Promóciós és tájékoztató jellegű hírlevelek, marketing anyagok küldése</li>
                  </ul>
                </div>
                <div>
                  <h4>Megőrzés:</h4>
                  <ul>
                    <li>Az előfizetés aktív státuszáig; visszavonás esetén az adatok törlésre kerülnek, legfeljebb 10 évig, ha jogszabály előírja.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3>
                3.4. Ügyfélszolgálat
              </h3>
              <div>
                <div>
                  <h4>Gyűjtött adatok:</h4>
                  <ul>
                    <li>Név</li>
                    <li>E-mail cím</li>
                    <li>Telefonszám</li>
                    <li>IP cím</li>
                    <li>Az üzenet tartalma (pl. panasz, kérdés)</li>
                  </ul>
                </div>
                <div>
                  <h4>Cél:</h4>
                  <ul>
                    <li>Ügyfélszolgálati megkeresések kezelése, problémák megoldása, reklamációk, garanciális igények esetén a jogi kötelezettségek teljesítése</li>
                  </ul>
                </div>
                <div>
                  <h4>Megőrzés:</h4>
                  <ul>
                    <li>Az ügyintézéshez szükséges ideig, majd 3 évig a reklamációs időszakok betartása érdekében.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3>
                3.5. Nyereményjátékok
              </h3>
              <div>
                <div>
                  <h4>Gyűjtött adatok:</h4>
                  <ul>
                    <li>Név</li>
                    <li>E-mail cím</li>
                    <li>Telefonszám</li>
                    <li>Postai cím</li>
                    <li>Esetlegesen születési dátum</li>
                  </ul>
                </div>
                <div>
                  <h4>Cél:</h4>
                  <ul>
                    <li>Nyereményjátékok lebonyolítása, részvétel ellenőrzése, eredmények értesítése, nyeremények kiszállítása</li>
                  </ul>
                </div>
                <div>
                  <h4>Megőrzés:</h4>
                  <ul>
                    <li>A nyereményjáték lezárását követően általában 1 évig, a jogviták rendezéséig.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3>
                3.6. Marketing és Social Media Marketing
              </h3>
              <div>
                <div>
                  <h4>Gyűjtött adatok:</h4>
                  <ul>
                    <li>E-mail cím</li>
                    <li>Név</li>
                    <li>IP cím</li>
                    <li>Esetleges demográfiai adatok és böngészési szokások</li>
                  </ul>
                </div>
                <div>
                  <h4>Cél:</h4>
                  <ul>
                    <li>Célzott reklámkampányok és promóciós tevékenységek lebonyolítása, a felhasználói élmény és kommunikáció optimalizálása</li>
                  </ul>
                </div>
                <div>
                  <h4>Megőrzés:</h4>
                  <ul>
                    <li>Az adatkezelési hozzájárulás aktív státuszáig, illetve a jogszabály által előírt maximális időtartamig (legfeljebb 10 év).</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3>
                3.7. Weboldalkészítés és Webfejlesztés
              </h3>
              <div>
                <div>
                  <h4>Gyűjtött adatok:</h4>
                  <ul>
                    <li>Név</li>
                    <li>E-mail cím</li>
                    <li>Telefonszám</li>
                    <li>Céges adatok (pl. cég neve, adószám)</li>
                    <li>Szerződéses adatok</li>
                    <li>IP cím</li>
                  </ul>
                </div>
                <div>
                  <h4>Cél:</h4>
                  <ul>
                    <li>Weboldalak és egyéb digitális megoldások tervezése, fejlesztése és üzemeltetése</li>
                    <li>Projektmenedzsment és ügyfélkapcsolatok fenntartása</li>
                  </ul>
                </div>
                <div>
                  <h4>Megőrzés:</h4>
                  <ul>
                    <li>A projekt lezárásától számított 5 évig, a szerződéses és jogi kötelezettségek teljesítéséhez szükséges ideig.</li>
                  </ul>
                </div>
              </div>
            </div>
          
</section>
<section className="privacy-section" id="privacy-adatfeldolgozok" tabIndex={-1}>
 <h2>4. A weboldalon igénybe vett szolgáltatók</h2>
 <ul><li><strong>Vercel Inc.</strong> – a weboldal tárhelye és kiszolgálása. A technikai működéshez kapcsolódó hálózati adatokhoz és naplóadatokhoz férhet hozzá. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Adatvédelmi tájékoztató (új lapon)</a>.</li>
 <li><strong>Resend (Plus Five Five, Inc.)</strong> – a kapcsolatfelvételi üzenet e-mailes továbbítása és az automatikus visszaigazolás kézbesítése. Az elküldött névhez (ha megadod), e-mail-címhez, üzenethez, választott szolgáltatáshoz és csomaghoz, valamint a kézbesítés technikai adataihoz férhet hozzá. Csak az űrlap elküldésekor használjuk; a levél nem hírlevél, és nem tartalmaz megnyitás- vagy kattintáskövetést. <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Adatvédelmi tájékoztató (új lapon)</a>.</li>
 <li><strong>Google Ireland Limited</strong> – hozzájárulás esetén látogatottságmérés, az 5. fejezetben részletezettek szerint.</li><li><strong>Microsoft Corporation</strong> – külön hozzájárulás esetén Clarity hőtérképek és munkamenet-visszajátszások, az 5. fejezet szerint. <a href="https://privacy.microsoft.com/hu-hu/privacystatement" target="_blank" rel="noopener noreferrer">Adatvédelmi nyilatkozat (új lapon)</a>.</li></ul>
 <p>A szolgáltatók az EGT-n kívül is kezelhetnek adatokat. Az adattovábbítás kereteit és garanciáit a hivatkozott szolgáltatói tájékoztatók és az adatfeldolgozási feltételek ismertetik. A kapcsolatfelvételhez szükséges adatkezelés és az opcionális analitika egymástól független; az űrlap analitikai hozzájárulás nélkül is használható.</p>
</section>
<section className="privacy-section" id="privacy-sutik" tabIndex={-1}>
 <h2>5. Sütik és böngészőtárhely</h2>
 <p>A böngészőben tárolt információk közül az alapvető működéshez szükségeseket hozzájárulás nélkül használjuk. A látogatottságmérés és a használat visszajátszása kizárólag az előzetes, önkéntes, célonként külön megadható hozzájárulásoddal indul el (GDPR 6. cikk (1) a) pont). Az elutasítás nem korlátozza az oldal használatát. A görgetés vagy a további böngészés nem jelent hozzájárulást.</p>
 <h3>5.1. Alapvető működés</h3>
 <ul><li><strong>vizitor.consent.v1</strong> – a saját domain helyi tárhelyén (localStorage) tárolt döntés, időpont és tájékoztatóverzió. Legfeljebb 180 napig érvényes, elfogadás és elutasítás esetén egyaránt. Nem tartalmaz nevet vagy e-mail-címet; nem küldjük analitikai szolgáltatónak.</li>
 <li><strong>vizitor.inquiry-selection</strong> – a kiválasztott szolgáltatás vagy csomag továbbvitele az ajánlatkérő oldalra. Saját munkamenet-tárhely (sessionStorage), egyszeri felhasználás után töröljük; 15 perc után nem használjuk fel.</li>
 <li><strong>vizitor.package-category</strong> – a kiválasztott csomagkategória továbbvitele az ároldalra. Saját munkamenet-tárhely, egyszeri felhasználás után töröljük. A munkamenet-tárhely a munkamenet végén törlődik.</li></ul>
 <h3>5.2. Google Analytics 4 – csak engedéllyel</h3>
 <p>Szolgáltató: Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Írország). A GA4 a látogatottságot és az oldal használatát méri: oldalletöltések, kampányforrások, szolgáltatás- és csomagválasztások, fizetési gyakoriság, GYIK-megnyitások, kártyalapozás, kapcsolatfelvételi kattintások, űrlapkezdés és mezőkitöltés ténye, ellenőrzési és küldési hibatípusok, valamint sikeres ajánlatkérések. Mérjük a görgetési mélységet, az aktív időt, az oldal sebességi mutatóit (LCP, INP, CLS, FCP, TTFB), technikai hibatípusokat, továbbá a szokásos böngésző-, eszköz- és hozzávetőleges földrajzi adatokat. A részletes webes eseményekhez csak előre meghatározott, személyes tartalmat nem tartalmazó paramétereket küldünk; a webcímekből a nem engedélyezett lekérdezési paramétereket és töredékeket eltávolítjuk. A böngésző a hozzájárulás után közvetlenül kapcsolódik a Google szervereihez. Az ajánlatkérőben megadott nevet, e-mail-címet és üzenetet nem továbbítjuk a GA4 felé.</p>
 <p>A <strong>_ga</strong> és <strong>_ga_*</strong> sütik látogatói és munkamenet-azonosítókat tárolhatnak, legfeljebb 180 napig, automatikus élettartam-hosszabbítás nélkül. Ez a böngészőben tárolt sütik ideje; a Google szerveroldali eseményadat-megőrzését a GA4-fiók külön beállítása határozza meg. A Google az EGT-n kívül, így az Egyesült Államokban is kezelhet adatokat; az alkalmazott adattovábbítási garanciákat a Google tájékoztatói ismertetik.</p>
 <p><a href="https://policies.google.com/privacy?hl=hu" target="_blank" rel="noopener noreferrer">A Google adatvédelmi tájékoztatója (új lapon)</a> · <a href="https://policies.google.com/privacy/frameworks?hl=hu" target="_blank" rel="noopener noreferrer">Nemzetközi adattovábbítás (új lapon)</a></p>
 <h3>5.3. Microsoft Clarity – külön engedéllyel</h3>
 <p>A Microsoft Corporation (One Microsoft Way, Redmond, WA 98052, USA) Clarity szolgáltatásával kattintási és görgetési hőtérképeket, illetve a weboldal használatát bemutató munkamenet-visszajátszásokat készítünk. Céljuk a nehezen használható felületek és az elakadási pontok felismerése. A rögzítés az engedélyezés után indul; nincs korábbi viselkedés visszamenőleges rögzítése. A szolgáltatás kezelhet látogatói és munkamenet-azonosítót, megtekintett oldalt, hivatkozó oldalt, kattintást, görgetést, egérmozgást, eszköz- és böngészőadatokat.</p>
 <p>A teljes űrlapkártya és a sikeres elküldés visszaigazolása maszkolt; az ott megjelenő nevet, e-mailt és üzenetet nem engedjük a felvételbe. Nem küldünk saját felhasználói azonosítót a Claritynek. Ismeretlen útvonalon vagy nem engedélyezett URL-paraméterek mellett nem töltjük be. Hirdetési adattovábbításhoz nem adunk engedélyt (<code>ad_Storage: denied</code>).</p>
 <p>Saját sütik: <strong>_clck</strong> (látogatóazonosító, legfeljebb 1 év) és <strong>_clsk</strong> (munkamenet-összekapcsolás, legfeljebb 1 nap). A hozzájárulást ettől függetlenül 180 nap után megújítjuk, visszavonáskor a saját domainről elérhető Clarity-sütiket töröljük. A Microsoft szolgáltatása további, saját domainjeihez tartozó technikai azonosítókat is használhat; ezeket böngészőből nem tudjuk más domainen törölni.</p>
 <p>A visszajátszási adatok rendszerint 30 napig érhetők el. Kiválasztott minták, kedvencek és címkézett munkamenetek, valamint hőtérképek és összesített kattintási adatok legfeljebb 9 hónapig maradhatnak meg. Az adatok az EGT-n kívül, így az USA-ban is feldolgozhatók. Részletek: <a href="https://privacy.microsoft.com/hu-hu/privacystatement" target="_blank" rel="noopener noreferrer">Microsoft adatvédelem (új lapon)</a> és <a href="https://learn.microsoft.com/en-us/clarity/data-retention" target="_blank" rel="noopener noreferrer">Clarity adatmegőrzés (új lapon)</a>.</p>
 <h3>5.4. Hirdetési követés és Consent Mode v2</h3>
 <p>Az oldal nem tölt be Google Ads- vagy Meta Pixel-követőt. A Google Signals és a hirdetési személyre szabás kikapcsolva marad. A Google Consent Mode v2 alapváltozatát használjuk: a Google mérőkódja a hozzájárulásig nem töltődik be, így elutasításkor sütimentes mérési jelzést sem küldünk a Google felé. Az analitikai, hirdetési tárolási, hirdetési adatküldési és személyre szabási engedélyek alapállapota tiltott.</p>
 <h3>5.5. Módosítás és visszavonás</h3>
 <p>A lábléc „Sütibeállítások” gombjával vagy az alábbi gombbal bármikor módosíthatod a döntésedet, illetve az „Elutasítom” gombbal visszavonhatod a hozzájárulásodat. Visszavonáskor leállítjuk az érintett mérést vagy visszajátszást, eltávolítjuk az elérhető saját analitikai és Clarity-sütiket, és újratöltjük az oldalt, hogy a már futó mérőkód se maradjon aktív. A visszavonás nem érinti a korábbi adatkezelés jogszerűségét. Az átálláskor a korábbi CookieYes-beállítást és az elérhető régi hirdetési azonosítókat (például <code>cookieyes-consent</code>, <code>_gcl_au</code>, <code>_fbp</code>, <code>_fbc</code>) is töröljük; ezeket az új rendszer nem használja.</p>
 <p>180 nap után vagy a célok, szolgáltatók változásakor új döntést kérünk. Ha a böngésződ tiltja a helyi tárhelyet, a döntés csak az aktuális oldalon érvényes; új megnyitáskor ismét megjelenik a banner. JavaScript nélkül nem töltődik be az analitika.</p>
 <button type="button" className="privacy-consent-button" onClick={openConsentSettings}>Sütibeállítások megnyitása ↗</button>
 <p><small>A sütikezelésről szóló fejezet frissítve: 2026. november 23.</small></p>
</section>
<section className="privacy-section" id="privacy-jogaid" tabIndex={-1}>
            <h2>
              6. Az érintettek jogai és a kérelmek kezelése
            </h2>
            <div>
              <p>Az Adatkezelő elkötelezett az érintettek jogainak biztosítása mellett. Az alábbi jogokkal élhet:</p>
              <ul>
                <li>
                  <div>
                    <strong>Hozzáférési jog:</strong>
                    <span> Kérelmezheti, hogy milyen személyes adatokat tárolunk Önről.</span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Helyesbítési jog:</strong>
                    <span> Kérelmezheti a pontatlan vagy hiányos adatok javítását, módosítását, kiegészítését.</span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Törlési jog („elfeledtetéshez való jog”):</strong>
                    <span> Igény esetén kérheti személyes adatainak törlését, illetve zárolását (kivéve a jogszabály által előírt kötelező adatkezelés esetén).</span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Zárolási/korlátozási jog:</strong>
                    <span> Kérelmezheti az adatok ideiglenes feldolgozásának korlátozását.</span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Tiltakozási jog:</strong>
                    <span> Bármikor tiltakozhat az adatok egyes, például marketing célú feldolgozása ellen.</span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Adathordozhatósági jog:</strong>
                    <span> Kérelmezheti, hogy az adatokat strukturált, géppel olvasható formátumban átadjuk egy másik adatkezelő részére.</span>
                  </div>
                </li>
              </ul>
              <p>
                A kérelmeket írásban (pl. e-mailben vagy online űrlapon) várjuk, dedikált adatvédelmi munkatársunk kezeli azokat, és általában 30 napon belül válaszolunk, szükség esetén a határidőt írásban meghosszabbítva.
              </p>
            </div>
          
</section>
<section className="privacy-section" id="privacy-adatbiztonsag" tabIndex={-1}>
            <h2>
              7. További adatkezelési eljárások és biztonsági intézkedések
            </h2>
            <div>
              <div>
                <h3>
                  7.1. Adatvédelmi incidens kezelése
                </h3>
                <ul>
                  <li>
                    <strong>Azonnali reagálás:</strong> Incidens észlelésekor azonnal aktiváljuk belső protokolljainkat.
                  </li>
                  <li>
                    <strong>Dokumentáció és kivizsgálás:</strong> Részletesen dokumentáljuk az incidens okait, majd meghatározzuk a helyreállítási lépéseket.
                  </li>
                  <li>
                    <strong>Értesítési kötelezettség:</strong> Személyes adatok érintése esetén a GDPR előírásainak megfelelően (72 órán belül) értesítjük az illetékes hatóságot és az érintetteket.
                  </li>
                  <li>
                    <strong>Folyamatos fejlesztés:</strong> Rendszeresen frissítjük és teszteljük incidenskezelési eljárásainkat.
                  </li>
                </ul>
              </div>
              <div>
                <h3>
                  7.2. Technikai és szervezési biztonsági intézkedések
                </h3>
                <ul>
                  <li>
                    <strong>Titkosítás:</strong> Az adatátvitel során TLS protokollt, illetve tároláskor korszerű titkosítási algoritmusokat alkalmazunk.
                  </li>
                  <li>
                    <strong>Jelszóvédelem és autentikáció:</strong> Erős jelszókövetelmények és kétfaktoros autentikáció biztosítja a fiókok védelmét.
                  </li>
                  <li>
                    <strong>Vírusirtó és behatolás-megelőző rendszerek:</strong> Frissített vírusirtó szoftvereket, tűzfalakat és egyéb biztonsági megoldásokat használunk.
                  </li>
                  <li>
                    <strong>Fizikai védelem:</strong> A szerverekhez és irodai létesítményekhez való hozzáférés szigorúan korlátozott, beléptető rendszerek és zárt helyiségek révén.
                  </li>
                  <li>
                    <strong>Biztonsági mentések:</strong> Rendszeres adatmentésekkel biztosítjuk az adatok helyreállíthatóságát incidens esetén.
                  </li>
                </ul>
              </div>
              <div>
                <h3>
                  7.3. Adatok harmadik félnek történő továbbítása
                </h3>
                <ul>
                  <li>
                    <strong>Szerződéses feltételek:</strong> Az adatok harmadik félnek történő továbbítása kizárólag szigorú szerződéses garanciák mellett történik.
                  </li>
                  <li>
                    <strong>Adatvédelmi megfelelés:</strong> Biztosítjuk, hogy a harmadik felek is megfeleljenek a vonatkozó adatvédelmi előírásoknak, beleértve az EU-n kívüli továbbítás esetében alkalmazott standard szerződéses klauzulákat.
                  </li>
                  <li>
                    <strong>Célhoz kötöttség:</strong> Az adatok továbbítása kizárólag a szolgáltatásnyújtáshoz és a kapcsolódó üzleti folyamatokhoz szükséges mértékben történik.
                  </li>
                </ul>
              </div>
            </div>
          
</section>
<section className="privacy-section" id="privacy-jogorvoslat" tabIndex={-1}>
            <h2>
              8. Az Ön jogai és jogorvoslati lehetőségei
            </h2>
            <div>
              <p>Ön az adatkezelésről:</p>
              <ul>
                <li>
                  <div>Tájékoztatást kérhet,</div>
                </li>
                <li>
                  <div>Kérheti az általunk kezelt személyes adataik helyesbítését, módosítását, kiegészítését,</div>
                </li>
                <li>
                  <div>Tiltakozhat az adatkezelés ellen, és kérheti adatai törlését, valamint zárolását (a kötelező adatkezelés kivételével),</div>
                </li>
                <li>
                  <div>Bíróság előtt jogorvoslattal élhet,</div>
                </li>
                <li>
                  <div>Felügyelő hatóságnál panaszt tehet, illetve eljárást kezdeményezhet (További információ a panaszügyintézés rendjéről).</div>
                </li>
              </ul>
              <p>
                <strong>Felügyelő Hatóság:</strong> Nemzeti Adatvédelmi és Információszabadság Hatóság
              </p>
              <ul>
                <li>
                  <div><strong>Székhely:</strong> 1125 Budapest, Szilágyi Erzsébet fasor 22/c.</div>
                </li>
                <li>
                  <div><strong>Levelezési cím:</strong> 1530 Budapest, Pf.: 5.</div>
                </li>
                <li>
                  <div><strong>Telefon:</strong> +36 (1) 391-1400</div>
                </li>
                <li>
                  <div><strong>Fax:</strong> +36 (1) 391-1410</div>
                </li>
                <li>
                  <div><strong>E-mail:</strong> ugyfelszolgalat@naih.hu</div>
                </li>
                <li>
                  <div><strong>Honlap:</strong> https://naih.hu/</div>
                </li>
              </ul>
              <p>
                Az Ön kérelmére tájékoztatást adunk az általunk kezelt, illetve az általunk – vagy megbízott adatfeldolgozónk által – feldolgozott:
              </p>
              <ul>
                <li>Adatairól,</li>
                <li>Azok forrásáról,</li>
                <li>Az adatkezelés céljáról és jogalapjáról,</li>
                <li>Az adatok megőrzési időtartamáról (vagy ezen időtartam meghatározásának szempontjairól),</li>
                <li>Az adatfeldolgozóink nevéről, címéről és az adatkezeléssel összefüggő tevékenységükről,</li>
                <li>Az adatvédelmi incidensek körülményeiről, hatásairól, valamint az elhárításukra és megelőzésükre tett intézkedéseinkről,</li>
                <li>Az Ön személyes adatainak továbbítása esetén az adattovábbítás jogalapjáról és címzettjéről.</li>
              </ul>
              <p>
                A kérelem benyújtásától számított 15 napon belül (legfeljebb 1 hónapon belül) adjuk meg tájékoztatásunkat. A tájékoztatás ingyenes, kivéve, ha az adott évben azonos adatkörre vonatkozóan már benyújtott tájékoztatási kérelmet. Amennyiben Ön már megfizetett költségtérítést, azt visszatérítjük, ha az adatokat jogellenesen kezeltük, vagy a tájékoztatás kérése helyesbítéshez vezetett. A tájékoztatást csak törvényben foglalt esetekben tagadhatjuk meg, a jogszabályban meghatározott feltételek mellett, valamint a bírósági jogorvoslat, illetve a felügyelő hatósághoz fordulás lehetőségéről tájékoztatva.
              </p>
              <p>
                Az Adatkezelő a személyes adatok helyesbítéséről, zárolásáról, megjelöléséről és törléséről értesíti Önt, valamint mindazokat, akiknek korábban az adatot az adatkezelés céljára továbbította – kivéve, ha az értesítés elmaradása az Ön jogos érdekeit nem sérti.
              </p>
              <p>
                Amennyiben az Ön helyesbítési, zárolási vagy törlési kérelmét nem teljesítjük, a kérelmétől számított 15 napon belül (legfeljebb 1 hónapon belül) írásban vagy az Ön hozzájárulásával – elektronikus úton közljük elutasításunk indokait, és tájékoztatjuk Önt a bírósági jogorvoslat, illetve a felügyelő hatósághoz fordulás lehetőségéről.
              </p>
              <p>
                Amennyiben Ön tiltakozik a személyes adatai kezelése ellen, a tiltakozást a kérelmétől számított 15 napon belül (legfeljebb 1 hónapon belül) megvizsgáljuk, és döntésünkről írásban tájékoztatjuk Önt. Ha úgy döntünk, hogy az Ön tiltakozása megalapozott, az esetben az adatkezelést – beleértve a további adatfelvételt és adattovábbítást – megszüntetjük, az adatokat zároljuk, és a tiltakozásról, valamint az azzal összefüggő intézkedésekről értesítjük mindazokat, akiknek korábban az érintett személyes adatot továbbítottuk, illetve akik kötelesek intézkedni a tiltakozási jog érvényesítése érdekében.
              </p>
              <p>
                Abban az esetben megtagadjuk a kérés teljesítését, ha bizonyítjuk, hogy az adatkezelést olyan kényszerítő erejű jogos okok indokolják, amelyek elsőbbséget élveznek az Ön érdekeivel, jogaival és szabadságaival szemben, vagy amelyek jogi igények előterjesztéséhez, érvényesítéséhez vagy védelméhez kapcsolódnak. Amennyiben Ön a döntésünkkel nem ért egyet, illetve, ha elmulasztjuk a határidőt, a döntés közlésétől, illetve a határidő utolsó napjától számított 30 napon belül Ön bírósághoz fordulhat.
              </p>
              <p>
                Az adatvédelmi perek elbírálása a törvénysék hatáskörébe tartozik, a per – az érintett választása szerint – az érintett lakóhelye vagy tartózkodási helye szerinti törvénysék előtt is megindítható. Külföldi állampolgár esetén a lakóhelye szerint illetékes felügyelő hatósághoz is fordulhat panasszal.
              </p>
            </div>
          
</section>
<section className="privacy-section" id="privacy-jogszabalyok" tabIndex={-1}>
            <h2>
              9. Irányadó jogszabályok és előírások
            </h2>
            <div>
              <p>Az adatkezelés során az alábbi jogszabályokat vesszük figyelembe:</p>
              <ul>
                <li>
                  <div>
                    <strong>GDPR (EU 2016/679):</strong>
                    <span> Az Európai Unió általános adatvédelmi rendelete, amely az adatkezelés alapelveit, érintetti jogokat és biztonsági előírásokat szabályozza.</span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>2011. évi CXII. törvény:</strong>
                    <span> Az információs önrendelkezési jogról és az információszabadságról szóló törvény, amely biztosítja az érintettek adatainak kezelésében az információs önrendelkezési jog érvényesülését.</span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Elektronikus hírközlésről szóló törvény (Eker tv.):</strong>
                    <span> Szabályozza az elektronikus kommunikáció során alkalmazott sütik és technikai azonosítók kezelését.</span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Polgári Törvénykönyv és fogyasztóvédelmi előírások:</strong>
                    <span> Az adatkezeléssel kapcsolatos felelősségi kérdések, szerződéses viszonyok és kártérítési szabályok tekintetében.</span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Speciális biztonsági előírások:</strong>
                    <span> A számítógépes rendszerek és adatvédelmi intézkedésekre vonatkozó egyéb releváns szabályozások.</span>
                  </div>
                </li>
              </ul>
            </div>
          
</section>
<section className="privacy-section" id="privacy-modositasok" tabIndex={-1}>
            <h2>
              10. Az adatkezelési tájékoztató módosítása
            </h2>
            <div>
              <p>
                Az Adatkezelő fenntartja a jogot a jelen adatkezelési tájékoztató módosítására. Az esetleges változásokról a vizitor.hu weboldalon keresztül értesítjük az érintetteket, hogy az adatkezelés minden szempontból naprakész és a vonatkozó jogszabályoknak megfelelő legyen.
              </p>
            </div>
          
</section>
<section className="privacy-section" id="privacy-zaro-rendelkezesek" tabIndex={-1}>
            <h2>
              11. Záró rendelkezések
            </h2>
            <div>
              <p>
                Gábor Sándor, mint egyéni vállalkozó, elkötelezett amellett, hogy a személyes adatokat a legszigorúbb biztonsági előírásoknak megfelelően kezelje. Munkatársaink és az adatkezelési eljárásaink folyamatosan figyelik a jogszabályi változásokat, és szükség esetén frissítik a folyamatokat, biztosítva ezzel a felhasználók jogainak maximális védelmét.
              </p>
            </div>
          
</section>
<section className="privacy-section" id="privacy-kapcsolat" tabIndex={-1}>
            <h2>
              12. Kapcsolat és további tájékoztatás
            </h2>
            <div>
              <p>
                Az adatkezeléssel kapcsolatos kérdéseivel Ön az <strong>info@vizitor.hu</strong> e-mail címen, illetve postacímen kérhet további tájékoztatást. Kérjük, vegye fel velünk a kapcsolatot, és válaszunkat 15 napon belül (legfeljebb 1 hónapon belül) megküldjük az Ön által megadott elérhetőségre.
              </p>
            </div>
          
</section>
   <p className="privacy-original-date">Ez a tájékoztató 2025.02.25-én került véglegesítésre, és hatályos mindaddig, amíg azt újabb módosítás nem váltja fel.</p>
   <div className="privacy-document-end"><span>Adatkezeléssel kapcsolatos kérdések</span><a href="mailto:info@vizitor.hu">info@vizitor.hu</a><a className="privacy-end-top" href="#top">Vissza az elejére</a></div>
   </article>
  </div></div>
 </main>;
}
