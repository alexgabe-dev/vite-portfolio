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
