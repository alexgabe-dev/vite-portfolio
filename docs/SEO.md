# Vizitor — SEO és élesítési ellenőrzés

A frissítés dátuma: 2026. november 21.

## Oldalszerkezet

12 önálló, előrenderelt, canonical URL készült: a főoldal, a projektek, az adatvédelmi oldal és 9 szolgáltatásoldal. A szolgáltatások nem egyetlen általános szöveg másolatai: mindegyik saját bevezetőt, tartalmat, kérdéseket és releváns belső linkeket kapott.

| URL | Fő téma |
| --- | --- |
| `/` | Vizitor, a teljes szolgáltatáskínálat |
| `/weboldalkeszites/` | Weboldal, landing és webshop |
| `/egyedi-webfejlesztes/` | Egyedi alkalmazások és integrációk |
| `/online-marketing/` | Google Ads- és Meta-hirdetéskezelés |
| `/keresooptimalizalas/` | Technikai és on-page SEO |
| `/weboldal-karbantartas/` | Általános web- és rendszerkarbantartás |
| `/ai-chatbot-keszites/` | AI-chatbotok és kapcsolatok |
| `/automatizalas/` | Üzleti folyamatok automatizálása |
| `/email-szerver-uzemeltetes/` | Levelezés, DNS és üzemeltetés |
| `/webanalitika-meres/` | GA4, GTM, Meta Pixel és MarTech |
| `/munkak/` | Valódi projektek és referenciák |
| `/adatvedelem/` | A meglévő adatkezelési tájékoztató |

## Elkészült

- Oldalanként egyedi title, meta description, önmagára mutató canonical és megosztási metaadatok.
- JavaScript nélkül is teljes HTML: egy H1, rendezett H2/H3, árak és kérdések a forrásban.
- Egyértelmű, ékezet nélküli slugok, következetes záró perjellel. A meglévő `/munkak/` és `/adatvedelem/` megmaradt.
- Látható morzsamenü és kapcsolódó szolgáltatások, a láblécből minden szolgáltatás elérhető.
- Organization, WebSite, WebPage/CollectionPage, BreadcrumbList, Service, OfferCatalog és projekt-ItemList strukturált adatok. Nincs kitalált értékelés vagy LocalBusiness-cím.
- Saját 1200×630 pixeles PNG megosztási kép az eredeti Vizitor-logóval, méret- és képleíró metaadatokkal.
- Sitemap csak a canonical oldalakkal; nincs fiktív napi lastmod, priority vagy keresési eredményt ígérő jelölés.
- 404 oldal és 21 állandó átirányítás szabálya a régi navigációs címekhez és záró perjeles URL-ekhez.
- Az aloldalakon megszűnt a nem használt főoldali 3D-kép preloadja. A szolgáltatásoldalak kódja külön, kb. 9,9 KB gzip modulban töltődik.
- A WordPress-csomagok ára nem vonatkozik automatikusan egyedi alkalmazásra vagy e-mail-szerverre; ezekhez felmérés után készül ajánlat.

## Ellenőrzés

`npm run build` — TypeScript, Vite és előrenderelés.

`npm run check:seo` — 12 canonical oldal, egyedi címek/leírások, H1, metaadatok, JSON-LD-hivatkozások, képméret, helyi assetek, belső linkek, 404 és indexelési mód.

`npm run check:http` — futó helyi előnézeten 12 darab 200-as oldal, 21 darab 301-es átirányítás és 2 valódi 404 válasz. A teszt HTML-t kér le, nem függ a kliensoldali rendereléstől.

A nyilvános buildet is ellenőriztük a `VIZITOR_INDEXABLE=true` beállítással. Ezután új privát build készült. A kilenc szolgáltatásoldal 320, 390, 700 és 1280 px szélességen nem futott túl vízszintesen; a böngésző nem jelzett futási hibát.

## Privát előnézet és éles domain

Az előnézet tulajdonosi hozzáférésű. Alapállapotban minden HTML `noindex, follow`, a robots.txt pedig tiltja a feltérképezést. Ezt nem szabad SEO-javítás címén véletlenül feloldani.

A végleges domain `https://vizitor.hu`. Csak az oda történő élesítéshez kell `VIZITOR_INDEXABLE=true` környezettel buildelni, majd `node scripts/check-seo.mjs --indexable` ellenőrzést futtatni. Ekkor a robots.txt engedélyez, a sitemap hivatkozása megjelenik, és nincs általános noindex HTTP-fejléc. A 404 oldal akkor is noindex marad.

A `_redirects` szabályokat a kiszolgáló közvetlenül hajtja végre, nem támaszkodik a tárhely statikus szabályfeldolgozására. A `www.vizitor.hu` és a vizitor.hu HTTP-változata egy lépésben a HTTPS, nem-www címre irányítódik. Az előnézeti domain nem irányít a régi vizitor.hu oldalra. A Search Console domainigazolása és sitemap-beküldése fiókhozzáférést igényel; ez a repóban nem végezhető el.

## A költözés előtt rendezendő

A régi repó sitemapje `/blog` útvonalat is tartalmaz. Az élő blog és a meglévő cikk-URL-ek teljes készletét a domain átállítása előtt fel kell mérni és át kell vinni, vagy cikkenként valódi megfelelőre irányítani. A blogot nem szabad általánosan a főoldalra átirányítani. Ez a változtatás nem állította át a vizitor.hu DNS-ét és nem cserélte le az ott működő blogot.

A régi adatkezelési tájékoztató tartalma arculati frissítést kapott, jogi aktualizálást nem. Az aktuális tárhely, űrlapszolgáltató és később ténylegesen telepített analitika leírását az indulási környezethez kell egyeztetni. A szolgáltatásoldalon felsorolt GA4/GTM/Meta Pixel szolgáltatás nem jelenti ezen mérőkódok automatikus telepítését a Vizitor oldalára.

## Irányelvek

A canonical, a sitemap és a belső linkek ugyanazokat az URL-eket használják a [Google canonical útmutatója](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) szerint. A teljes HTML és az egyedi címek a [JavaScript SEO útmutatót](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) követik. A morzsamenü jelölése a [BreadcrumbList dokumentációjára](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) épül. Üzleti FAQ-szöveghez nem ígérünk FAQ-találati bővítményt; a Google ezt [meghatározott kormányzati és egészségügyi oldalakra korlátozza](https://developers.google.com/search/blog/2023/08/howto-faq-changes).

## Kiszolgálás és átirányítások

A statikus tárhelyen a 404 oldal működött, de a `_redirects` fájl figyelmen kívül maradt. Ezért az előrenderelt React-oldalak kiszolgálása kis méretű Worker-kiszolgálóra került, ugyanazon a Site-on, változatlan hozzáféréssel. A frontend keretrendszere és az oldalak megjelenése megmaradt; nincs kérésenkénti React-renderelés vagy külső adatbázis.

A `worker/router.js` kezeli a 301-es válaszokat, a záró perjelet, az index.html-alakokat, a valódi 404-et és a robots HTTP-fejlécét. A szállítási tömörítést a tárhely köztes rétege kezeli; a Worker nem állít be külön Content-Encoding fejlécet. A tartalomhash alapján ETag/304 és a névben hash-t tartalmazó assetekhez hosszú, immutable gyorsítótár működik. A GET/HEAD támogatott; a tárhely konfigurációs fájljai nem szolgálhatók ki.

`npm run check:worker` külön ellenőrzi a 12 HTML-oldalt, a HEAD-válaszokat, a 21 átirányítást, a query-megőrzést, a hostnormalizálást, a hiányzó oldalak 404-es státuszát és az ETag/304 működését. A nyilvános és a privát builddel is lefutott. A `npm run preview` ugyanazt a kiszolgálási logikát futtatja, amelyet a telepítés tartalmaz.


## Link previews

The current share card is `/og/vizitor-share-2026.png` (1200 × 630 PNG). Its editable SVG source is `public/og/vizitor.svg`; regenerate with `node scripts/build-social-image.mjs`. The original logo paths are embedded unchanged.

Open Graph and Twitter metadata are prerendered on every route. Private preview builds point image URLs to the current Sites preview origin; override with `VIZITOR_PREVIEW_ORIGIN` if that origin changes. With `VIZITOR_INDEXABLE=true`, image URLs use `https://vizitor.hu` alongside the public SEO configuration.

The current owner-private hosting audience prevents unauthenticated social crawlers from reading the page or image. The card can appear in Facebook/Messenger previews after the intended public launch; preparing metadata does not change sharing permissions. Existing platform caches may need a refresh after launch.
