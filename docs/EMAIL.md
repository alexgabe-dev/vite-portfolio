# Vizitor e-mail-küldés

Az űrlap saját szerveroldali Vercel Functiont használ: `POST /api/contact/`. A Resend API-kulcs nem kerül a böngészőbe. Nincs új kliensoldali csomag vagy követőkód.

## Levelek

- Belső értesítő: **info@vizitor.hu**. Tartalmazza a nevet, válaszcímet, üzenetet, szolgáltatást és csomagot. A Válasz gomb az érdeklődő címére válaszol (Reply-To).
- Rövid visszaigazolás: az érdeklődő e-mail-címére. Erre válaszolva az **info@vizitor.hu** címre ír. Nem hírlevél; a látogató által beírt szöveg és linkek nem kerülnek a visszaigazolásba.
- Feladó alapértelmezetten **Vizitor <info@vizitor.hu>**. Külön sending-only API-kulcs ajánlott, a vizitor.hu domainre korlátozva. Megnyitás- és kattintáskövetés maradjon kikapcsolva a Resendben.
- HTML- és egyszerű szöveges változat, az eredeti logó PNG-változatával. A képek letiltása esetén is olvasható tartalom. Mobilon 600 px alatti, folyékony tördelés.

## Éles beállítás

1. Resend → Domains: hitelesítsd a `vizitor.hu` domaint a Resend által megadott DNS-rekordokkal. A meglévő bejövő levelezés MX-rekordjait ne cseréld le; a Resend bejövő levelezését nem használjuk. Küldési régió: Írország.
2. Vercel → vite-portfolio → Settings → Environment Variables: `RESEND_API_KEY` (titkos, Production), opcionálisan `RESEND_FROM_EMAIL=Vizitor <info@vizitor.hu>`. Ne legyen `VITE_` előtag. A kulcsot ne tedd Gitbe vagy chatbe.
3. Új production deployment szükséges az új környezeti változóhoz. A kulcs hiányában az API 503-at ad; az űrlap megőrzi az adatokat és felajánlja a közvetlen e-mailt, nem mutat hamis sikert.
4. Ellenőrizd a tényleges kézbesítést egy saját címmel elküldött, egyértelmű tesztüzenettel. A Resend API elfogadása még nem jelent postaládába kézbesítést; a Delivered/Bounced állapotot a Resend Emails felületén lehet ellenőrizni.

A preview deployment alapból nem küld levelet. A `RESEND_ENABLE_PREVIEW=true` csak szándékos integrációs teszthez használható, hitelesített domainnel és külön tesztkulccsal. Nem kell állandóan engedélyezni.

## Hibakezelés és védelem

Kötelező e-mail és üzenet; méretkorlátok, CRLF/vezérlőkarakter-szűrés, HTML-escape, 24 KB-os kéréslimit, saját origin ellenőrzése és honeypot. A címzett szerveroldalon rögzített. Resend batch küldés: a két levél ugyanabban a kérésben kerül elfogadásra; siker csak két kapott levélazonosító után. A GA4 `generate_lead` ezután fut, személyes adatok nélkül.

Azonos tartalmú újrapróbálkozás stabil, HMAC-alapú Idempotency-Key-t kap; Resend 24 órán belül nem küldi kétszer ugyanazt a levélpárt. A kulcs nem tartalmaz olvasható személyes adatot. A provider-hibák és kulcsok nem kerülnek a kliensbe vagy a naplóba, csak általános hiba és HTTP-státusz.

Az alkalmazás 15 percenként 5 kérésre korlátoz egy IP-t, hash-elve és csak memóriában. **Ez egy Function-példányra érvényes, nem globális elosztott korlát.** Nagyobb vagy célzott spamnél a Vercel Firewallban érdemes tartós rate limitet alkalmazni a `/api/contact` útvonalra, illetve CAPTCHA-t bevezetni. Az origin ellenőrzése önmagában nem botvédelem. Nincs IP-cím tárolva analitikai rendszerben.

## Ellenőrzés és sablonelőnézet

`npm run check:email` – kizárólag mock Resend-válaszok, nincs hálózati levélküldés. Valódi siker, szolgáltatói hiba, üres/hibás mezők, injektált HTML, újraküldés, spam, túlméretes kérés, tiltott origin és rate limit ellenőrzése.

`npm run preview:email` – a verziózott eredeti logóból elkészíti az e-mail PNG-t, majd `.cache/email-preview/lead.html` és `receipt.html` néven két helyi, mintadatokkal kitöltött előnézetet készít. Ezek nem publikus ügyféladatok és nem kerülnek Gitbe.

A régi űrlapszolgáltató végpontja, kliensbeállításai, adatkezelési hivatkozása és analitikai domainengedélye eltávolítva. A régi szolgáltatói fiókban tárolt korábbi üzeneteket a migráció nem törli.
