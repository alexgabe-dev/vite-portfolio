# Mobilos használhatósági ellenőrzés

2026. november 21. — böngészőben emulált mobilnézetek és durva mutatós/érintéses CSS-beállítások.

## Talált és javított hibák

1. A szolgáltatásaloldalon kiválasztott szolgáltatás vagy csomag elveszett az ajánlatkéréshez navigálva. A választás most egyszer használatos, legfeljebb 15 percig érvényes munkamenet-adatként átkerül a főoldali űrlapba, utána törlődik. Név, e-mail és üzenet nem kerül ebbe a tárolóba. A betöltés hidratálás után történik, az URL-ek és a canonical címek változatlanok. Mind a 9 szolgáltatás irányából ellenőrizve; a Landing-csomag neve és ára is megjelent.
2. Több mobilos kapcsolat-, lábléc- és kérdéslink 17–38 px magas érinthető felületet kapott. A fontos érinthető vezérlők, a telefon, az e-mail, a szolgáltatáspillek és a lábléclinkek mobilon legalább 44 px magasak. A menügomb 44×44 px lett, az adatvédelmi megjegyzés 14 px-es szöveget kapott.
3. 320×568-as nézetben a csomaglapozó használata után az új kártya címe kb. 200 px-szel a képernyő fölött maradt. A lapozógomb most az új kártya elejére igazít, amikor az nem fér a nézetbe. A javított mérésben a kártya teteje kb. 99 px, címe kb. 156 px volt. A kézi vízszintes görgetés ettől függetlenül natív marad.
4. 200%-os betűméretnél a kapcsolat címe és néhány hosszú főoldali címsor levágódhatott. Mobilon szükség esetén tördelhetők a címsorok. Ha a kapcsolatbevezetőben kevés a hely a betűmérethez képest, a dekoratív grafika eltűnik, a szöveg megkapja a helyet. Normál betűméretnél a grafika megmarad.

## Kipróbált utak

- Mobilmenü megnyitása, szakaszhoz navigálás, fókuszátadás és a háttérgörgetés visszaállítása.
- 844×390 fekvő nézetben a menü belső tartalma görgethető; a projektek linkje elérhető.
- Kártyák lapozása nyilakkal és közvetlen választógombbal, helyes aktív állapot, első/utolsó kártyán a megfelelő nyíl letiltása.
- Natív vízszintes görgetés: a szolgáltatáskártyák sora 272 px-t mozdult, a 2. kártya vált aktívvá.
- Bekapcsolt mozgás mellett a látható 3D kártyáról indított függőleges görgetés 280 px-t mozgatta az oldalt; a vászon touch-action értéke auto.
- Görgetős folyamat: 390×844-en a 744 px magas rögzített területen elfért a kb. 679 px magas tartalom; a 3. lépés is kiválasztható volt.
- Marketing éves csomag: 55 200 Ft/hó és 662 400 Ft/év helyesen átkerült az űrlapba, a megfelelő szolgáltatás kijelölésével. Más érdeklődés kiválasztása törölte a korábbi csomagkontextust.
- Üres űrlapnál az e-mail-mező kap fókuszt. Kitöltött e-mail és üres üzenet esetén az üzenetmező. Az e-mail-beviteli mező alapmérete 16 px, 390×420-as rövid nézetben is látható maradt fókuszáláskor.
- Főoldali GYIK témaváltás és válasznyitás; szolgáltatásoldali natív kérdésnyitás 44 px magas összefoglalóval.
- Adatvédelmi témaválasztó: a kiválasztott fejezet a rögzített vezérlő alatt látszott, nem takarta el a fejléc.
- Projektek szűrése: az Alkalmazások nézetben 1 megfelelő referencia jelent meg.

## Képernyőméretek

320×568, 360×740, 390×844, 430×932, 600×800, 768×1024, 844×390, 1024×768 és 1440×900. A főoldal egyik nézetben sem futott túl vízszintesen; a folyamat tartalma elfért. A szolgáltatásoldalak korábbi 320/390/700/1280-as ellenőrzése is megmaradt. Az asztali megjelenéshez tartozó stílusokat nem írtuk át. 1440×900-on az élő és a javított helyi változat kilenc fejléc-, nyitó- és kapcsolati elemének mérete, pozíciója és betűmérete azonos volt. A végső 200%-os betűméretes ellenőrzés nem talált a saját dobozán túlnyúló főoldali címsort vagy árat.

## Ellenőrzés határai

Ez böngészős mobil- és rövidnézet-teszt, nem fizikai iPhone/Android készüléken végzett vizsgálat. A felület nyilakkal, natív görgetéssel és érintéses CSS-beállításokkal volt ellenőrizhető; a vizsgálófelület nem támogatott valódi érintési eseménysor küldését. A szoftveres billentyűzet helyett rövidített nézetet vizsgáltunk. Valódi tesztüzenet nem lett elküldve; a kézbesítést ez az ellenőrzés nem igazolja.
