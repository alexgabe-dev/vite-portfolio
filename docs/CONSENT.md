# Consent Mode v2 / Vizitor

Saját, első fél által kiszolgált felület, új külső függőség nélkül. Basic consent mode: Google-hálózati kérés sincs az engedélyezés előtt. Azonosító: `G-6XTDE9Y48B`, a tulajdonostól; konfiguráció: `src/consent-config.ts`.

A megadott `GTM-KGN8CMBL` konténer 2026-11-23-án lekért, publikált 7-es verziója CookieYes sablont és Conversion Linkert tartalmazott, GA4-mérőkódot nem. Ezért ezt a konténert nem töltjük be: az új saját banner ütközne a régivel, és egy opcionális szolgáltatás is indulna. A GA4 közvetlenül töltődik be; nincs dupla mérés vagy rejtett noscript-iframe.

## Állapotok és adatkezelés

- Az inline head bootstrap a Google-tag előtt állítja be a `consent default` parancsot. `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`, `personalization_storage`, `functionality_storage`: denied. `security_storage`: granted. Nem tölt be mérőkódot.
- Mentéskor `consent update`, majd kizárólag engedély esetén `gtag.js`, egyszer. Az analitikai engedély nem jelent hirdetési engedélyt. Google Signals és hirdetési személyre szabás kikapcsolva. Nincs Google Ads/Meta/GTM.
- A 180 napos localStorage-bejegyzés döntést, időpontot, verziót és a szolgáltató azonosítóját tartalmazó verziókulcsot tárol. Nincs IP, név, e-mail; nincs távoli consent-logging végpont. Mind az elfogadás, mind az elutasítás azonos ideig érvényes. Lejárat, hibás vagy eltérő verzió esetén alapból tiltás és új választás. Célok/szolgáltatók változásakor a verziót is változtatni kell.
- Visszavonás: `ga-disable-*`, denied update, csak az ismert analitikai sütik törlése az elérhető domain/path változatokon, majd reload a már betöltött könyvtár eltávolításához. Másik lapon történő módosítás szinkronizálódik. Helyi tárhely tiltásakor a döntés az aktuális dokumentumban marad meg; erről külön státuszüzenet szól, a visszavonás ilyenkor is letiltja a GA-t.
- A sütik élettartama legfeljebb 180 nap, nem frissül automatikusan. A GA4-fiók szerveroldali adatmegőrzési beállításai nem érhetők el a repóból; azokat az üzemeltetőnek kell az adatkezelési célhoz igazítania és a tájékoztatóban pontosítania. GA4 adminban a Google Signals/hirdetési funkciók maradjanak kikapcsolva.
- A reklám/analitika alapállapota világszerte tiltás, nem csak régiófüggő. JavaScript nélkül nincs analitika. A külső linkek és a helyi betűkészletek nem igényelnek analitikai engedélyt. Az űrlapot nem kötjük analitikai hozzájáruláshoz.

## Felület

Az első réteg nem blokkolja az oldalt. Az elfogadás/elutasítás egyenlő méretű, megjelenésű és egy kattintás. Nincs előre bekapcsolt analitikai kapcsoló. A lábléc és az adatvédelem oldal újranyitja a natív modális beállításablakot. Escape/bezárás nem ment döntést. A böngésző kezeli a fókuszcsapdát; bezáráskor visszaáll a fókusz. Mobilon a tartalom belül görgethető, a mentés gombjai elérhetők; a reduced motion beállítást tiszteletben tartjuk.

## Ellenőrzés

`npm run build:vercel`, `npm run check:consent`. Böngészőben: törölt tárhely után nincs Google-kérés; elutasítás után újratöltve sincs; elfogadás után egy GA4-loader és granted analytics, minden ads flag denied; visszavonás után nincs loader/süti. Mobilméretek, billentyűzet, Escape, lapváltás és részletek is ellenőrizendők.

A technikai megoldás nem jogi tanúsítvány. A teljes adatkezelési tájékoztató eredeti, 2025-ös fejezetei külön felülvizsgálatot igényelnek. Ebben a változatban a tényleges webes szolgáltatók és sütikezelés fejezeteit frissítettük; nem állítjuk, hogy a teljes üzleti adatkezelést auditáltuk.

## Elsődleges források

- https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic
- https://developers.google.com/tag-platform/security/concepts/consent-mode
- https://www.edpb.europa.eu/system/files/documents/2023-01/edpb_20230118_report_cookie_banner_taskforce_en.pdf
- https://www.naih.hu/suti-tajekoztato
