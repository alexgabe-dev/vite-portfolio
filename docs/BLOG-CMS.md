# Vizitor blog és CMS

Utolsó frissítés: 2026. november 24.

## Architektúra

```
 Szerkesztő ──► cms.vizitor.hu (VPS, Docker Compose)
                 ├─ Payload CMS 3.94 + Next.js 16 (admin + REST/GraphQL API)
                 ├─ PostgreSQL 16 (csak a belső Docker-hálózaton)
                 └─ médiakötet: az eredeti feltöltések
                       │  publikálás után: Vercel Deploy Hook
                       ▼
 Vercel build (npm run build:vercel)
   1. GET cms.vizitor.hu/api/blog-export  — csak publikált tartalom, tokennel
   2. képek letöltése → reszponzív WebP + 1200×630 megosztási kép
   3. Vite céges oldal + előrenderelés (változatlan)
   4. Astro statikus blog → dist/blog/
   5. sitemap-bővítés, SEO-ellenőrzés
                       ▼
 vizitor.hu (Vercel, statikus)   /  … céges oldal   /blog/ … blog
```

- A **céges oldal** (React + Vite) nem töltött be új függőséget. A fő JS-csomag gzippelve 137 bájttal nőtt (Blog link, blogútvonal az analitikában).
- A **blog** egy külön Astro-projekt (`blog/`, saját `package.json`). Előre generált HTML, framework-JavaScript nélkül. Egyetlen 6 KB-os szkriptet tölt be, ez kezeli a menüt és a sütibannert.
- **Látogatáskor a blog nem kér semmit a CMS-től.** A szövegek és képek a Vercel deployment részei, így a CMS kiesése nem érinti a már kiadott cikkeket.
- A **CMS** külön alkalmazás, és külön frissíthető. A Vercel nem tölti fel és nem buildeli (`.vercelignore`), a framework-felismerést pedig a `vercel.json` rögzíti (`vite`).

## Könyvtárak

| Hely | Tartalom |
| --- | --- |
| `cms/` | Payload-alkalmazás, migrációk (`src/migrations`), Dockerfile, `docker-compose.yml`, `deploy/` (telepítés, mentés, Nginx, systemd) |
| `blog/` | Astro-projekt: oldalak, Lexical→HTML renderelő, stílusok, menü- és consent-szkript |
| `scripts/blog/prepare.mjs` | CMS-export lekérése, szigorú ellenőrzése, képfeldolgozás |
| `scripts/blog/assemble.mjs` | Astro build, ütközésmentes összefűzés a `dist/blog/` alá, sitemap |
| `scripts/build-vercel.mjs` | A teljes Vercel-build sorrendje |

## Helyi fejlesztés

```bash
npm ci && npm ci --prefix blog && npm ci --prefix cms
```

A CMS-hez helyi PostgreSQL kell (vagy `cd cms && docker compose up -d db`, ekkor a `DATABASE_URL`-ben a hosztot és a portot ennek megfelelően kell megadni). A `cms/.env` a `.env.example` alapján készül.

```bash
cd cms && npm run migrate && npm run dev        # http://localhost:3010/admin
```

Teljes build helyben, a blog a helyi CMS-ből épül:

```bash
BLOG_CMS_URL=http://127.0.0.1:3010 BLOG_EXPORT_TOKEN=<token> VERCEL_ENV=production npm run build:vercel
```

`BLOG_CMS_URL` nélkül a build kihagyja a blogot. Ilyenkor nem készül `/blog/` útvonal, és a menüben sincs Blog link. Így marad működőképes a deploy, amíg a CMS nincs élesítve.

## Környezeti változók

**Vercel** (Project → Settings → Environment Variables, Production és Preview):

| Név | Érték |
| --- | --- |
| `BLOG_CMS_URL` | `https://cms.vizitor.hu` |
| `BLOG_EXPORT_TOKEN` | ugyanaz a véletlen érték, mint a CMS-ben |

**CMS** (`cms/.env` a szerveren, `chmod 600`). A teljes lista a `cms/.env.example`-ben van:

| Név | Szerep |
| --- | --- |
| `POSTGRES_PASSWORD`, `POSTGRES_USER`, `POSTGRES_DB` | adatbázis |
| `PAYLOAD_SECRET` | munkamenet-titok (`openssl rand -hex 32`) |
| `PAYLOAD_PUBLIC_SERVER_URL` | `https://cms.vizitor.hu` |
| `CMS_PORT` | helyi port a 127.0.0.1-en (alapértelmezés: 3010; szabadnak kell lennie) |
| `VERCEL_DEPLOY_HOOK_URL` | Vercel → Settings → Git → Deploy Hooks, ág: `main` |
| `PUBLIC_SITE_URL` | `https://vizitor.hu` (élesítés visszaigazolásához) |
| `BLOG_EXPORT_TOKEN` | a build ezzel kéri le az exportot |

A titkok csak a szerveren és a Vercel-projekt beállításaiban szerepelnek, a repóban nincsenek.

## Telepítés a VPS-re

Előkészület, egyszer:
1. **Felmérés, csak olvasás:** a saját gépről `ssh alexgabe@pry.hu 'bash -s' < cms/deploy/assess-vps.sh > vps-report.txt`. Ellenőrizd a szabad memóriát (az image buildje kb. 2,3 GB-ot használ), a szabad portot és a meglévő reverse proxyt.
2. **DNS:** `cms.vizitor.hu` A-rekord a VPS IP-címére. A vizitor.hu DNS-e a dns24.hu-nál van; a meglévő, Vercelre mutató rekordokhoz ne nyúlj.
3. **Docker Engine és Compose plugin**, ha még nincs a szerveren.

Telepítés:

```bash
git clone https://github.com/alexgabe-dev/vite-portfolio.git ~/vizitor
```

```bash
cd ~/vizitor/cms && cp .env.example .env && nano .env
```

```bash
./deploy/update.sh
```

Az `update.sh` a következőket csinálja:
- `git pull`;
- frissítés előtt mentést készít;
- újraépíti az image-et;
- újraindítja a CMS-t, és megvárja az egészséges állapotot.

Az adatbázis-migrációk a konténer indulásakor automatikusan lefutnak (Payload `prodMigrations`).

HTTPS a meglévő Nginx mögött:

```bash
sudo cp deploy/nginx-cms.vizitor.hu.conf /etc/nginx/sites-available/cms.vizitor.hu
```

```bash
sudo ln -s /etc/nginx/sites-available/cms.vizitor.hu /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx
```

```bash
sudo certbot --nginx -d cms.vizitor.hu
```

Ha a szerveren nem Nginx, hanem más proxy fut (a felmérés megmutatja), a `127.0.0.1:3010` címre kell továbbítani.

Első belépés: `https://cms.vizitor.hu/admin`. Az első létrehozott fiók automatikusan adminisztrátor lesz.

**Napló és állapot:**

```bash
docker compose logs -f cms
```

```bash
curl -s http://127.0.0.1:3010/api/health
```

A konténerek automatikusan újraindulnak (`restart: unless-stopped`). A naplók forognak: 5 × 10 MB.

## Adatbázis-migrációk

- Sémaváltozás (új mező vagy gyűjtemény) után, fejlesztőgépen: `cd cms && npm run migrate:create -- rovid-nev`. A létrejött fájlt a `src/migrations/` alatt commitold.
- Élesben a migrációk a konténer indulásakor futnak le; a napló `Migrated: <név>` sorai mutatják (`docker compose logs cms | grep Migrat`).
- Éles adatbázison a `push` mód ki van kapcsolva (`PAYLOAD_DB_PUSH` nincs beállítva), a séma csak migrációval változik.

## Tartós tárolás

| Adat | Hol van | Elvész-e konténercserénél |
| --- | --- | --- |
| Adatbázis | `vizitor-cms_pgdata` Docker-kötet | nem |
| Eredeti képek | `vizitor-cms_media` Docker-kötet (`/data/media`) | nem |
| Publikus, optimalizált képek | a Vercel deploymentben (`/blog/media/`) | minden buildnél újra előáll |

A feltöltések nem kerülnek a Git-repóba.

## Mentés és visszaállítás

- **Napi mentés:** `deploy/backup.sh`. Az adatbázis `pg_dump`-pal (custom formátum), a médiatár `tar.gz`-be kerül, ellenőrzőösszeggel.
  - A szkript 14 napi és 8 heti mentést tart meg a `cms/backups/` alatt.
  - Ütemezés systemd időzítővel: `deploy/systemd/` (a fájlok elején az útvonal és a felhasználó módosítandó).
- **Ellenőrzés:** `deploy/verify-backup.sh`. Egy ideiglenes adatbázisba tölti vissza a mentést, összeveti a sorok számát az élő adatbázissal, és ellenőrzi a médiaarchívumot. A systemd szolgáltatás minden mentés után lefuttatja.
- **Visszaállítás:** `deploy/restore.sh backups/daily/<időbélyeg> --yes`. Előtte biztonsági mentést készít a jelenlegi állapotról, majd az adatbázist és a médiát is visszaállítja.
- **Fontos:** a mentés jelenleg ugyanarra a VPS-re készül, ezért **nem véd a szerver elvesztése ellen**. Külső tárhelyhez állítsd be a `BACKUP_RCLONE_REMOTE` változót (pl. Backblaze B2 vagy S3, `rclone config` után). A szkript ekkor minden mentést fel is másol.

A mentés, az ellenőrzés és a visszaállítás helyben Docker Compose-zal ki lett próbálva, szimulált adatvesztéssel: törölt cikk és kép, majd visszaállítás.

## Publikálás → Vercel-build

1. A cikkek, szerzők, kategóriák és képek mentésekor a CMS csak megjelöli, hogy változhatott a publikus tartalom.
2. Kb. 4 másodperc csend után (amikor az adatbázis-tranzakció már biztosan lezárult) egy háttérfolyamat elkészíti ugyanazt a publikus pillanatképet, amit a build is olvas, és összeveti az ujjlenyomatát a legutóbb kiküldöttel.
3. **Csak valódi változás indít buildet.** A piszkozat és az automatikus mentés nem változtat a publikus pillanatképen, ezért nem indít buildet.
4. A build-kérés az **Élesítési napló**ba kerül (Beállítások → Élesítési napló). Hibánál a CMS újrapróbálkozik: 30 mp, 2 perc, 10 perc és 30 perc múlva.
5. A napló állapotai:
   - **„Build elindítva (még nem él)”:** a Vercel dolgozik rajta.
   - **„Élesben”:** a CMS kiolvasta a `vizitor.hu/blog/build-info.json` fájlból, hogy a változás már kint van.
   - **„Nem igazolt”:** 30 perc után sem jelent meg élesben. Ilyenkor nézd meg a Vercel deploymentet.
6. **Kézi újraindítás:** Élesítési napló → Új létrehozása → Mentés.
7. **Hibás build:** ha a CMS nem érhető el, rossz a token, vagy a publikált adat hibás (hiányzó szerző, kép vagy alt szöveg, ütköző slug stb.), a build érthető hibaüzenettel leáll. Üres vagy demótartalmú blog nem kerül ki, a Vercel az előző működő verziót szolgálja ki tovább.

## Szerkesztés, publikálás, visszavonás

1. `cms.vizitor.hu/admin` → **Cikkek** → **Új létrehozása**. A dokumentum azonnal piszkozatként jön létre, és a CMS kétmásodperces szünetek után automatikusan menti.
2. Kitöltendő a cím, a kivonat és a tartalom.
   - A tartalomban `## ` H2-t, `### ` H3-at, `- ` listát, `1. ` számozott listát, `> ` idézetet ad.
   - A `/` menüből szúrható be kép (**Feltöltés**), **Table** és **Code** blokk.
   - Link a kijelölt szövegre a láncikonnal tehető, belső hivatkozás egy másik cikkre is lehet.
3. Oldalsáv:
   - szerző és kategória kötelező;
   - borítókép, publikálási dátum (üresen hagyva automatikusan kitöltődik) és slug (üresen hagyva a címből készül).
4. Opcionális fülek: **Kapcsolatok** (kapcsolódó cikkek, szolgáltatás, források) és **SEO és megosztás**.
5. **Módosítások közzététele:** publikálás, ezután indul a weboldal frissítése. Az állapot az Élesítési naplóban követhető, ez helyben kb. 10 mp, Vercelen pár perc.
6. **Publikált cikk módosítása:** a szerkesztés piszkozatként mentődik, az állapot „Megváltozott”. A publikus oldal mindaddig változatlan, amíg újra rá nem nyomsz a „Módosítások közzététele” gombra.
   - Ha a módosítás érdemi (nem elírásjavítás), jelöld be az **„Ez érdemi tartalmi frissítés”** jelölőt. Ekkor a frissítés dátuma bekerül a cikkbe, a strukturált adatba és a sitemapbe.
7. **Slug módosítása publikálás után:** a régi cím bekerül a „Korábbi címek” közé, és a blog átirányít az újra (lásd lent).
8. **Visszavonás:** a cikk jobb felső **⋮** menüje → **Közzététel visszavonása** → Megerősítés. A következő buildben a cikk eltűnik a listákból, a kategóriákból, a sitemapből és az RSS-ből, a címe pedig 404-et ad.

## Átirányítás slugváltozásnál

A régi címen egy `noindex` oldal marad azonnali `meta refresh` átirányítással és az új címre mutató canonicallal. A Google ezt állandó átirányításként kezeli.

Valódi HTTP 308-hoz a build a Vercel bulk-redirect formátumú fájlt is elkészíti: `.vercel-generated/blog-redirects.json`. Ez Pro csomagon bekapcsolható, ha a `vercel.json`-ba bekerül a `"bulkRedirectsPath": ".vercel-generated/blog-redirects.json"` sor (Hobby csomagon a Vercel ezt nem támogatja).

## SEO és GEO

- **Minden cikkoldal első HTML-válaszában benne van:**
  - a teljes szöveg;
  - egyedi title, meta description és abszolút canonical;
  - Open Graph és Twitter-metaadatok, saját 1200×630-as megosztási kép;
  - BlogPosting és BreadcrumbList a valódi szerzővel, kiadóval és dátumokkal;
  - a forrásoknál `citation`.
- **Sitemap:** a meglévő `/sitemap.xml` bővül a cikkekkel és a legalább 2 cikket tartalmazó kategóriákkal, valódi `lastmod`-dal. A piszkozat, az átirányított cím és a vékony (1 cikkes) kategória nem kerül bele. Az 1 cikkes kategóriaoldal `noindex, follow`.
- **RSS:** `/blog/rss.xml`, a legutóbbi 50 cikkel.
- **Lapozás:** 12 cikk oldalanként, `/blog/oldal/2/`, minden oldalnak önhivatkozó canonicalja van.
- **Ellenőrzés:** az `npm run build:vercel` lefuttatja a `scripts/check-seo.mjs`-t a blogoldalakra is. A buildet leállítja hiányzó metaadat, kettős H1, törött belső link vagy fel nem oldott strukturált adat esetén.

## Analitika és hozzájárulás

A blog ugyanazt a `src/consent.ts` és `src/analytics-observer.ts` kódot használja, mint a céges oldal. Ugyanaz a sütibanner, ugyanaz a tárolt döntés és ugyanaz a GA4-/Clarity-azonosító, új külső szkript nincs. A GA4 oldalmegtekintést oldalanként egyszer küld. A blogoldalak `/blog/...` útvonalként jelennek meg (nem `/404/`-ként), mert a `data-vizitor-section="blog"` jelölés engedélyezi őket.

## A CMS API-ja későbbi integrációkhoz

- **REST:** `https://cms.vizitor.hu/api/<gyűjtemény>`. Gyűjtemények: `posts`, `categories`, `authors`, `media`, `users`, `deploys`. GraphQL: `/api/graphql`.
- **Hitelesítés:**
  - Felhasználónként API-kulcs: Felhasználók → fiók → „Enable API Key”. Fejléc: `Authorization: users API-Key <kulcs>`.
  - Vagy munkamenet: `POST /api/users/login`, majd `Authorization: JWT <token>`.
- **Írás:** létrehozás `POST /api/posts`, módosítás `PATCH /api/posts/<id>`.
  - A `"_status": "draft"` piszkozatot ment, a `"_status": "published"` publikál. A publikálás ugyanúgy elindítja a buildet, mint az adminból.
  - A `content` mező Lexical JSON.
- **Olvasás:** névtelenül csak a publikált tartalom érhető el, a verziók (`/api/posts/versions`) csak bejelentkezve.
- **Kép feltöltése:** `POST /api/media`, multipart, `file` mező és `_payload={"alt":"..."}`.
- **Publikus pillanatkép:** `GET /api/blog-export` (`Authorization: Bearer <BLOG_EXPORT_TOKEN>`). Ez a build bemenete.
