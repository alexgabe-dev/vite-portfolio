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

A build előrendereli a főoldalt, a projektarchívumot, a kilenc szolgáltatásoldalt, az adatvédelmi oldalt és a 404 oldalt. A Worker valódi 301/404 válaszokat, HEAD-kéréseket és ETag-alapú gyorsítótárazást kezel. A telepíthető kimenet: `dist/server/index.js`; a `dist` a statikus HTML-t és asseteket is tartalmazza.

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

A régi blog tartalmának költöztetése és az adatvédelmi szöveg jogi frissítése külön élesítési feladat. Az adatvédelmi szöveg az eredeti változatot őrzi; az új szolgáltatókkal összeegyeztetendő.

## Dokumentáció

- [SEO és élesítési ellenőrzések](docs/SEO.md)
- [Mobilos UX](docs/MOBILE-UX.md)
- [Lighthouse-eredmények](docs/LIGHTHOUSE.md)
- [Felhasznált külső elemek](THIRD_PARTY_NOTICES.md)

A betűkészlet licence a `public/fonts/OFL.txt` fájlban található.


## Vercel

A `main` az új oldal élesítésre előkészített ága. A korábbi `main` változat a `codex/vizitor-legacy-2026-11-21` ágon maradt meg.

Importáld az `alexgabe-dev/vite-portfolio` repót, a Production Branch legyen `main`, a Root Directory pedig a repó gyökere. A verziókezelt `vercel.json` beállítja a Vite keretrendszert, az `npm ci` telepítést, az `npm run build:vercel` buildet és a `dist` kimenetet. Nincs szükség egyedi SPA catch-all átírásra: mind a 12 oldal saját előrenderelt HTML-t kap, a nem létező útvonalakhoz pedig `404.html` készül.

- `VERCEL_ENV=production` esetén a Vercel-build alapból engedélyezi az indexelést; a canonical és a megosztási kép éles domainje `https://vizitor.hu`.
- Preview buildnél megmarad a `noindex`, a megosztási kép a Vercel által megadott `VERCEL_URL` címre mutat.
- A `VIZITOR_INDEXABLE=true` vagy `false` kifejezetten felülírja ezt a választást. Korábbi projektbeállításból megmaradt `false` érték az éles indexelést is letiltja.
- A `VIZITOR_PREVIEW_ORIGIN` csak explicit előnézeti felülíráshoz kell; korábbi Sites-címet ne hagyj a Vercel-projektben.
- A `vizitor.hu` és `www.vizitor.hu` domaint a Vercel-projektben hozzá kell rendelni; a DNS-t ez a repó nem módosítja.
- Az átirányításokat és cache-fejléceket a Vercel natív konfigurációja kezeli. A Sites Worker továbbra is külön építhető az eredeti `npm run build` paranccsal, de nem része a Vercel statikus kimenetének.

Helyi próba: `npm run build:vercel` (előnézet), vagy `VERCEL_ENV=production npm run build:vercel` (éles beállítás, POSIX parancsértelmezőben). A Vercel-build az előrenderelés után lefuttatja a megfelelő SEO-ellenőrzést is.
