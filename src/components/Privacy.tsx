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
   <div className="privacy-meta"><span>A tájékoztató dátuma <time dateTime="2025-02-25">2025. február 25.</time></span><a href="mailto:info@vizitor.hu">Adatvédelemmel kapcsolatos kérdésed van?</a></div>
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
            <h2>
              4. Adatfeldolgozók és harmadik fél szolgáltatók
            </h2>
            <div>
              <p>Az adatkezelési műveletek során az alábbi adatfeldolgozókat és harmadik fél szolgáltatókat vesszük igénybe:</p>
              <ul>
                <li>
                  <div>
                    <strong>Tárhelyszolgáltatók:</strong>
                    <span> Rackhost Informatikai Zártkörűen Működő Részvénytársaság, Székhely: 6722 Szeged, Tisza Lajos körút 41., Honlap: www.rackhost.hu, E-mail: info@rackhost.hu.</span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Analitikai szolgáltatók:</strong>
                    <span> A weboldal használatának elemzéséhez és a felhasználói élmény javításához.</span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Marketing szolgáltatók:</strong>
                    <span> Hirdetések megjelenítéséhez és célzott marketing tevékenységekhez.</span>
                  </div>
                </li>
              </ul>
            </div>
          
</section>
<section className="privacy-section" id="privacy-sutik" tabIndex={-1}>
            <h2>
              5. Sütik (Cookie-k) és technikai azonosítók
            </h2>
            <div>
              <h3>
                  5.1. A weboldal megfelelő működéséhez elengedhetetlen sütik
                </h3>
              <ul>
                <li>
                  <div>
                    <strong>Munkamenet sütik:</strong>
                    <span> A weboldal alapvető funkcióinak biztosításához szükségesek.</span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Biztonsági sütik:</strong>
                    <span> A felhasználói fiók védelmét szolgálják.</span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Teljesítmény sütik:</strong>
                    <span> A weboldal teljesítményének méréséhez és javításához használatosak.</span>
                  </div>
                </li>
              </ul>
              <div>
                <h3>
                  5.2. Sütik kezelése és felhasználói lehetőségek
                </h3>
                <p>
                  <strong>Cookie banner:</strong> Az első látogatáskor megjelenő áttekinthető cookie banner tájékoztatja a látogatót a sütik típusairól és céljairól, valamint lehetőséget biztosít az összes sütik elfogadására vagy a nem létfontosságú sütik (analitikai, marketing) elutasítására.
                </p>
                <p>
                  <strong>Részletes beállítások:</strong> A cookie banner egy részletes adatkezelési tájékoztatóhoz vezet, ahol a látogatók módosíthatják sütik beállításaikat, illetve a böngésző beállításaiban is módosíthatják a sütik kezelését.
                </p>
              </div>
            </div>
          
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
