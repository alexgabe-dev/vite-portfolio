# Vizitor mérési terv

## Bekötött szolgáltatók

- GA4: `G-6XTDE9Y48B`. Saját, hozzájárulás után induló `gtag.js`. Consent Mode v2 basic. Hirdetési engedélyek és Google Signals kikapcsolva.
- Microsoft Clarity: `zi62e7q2g4`, egyetlen betöltő. Külön „Hőtérkép és visszajátszás” engedély, `consentv2` API: `analytics_Storage: granted`, `ad_Storage: denied`. Elutasítva nincs mérőkód, cookieless felvétel sem.
- GTM: `GTM-KGN8CMBL` későbbi integrációhoz. A publikált konténerben CookieYes + Conversion Linker szerepel, ezért jelenleg NEM töltjük be. A mostani megoldás nem módosítja a GTM-fiókot. Előbb a régi CMP és a nem szükséges marketingcímkék eltávolítása/consent-ellenőrzése kell.
- Meta Pixel / Google Ads: nincs megadott azonosító és konverziós címke, ezért nincs bekötve vagy kitalált ID.

## Események

| Esemény | Mit jelent |
| --- | --- |
| page_view + GA4 alapmérés | Oldalak, kampányforrás, eszköz, böngésző, hozzávetőleges hely. Egy config, nincs külön duplázott page_view. |
| section_view | Szekciócím legalább 600 ms-ig látható, egyszer dokumentumonként. |
| package_view / package_select | Valóban látható csomag, illetve konkrét ajánlatkérés. Kategória, nyilvános csomagazonosító, meghirdetett díj, fizetési gyakoriság. A meghirdetett ár nem bevétel. |
| package_category / billing_change | Árfül és havi/éves váltás, csak állapotváltásnál. |
| service_select / navigation_click / inquiry_open | Szolgáltatás, navigáció és kapcsolatfelvételi CTA, elhelyezés szerint. |
| contact_click / external_link | E-mail, telefon, sikeres címmásolás és nyilvános külső domainek. Mailto-tartalom nélkül. |
| faq_open / faq_topic / process_step / card_swipe / project_filter | Tartalmi interakciók és mobilkártyák. |
| inquiry_start / inquiry_field_complete / inquiry_interest | Valódi begépelés, kitöltött mező ténye, választott nyilvános szolgáltatáskategória. Nem mezőértékek. |
| inquiry_validation / inquiry_submit / inquiry_error | Ellenőrzési hibatípus, érvényes küldési kísérlet, HTTP/kapcsolódási hiba. |
| generate_lead | Csak szerveroldali Resend-elfogadás és HTTP-siker + `ok: true` válasz után. Nincs fiktív monetáris érték. |
| inquiry_exit | Elkezdett, de visszaigazolt lead nélkül elhagyott oldal. Nem bizonyítja, hogy egy folyamatban lévő szerverkérés végleg sikertelen lett. |
| scroll_depth | 25/50/75/90/100%, küszöbönként egyszer. |
| engagement_milestone / visit_summary | 15/30/60/120 aktív másodperc, elhagyáskori aktív idő és mélység. Rejtett lap és 30 mp inaktivitás nem növeli az aktív időt. |
| web_vital | Hivatalos `web-vitals` 6.2.3: LCP, INP, CLS, FCP, TTFB. Érték/delta/minősítés/metrikaazonosító, DOM-attribúció nélkül. |
| site_error / page_not_found | Korlátozott hibatípusok és 404, nyers hibaüzenet, stack és kért privát útvonal nélkül. |

A Clarity a hőtérképek/visszajátszások mellett `generate_lead`, `inquiry_submit`, `package_select`, `contact_click` smart eventet kap külön felvételi hozzájárulás esetén. Nincs egyedi user ID, `identify` API vagy e-mailes felhasználó-összekapcsolás.

## Adatvédelem és teljesítmény

A `track()` minden hívásnál ellenőrzi az aktuális, le nem járt hozzájárulást. Nincs előzetes eseménypuffer vagy elutasítási viselkedés gyűjtése. Egy engedélyezett eseményhez csak az adott séma engedélyezett paraméterei kerülnek. Név, e-mail, üzenet, FormData, DOM-elem, hibaszöveg, stack és szabad szöveges csomagkérés nem eseményparaméter.

A saját GA4-konfiguráció és események csak canonical útvonalat, öt korlátozott kampányparamétert és referrer-origint kapnak. Az ismeretlen URL-ek `/404/` névre kerülnek. A Clarity saját maga olvassa a böngésző URL-jét, ezért ismeretlen útvonalon, töredék, nem engedélyezett query vagy nem biztonságos referrer esetén egyáltalán nem töltjük be.

A teljes `.inquiry-card` szerveroldaltól `data-clarity-mask="true"`, beleértve a sikeres visszaigazolást. A levélküldési hiba alternatívája gomb; a felhasználó kitöltött szövege nem kerül megfigyelhető `<a href>` attribútumba. Clarityben tilos ezt a kártyát unmask-szabállyal felülírni.

A részletes megfigyelők + web-vitals külön, körülbelül 5,4 KB gzip chunkként csak analitikai engedély után töltődnek be. Delegált eseménykezelők, passzív görgetés, egy rAF/scroll és 5 másodperces időzítő. Nincs plusz render, állandó 60 FPS-es mérőhurok vagy belépést blokkoló külső mérőkód. Clarity is csak külön engedély után, async indul; hatása készülék és hálózat szerint eltérhet.

## GA4 kezelőfelületen befejezendő beállítások

A repo nem rendelkezik GA4 admin-hozzáféréssel. Az alábbiak külön, a mérési fiókban állíthatók:

1. `generate_lead` megjelölése key eventként; az automatikus `form_submit` ne számítson sikeres ajánlatkérésnek.
2. Egyéni eseményszintű dimenziók: `section_id`, `location`, `service_id`, `package_id`, `package_category`, `billing_period`, `method`, `form_id`, `field_id`, `error_type`, `question_id`, `topic_id`, `deck_id`, `metric_name`, `metric_rating`.
3. Numerikus metrikák: `listed_price`, `metric_value`, `metric_delta`, `seconds`, `percent`. A Web Vitals eloszlásokhoz BigQuery-export / külön riport kell; ezek nem lesznek automatikusan GA4 alapriportok.
4. Enhanced Measurement automatikus formmérésének kikapcsolása javasolt, ha ugyanazt a tölcsért nézed; a saját `inquiry_*` események és `generate_lead` a megbízható üzleti események. A fiókban aktív automatikus Google-eseményekre nincs adminvezérlésünk a repóból.
5. Adatmegőrzés, belső forgalom szűrése, adatredakció és Google Ads-linkelés ellenőrzése. A szerveroldali megőrzési beállítást a tájékoztatóban pontosítani kell.

Clarityben: Consent Mode bekapcsolva (EEA esetén alapértelmezett), hirdetési adattovábbítás kikapcsolva, maszkolás ellenőrizve. Dashboard-hozzáférés nélkül a felvételek portálbeli megjelenését nem tudjuk igazolni.

## GTM-adatszerződés

Minden saját GA4-eseményhez egyetlen, csak engedély után létrejövő adatréteg-esemény:

```js
{ event: 'vizitor_analytics', vizitor_event: 'package_select', vizitor_params: { /* csak tisztított, engedélyezett paraméterek */ } }
```

A GTM-ben később Custom Event trigger: `vizitor_analytics`, Data Layer Variable v2: `vizitor_event`, további DLV-k: `vizitor_params.package_id` stb. GA4-küldésből vagy a jelenlegi közvetlen kód, vagy a GTM-címke működjön; mindkettőt egyszerre bekapcsolni duplázás. A GTM betöltése és a címkék consent-beállítása is külön ellenőrizendő; egy konténerazonosító önmagában nem biztosítja a többi címke megfelelőségét.

## Tesztelés

`npm run build:vercel`, `npm run check:consent`, `npm run check:analytics`. Böngészőben 4 engedélymátrix (semmi / csak GA4 / csak Clarity / mindkettő), visszavonás, normál UI-események, dummy űrlap-válaszok, nincs valódi e-mail-küldés. A QA során a mérési gyűjtővégpontok tiltva maradnak, hogy a riportokba ne kerüljön tesztforgalom; ezért a teszt a helyes küldési kísérletet és paramétereket igazolja, nem a szolgáltatói riportfeldolgozást.

## Források

- https://developers.google.com/analytics/devguides/collection/ga4/reference/events
- https://developers.google.com/tag-platform/gtagjs/routing
- https://github.com/GoogleChrome/web-vitals
- https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2
- https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api
- https://learn.microsoft.com/en-us/clarity/data-retention

Az éles átálláskor észlelt, korábbról maradt `cookieyes-consent` és `_gcl_au` sütiket is eltávolítjuk (a további `_gcl_*`, `_fbp`, `_fbc` nevekkel együtt). A régi engedélyeket nem olvassuk át az új rekordba. Más szolgáltató domainjén tárolt sütit a Vizitor domain nem törölhet.
