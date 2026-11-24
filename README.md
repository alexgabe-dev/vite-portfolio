# Vizitor

A Vizitor új, reszponzív szolgáltatói weboldala. React 18, TypeScript és Vite, külön betöltött Three.js-grafikákkal. Az eredeti Vizitor-logót és a #ff5c35 márkaszínt használja.

## Fejlesztés

```sh
npm ci
npm run dev
```

## Build és ellenőrzés

```sh
npm run build
npm run check:seo
npm run check:worker
npm run preview
```

A preview a http://127.0.0.1:4173 címen fut. Futó preview mellett az HTTP-ellenőrzés: `npm run check:http`.

A build előrendereli a főoldalt, a projektarchívumot, a kilenc szolgáltatásoldalt, öt önálló navigációs oldalt, az adatvédelmi oldalt és a 404 oldalt. A Worker valódi 301/404 válaszokat, HEAD-kéréseket és ETag-alapú gyorsítótárazást kezel. A telepíthető kimenet: `dist/server/index.js`; a `dist` a statikus HTML-t és asseteket is tartalmazza.

## Tartalom és arculat

- Szolgáltatások: `src/content/services.ts`
- Csomagok és éves kedvezmények: `src/content/packages.ts`
- Referenciák: `src/content/projects.ts`
- Kérdések és válaszok: `src/components/FAQ.tsx`
- Megosztási kép: `public/og/vizitor-share-2026.png` (1200 × 630)
- Szerkeszthető megosztási grafika: `public/og/vizitor.svg`; PNG-generálás: `node scripts/build-social-image.mjs` (Arial rendszerbetűkészletet használ).

Az űrlapban az e-mail-cím és az üzenet kötelező. A Formspree-végpont a korábbi oldal beállítását követi; valódi tesztüzenet nem lett elküldve, a kézbesítés külön ellenőrzendő.

## Telepítés és indexelés

A jelenlegi Sites-próbaoldal privát, és szándékosan `noindex`. A GitHub-forrás feltöltése nem módosítja a domain beállításait. A nyilvános vizitor.hu-ra készülő buildnél `VIZITOR_INDEXABLE=true` engedélyezi a keresőindexelést és a végleges megosztási képcímeket. Másik Sites-próbacím esetén a megosztási képek eredete a `VIZITOR_PREVIEW_ORIGIN` változóval állítható.

A régi blog tartalmának költöztetése külön feladat. Az adatvédelmi tájékoztató webes szolgáltatókról és sütikezelésről szóló fejezetei frissültek; a többi, eredeti üzleti adatkezelési fejezet jogi felülvizsgálata még szükséges.

## Dokumentáció

- [Blog és CMS: architektúra, telepítés, publikálás, mentés](docs/BLOG-CMS.md)
- [SEO és élesítési ellenőrzések](docs/SEO.md)
- [Mobilos UX](docs/MOBILE-UX.md)
- [Lighthouse-eredmények](docs/LIGHTHOUSE.md)
- [Felhasznált külső elemek](THIRD_PARTY_NOTICES.md)

A betűkészlet licence a `public/fonts/OFL.txt` fájlban található.


## Vercel

A `main` az új oldal élesítésre előkészített ága. A korábbi `main` változat a `codex/vizitor-legacy-2026-11-21` ágon maradt meg.

Importáld az `alexgabe-dev/vite-portfolio` repót, a Production Branch legyen `main`, a Root Directory pedig a repó gyökere. A verziókezelt `vercel.json` beállítja a Vite keretrendszert, az `npm ci` telepítést, az `npm run build:vercel` buildet és a `dist` kimenetet. Nincs szükség egyedi SPA catch-all átírásra: mind a 18 oldal saját előrenderelt HTML-t kap, a nem létező útvonalakhoz pedig `404.html` készül.

- `VERCEL_ENV=production` esetén a Vercel-build alapból engedélyezi az indexelést; a canonical és a megosztási kép éles domainje `https://vizitor.hu`.
- Preview buildnél megmarad a `noindex`, a megosztási kép a Vercel által megadott `VERCEL_URL` címre mutat.
- A `VIZITOR_INDEXABLE=true` vagy `false` kifejezetten felülírja ezt a választást. Korábbi projektbeállításból megmaradt `false` érték az éles indexelést is letiltja.
- A `VIZITOR_PREVIEW_ORIGIN` csak explicit előnézeti felülíráshoz kell; korábbi Sites-címet ne hagyj a Vercel-projektben.
- A `vizitor.hu` és `www.vizitor.hu` domaint a Vercel-projektben hozzá kell rendelni; a DNS-t ez a repó nem módosítja.
- Az átirányításokat és cache-fejléceket a Vercel natív konfigurációja kezeli. A Sites Worker továbbra is külön építhető az eredeti `npm run build` paranccsal, de nem része a Vercel statikus kimenetének.

Helyi próba: `npm run build:vercel` (előnézet), vagy `VERCEL_ENV=production npm run build:vercel` (éles beállítás, POSIX parancsértelmezőben). A Vercel-build az előrenderelés után lefuttatja a megfelelő SEO-ellenőrzést is.


## Tiszta navigációs útvonalak

A főmenü és az ajánlatkérés önálló, előrenderelt oldalakat nyit: `/szolgaltatasok/`, `/igy-dolgozom/`, `/arak/`, `/gyakori-kerdesek/`, `/kapcsolat/`. Mindegyik saját H1-et, címet, leírást és canonical URL-t kap. A főoldal továbbra is tartalmazza az áttekintő szekciókat. A csomagválasztás személyes adatok nélkül, egyszer felhasználható sessionStorage-bejegyzéssel jut az ajánlatkérő oldalra.

A korábbi `/csomagok/`, `/rolunk/`, `/folyamat/` és `/kerdesek/` címek 301-gyel az új oldalakra irányítanak. A régi főoldali `#` szakaszlinkeket a kliens az új oldalra vezeti; a Vercel és a Worker a 18 canonical oldalt valóban kiszolgálja.

A hero tartalékképe `public/graphics/signature-clean.webp`, közvetlenül a Three.js-jelenetből készült, felirat vagy mozgáskapcsoló nélkül. A mozgást a látogató rendszerbeállítása és az automatikus láthatóságkezelés vezérli; nincs külön kapcsoló.


## Sütibeállítások és Google Consent Mode v2

Saját, a Vizitor arculatához igazított banner, egyenrangú elfogadással és elutasítással, külön analitikai kapcsolóval és láblécből elérhető visszavonással. A GA4 (`G-6XTDE9Y48B`) kizárólag engedély után töltődik be. A régi CookieYes-es GTM-konténert nem töltjük be. Részletek, működés, megőrzés és ellenőrzés: [docs/CONSENT.md](docs/CONSENT.md).


## Részletes analitika és Clarity

A GA4-üzleti események, a hozzájáruláshoz kötött hőtérképek/visszajátszások, az adatréteg GTM-előkészítése és a még fiókon belül beállítandó riportok dokumentációja: [docs/ANALYTICS.md](docs/ANALYTICS.md). Ellenőrzés: `npm run check:analytics` és `npm run check:consent`.
