# Lighthouse-mérések – 2026. november 21.

Az élő Sites-próbaoldal főoldalán három mobilos és három asztali futás készült, Lighthouse 12.8.2 és Chrome 158 használatával. Normál animációs beállítás, friss böngészőprofil minden futásnál. Az alábbi számok mediánok.

| Mutató | Mobil | Asztali |
| --- | ---: | ---: |
| Teljesítmény | 97 | 99 |
| Akadálymentesség | 97 | 97 |
| Technikai ajánlások | 82 | 81 |
| SEO | 66 | 66 |
| FCP | 1,69 s | 0,44 s |
| LCP | 2,30 s | 0,56 s |
| TBT | 104 ms | 92 ms |
| CLS | 0 | 0 |

Mobil: 412 × 823, 4× CPU-lassítás, kb. 1,6 Mbit/s és 150 ms RTT. Asztali: 1350 × 940, 1× CPU, 10 Mbit/s és 40 ms RTT. A mobilos nyitókép 3D nélkül indul; az asztali futásokban a 3D-motor is betöltődött.

## Talált javítandók

- Több szöveg kontrasztja a csomagoknál, az űrlapon és a láblécben alacsony.
- Három csomaggomb látható felirata és akadálymentes neve nincs összhangban.
- A technikai levonást a tárhely Cloudflare challenge-platform szkriptjének két elavult API-ja okozta.
- A SEO-levonást a privát próbaoldal szándékos `noindex` beállítása okozta. A nyilvános indulás előtt külön ellenőrzendő.
- Kisebb folyamatképek, CSS-szétbontás és a statikus fájlok cache-beállításai további optimalizálási lehetőségek.

Ez kezdeti betöltési laborvizsgálat. Nem igazolja önmagában a valódi iPhone-os gesztusok, a hosszú görgetés vagy a később betöltődő 3D-jelenetek képkockasebességét; nem helyettesíti a felhasználói Core Web Vitals-adatokat.

A hat normál animációs futás adatai: [JSON-összesítés](audits/lighthouse-2026-11-21.json). Hitelesítési adat nincs a fájlban.
