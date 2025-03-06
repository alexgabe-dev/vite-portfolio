import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const Privacy = () => {
  const particlesInit = React.useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = React.useCallback(async (container: Container | undefined) => {
    console.log(container);
  }, []);

  return (
    <main className="min-h-screen bg-[#0f0f17] relative overflow-hidden">
      {/* Particles Background */}
      <Particles
        id="tsparticles-privacy"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: "#ff5c35",
            },
            links: {
              color: "#ff5c35",
              distance: 250,
              enable: true,
              opacity: 0.08,
              width: 0.8,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 0.4,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 2000,
              },
              value: 40,
            },
            opacity: {
              value: 0.08,
              animation: {
                enable: true,
                speed: 0.2,
                minimumValue: 0.04,
              },
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 0.8, max: 1.5 },
            },
          },
          detectRetina: true,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "bubble",
                parallax: {
                  enable: true,
                  force: 70,
                  smooth: 150
                }
              },
            },
            modes: {
              bubble: {
                distance: 250,
                size: 3,
                duration: 2,
                opacity: 0.2,
              }
            }
          }
        }}
        className="absolute inset-0"
      />

      {/* Modern Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#ff5c35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#ff8f35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-[25%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content container */}
      <div className="container mx-auto px-4 py-16 relative">
        <motion.div
          className="max-w-4xl mx-auto bg-black/40 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl border border-gray-800"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">
            Adatkezelési Tájékoztató
          </h1>
          
          {/* Introduction */}
          <div className="mb-12">
            <p className="text-lg leading-relaxed text-gray-300">
              Ez a tájékoztató részletesen ismerteti, hogy <span className="text-[#ff8f35] font-semibold">Gábor Sándor</span> egyéni vállalkozó, (továbbiakban: az "Adatkezelő") miként végzi az egyes szolgáltatásaihoz kapcsolódó adatkezelést. Tájékoztatjuk Önt, mint a <span className="text-[#ff8f35] font-semibold">vizitor.hu</span> honlap látogatóját és szolgáltatásaink potenciális igénybevevőjét az adatkezelés céljairól, módjáról, a technikai és szervezési intézkedésekről, az érintettek jogairól, valamint a panaszkezelés és jogorvoslati lehetőségek részleteiről.
            </p>
          </div>

          <hr className="border-gray-800 my-12" />

          {/* 1. Alapelvek és általános rendelkezések */}
          <section className="mb-12 bg-black/20 rounded-xl p-8 backdrop-blur-sm border border-gray-800/50">
            <h2 className="text-3xl font-bold mb-6 text-[#ff8f35]">
              1. Alapelvek és általános rendelkezések
            </h2>
            <p className="mb-6 text-gray-300 leading-relaxed">
              Az Adatkezelő a személyes adatok kezelésénél az alábbi alapelveket követi:
            </p>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="text-[#ff8f35] mt-1.5">•</span>
                <div>
                  <strong className="text-white">Jogszerűség és tisztességes kezelés:</strong>
                  <span className="text-gray-400"> Csak olyan személyes adatokat gyűjtünk, melyek kezelésének jogalapja fennáll (pl. hozzájárulás, szerződéses kötelezettség, jogszabályi előírás vagy jogos érdek).</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#ff8f35] mt-1.5">•</span>
                <div>
                  <strong className="text-white">Célhoz kötöttség:</strong>
                  <span className="text-gray-400"> Az adatokat kizárólag az itt meghatározott célokra használjuk.</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#ff8f35] mt-1.5">•</span>
                <div>
                  <strong className="text-white">Adatminimalizálás:</strong>
                  <span className="text-gray-400"> Csak a szolgáltatások ellátásához szükséges, releváns adatokat gyűjtünk.</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#ff8f35] mt-1.5">•</span>
                <div>
                  <strong className="text-white">Pontosság és frissesség:</strong>
                  <span className="text-gray-400"> Törekszünk az adatok pontosságára, rendszeresen ellenőrizzük és szükség esetén helyesbítjük azokat.</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#ff8f35] mt-1.5">•</span>
                <div>
                  <strong className="text-white">Biztonság:</strong>
                  <span className="text-gray-400"> Megfelelő technikai és szervezési intézkedésekkel védjük az adatokat a jogosulatlan hozzáférés, megsemmisítés, módosítás vagy egyéb jogellenes kezelés ellen.</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#ff8f35] mt-1.5">•</span>
                <div>
                  <strong className="text-white">Átláthatóság:</strong>
                  <span className="text-gray-400"> Minden érintett számára biztosítjuk a tájékoztatást az adatkezelés menetéről és az érintettek jogainak érvényesítéséhez szükséges elérhetőségekről.</span>
                </div>
              </li>
            </ul>
          </section>

          {/* 2. Vállalkozás adatai és az adatkezelő */}
          <section className="mb-12 bg-black/20 rounded-xl p-8 backdrop-blur-sm border border-gray-800/50">
            <h2 className="text-3xl font-bold mb-6 text-[#ff8f35]">
              2. Vállalkozás adatai és az adatkezelő
            </h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="text-[#ff8f35] mt-1.5">•</span>
                <div>
                  <strong className="text-white">Egyéni vállalkozó neve:</strong>
                  <span className="text-gray-400"> Gábor Sándor (az "Adatkezelő")</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#ff8f35] mt-1.5">•</span>
                <div>
                  <strong className="text-white">Nyilvántartási szám:</strong>
                  <span className="text-gray-400"> 60178884</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#ff8f35] mt-1.5">•</span>
                <div>
                  <strong className="text-white">Adószám:</strong>
                  <span className="text-gray-400"> 90834965-1-41</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#ff8f35] mt-1.5">•</span>
                <div>
                  <strong className="text-white">Székhely:</strong>
                  <span className="text-gray-400"> Magyarország, 1136 Budapest, Pannónia utca 14. (4. emelet, ajtó: 4)</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#ff8f35] mt-1.5">•</span>
                <div>
                  <strong className="text-white">Elérhetőségi e-mail:</strong>
                  <span className="text-gray-400"> info@vizitor.hu</span>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#ff8f35] mt-1.5">•</span>
                <div>
                  <strong className="text-white">Domain:</strong>
                  <span className="text-gray-400"> vizitor.hu</span>
                </div>
              </li>
            </ul>
            <p className="mt-4 text-gray-300">
              <strong className="text-[#ff8f35]">Adatkezelő – felelős tevékenységek:</strong>
              <span className="text-gray-400"> Gábor Sándor (e.v.) felelős az összes tevékenységért, amelyet a fenti adatok alapján végzünk.</span>
            </p>
          </section>

          {/* 3. Adatkezelés céljai, kezelt adatok és megőrzési időtartamok */}
          <section className="mb-12 bg-black/20 rounded-xl p-8 backdrop-blur-sm border border-gray-800/50">
            <h2 className="text-3xl font-bold mb-6 text-[#ff8f35]">
              3. Adatkezelés céljai, kezelt adatok és megőrzési időtartamok
            </h2>

            {/* 3.1. Honlap látogatása */}
            <div className="mb-8 space-y-4">
              <h3 className="text-2xl font-bold text-white border-l-4 border-[#ff8f35] pl-4">
                3.1. Honlap látogatása
              </h3>
              <div className="ml-6">
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Gyűjtött adatok:</h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>IP cím</li>
                    <li>Böngésző- és eszközspecifikus adatok</li>
                    <li>Sütik (cookie-k) és egyéb technikai azonosítók</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Cél:</h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>A weboldal zavartalan működésének biztosítása</li>
                    <li>Statisztikai elemzések, látogatottsági adatok gyűjtése</li>
                    <li>Biztonsági okokból történő naplózás</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Megőrzés:</h4>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Általában a szükséges ideig, jellemzően legfeljebb 1 évig (jogszerű előírások esetén hosszabb időtartam is előfordulhat).</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3.2. Regisztráció */}
            <div className="mb-8 space-y-4">
              <h3 className="text-2xl font-bold text-white border-l-4 border-[#ff8f35] pl-4">
                3.2. Regisztráció
              </h3>
              <div className="ml-6">
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Gyűjtött adatok:</h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>Név</li>
                    <li>E-mail cím</li>
                    <li>Telefonszám</li>
                    <li>Esetlegesen születési dátum és egyéb, a szolgáltatás specifikus adatok</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Cél:</h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>Felhasználói fiók létrehozása, azonosítása és karbantartása</li>
                    <li>Kapcsolattartás, jelszó visszaállítás, valamint a szolgáltatás zavartalan nyújtása</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Megőrzés:</h4>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Az ügyfélkapcsolat fennállásáig, illetve a jogszabályban előírt időtartamok szerint (általában 5–10 év a könyvelési, számlázási kötelezettségek miatt).</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3.3. Hírlevélküldés */}
            <div className="mb-8 space-y-4">
              <h3 className="text-2xl font-bold text-white border-l-4 border-[#ff8f35] pl-4">
                3.3. Hírlevélküldés
              </h3>
              <div className="ml-6">
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Gyűjtött adatok:</h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>E-mail cím</li>
                    <li>Amennyiben rendelkezésre áll, név</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Cél:</h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>Promóciós és tájékoztató jellegű hírlevelek, marketing anyagok küldése</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Megőrzés:</h4>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Az előfizetés aktív státuszáig; visszavonás esetén az adatok törlésre kerülnek, legfeljebb 10 évig, ha jogszabály előírja.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3.4. Ügyfélszolgálat */}
            <div className="mb-8 space-y-4">
              <h3 className="text-2xl font-bold text-white border-l-4 border-[#ff8f35] pl-4">
                3.4. Ügyfélszolgálat
              </h3>
              <div className="ml-6">
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Gyűjtött adatok:</h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>Név</li>
                    <li>E-mail cím</li>
                    <li>Telefonszám</li>
                    <li>IP cím</li>
                    <li>Az üzenet tartalma (pl. panasz, kérdés)</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Cél:</h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>Ügyfélszolgálati megkeresések kezelése, problémák megoldása, reklamációk, garanciális igények esetén a jogi kötelezettségek teljesítése</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Megőrzés:</h4>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Az ügyintézéshez szükséges ideig, majd 3 évig a reklamációs időszakok betartása érdekében.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3.5. Nyereményjátékok */}
            <div className="mb-8 space-y-4">
              <h3 className="text-2xl font-bold text-white border-l-4 border-[#ff8f35] pl-4">
                3.5. Nyereményjátékok
              </h3>
              <div className="ml-6">
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Gyűjtött adatok:</h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>Név</li>
                    <li>E-mail cím</li>
                    <li>Telefonszám</li>
                    <li>Postai cím</li>
                    <li>Esetlegesen születési dátum</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Cél:</h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>Nyereményjátékok lebonyolítása, részvétel ellenőrzése, eredmények értesítése, nyeremények kiszállítása</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Megőrzés:</h4>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>A nyereményjáték lezárását követően általában 1 évig, a jogviták rendezéséig.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3.6. Marketing és Social Media Marketing */}
            <div className="mb-8 space-y-4">
              <h3 className="text-2xl font-bold text-white border-l-4 border-[#ff8f35] pl-4">
                3.6. Marketing és Social Media Marketing
              </h3>
              <div className="ml-6">
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Gyűjtött adatok:</h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>E-mail cím</li>
                    <li>Név</li>
                    <li>IP cím</li>
                    <li>Esetleges demográfiai adatok és böngészési szokások</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Cél:</h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>Célzott reklámkampányok és promóciós tevékenységek lebonyolítása, a felhasználói élmény és kommunikáció optimalizálása</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Megőrzés:</h4>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Az adatkezelési hozzájárulás aktív státuszáig, illetve a jogszabály által előírt maximális időtartamig (legfeljebb 10 év).</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3.7. Weboldalkészítés és Webfejlesztés */}
            <div className="mb-8 space-y-4">
              <h3 className="text-2xl font-bold text-white border-l-4 border-[#ff8f35] pl-4">
                3.7. Weboldalkészítés és Webfejlesztés
              </h3>
              <div className="ml-6">
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Gyűjtött adatok:</h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>Név</li>
                    <li>E-mail cím</li>
                    <li>Telefonszám</li>
                    <li>Céges adatok (pl. cég neve, adószám)</li>
                    <li>Szerződéses adatok</li>
                    <li>IP cím</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Cél:</h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>Weboldalak és egyéb digitális megoldások tervezése, fejlesztése és üzemeltetése</li>
                    <li>Projektmenedzsment és ügyfélkapcsolatok fenntartása</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Megőrzés:</h4>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>A projekt lezárásától számított 5 évig, a szerződéses és jogi kötelezettségek teljesítéséhez szükséges ideig.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Adatfeldolgozók és harmadik fél szolgáltatók */}
          <section className="mb-12 bg-black/20 rounded-xl p-8 backdrop-blur-sm border border-gray-800/50">
            <h2 className="text-3xl font-bold mb-6 text-[#ff8f35]">
              4. Adatfeldolgozók és harmadik fél szolgáltatók
            </h2>
            <div className="space-y-6 text-gray-300">
              <p>Az adatkezelési műveletek során az alábbi adatfeldolgozókat és harmadik fél szolgáltatókat vesszük igénybe:</p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>
                    <strong className="text-white">Tárhelyszolgáltatók:</strong>
                    <span className="text-gray-400"> Rackhost Informatikai Zártkörűen Működő Részvénytársaság, Székhely: 6722 Szeged, Tisza Lajos körút 41., Honlap: www.rackhost.hu, E-mail: info@rackhost.hu.</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>
                    <strong className="text-white">Analitikai szolgáltatók:</strong>
                    <span className="text-gray-400"> A weboldal használatának elemzéséhez és a felhasználói élmény javításához.</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>
                    <strong className="text-white">Marketing szolgáltatók:</strong>
                    <span className="text-gray-400"> Hirdetések megjelenítéséhez és célzott marketing tevékenységekhez.</span>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* 5. Sütik (Cookie-k) és technikai azonosítók */}
          <section className="mb-12 bg-black/20 rounded-xl p-8 backdrop-blur-sm border border-gray-800/50">
            <h2 className="text-3xl font-bold mb-6 text-[#ff8f35]">
              5. Sütik (Cookie-k) és technikai azonosítók
            </h2>
            <div className="space-y-6 text-gray-300">
              <h3 className="text-xl font-bold text-white border-l-4 border-[#ff8f35] pl-4 mb-2">
                  5.1. A weboldal megfelelő működéséhez elengedhetetlen sütik
                </h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>
                    <strong className="text-white">Munkamenet sütik:</strong>
                    <span className="text-gray-400"> A weboldal alapvető funkcióinak biztosításához szükségesek.</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>
                    <strong className="text-white">Biztonsági sütik:</strong>
                    <span className="text-gray-400"> A felhasználói fiók védelmét szolgálják.</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>
                    <strong className="text-white">Teljesítmény sütik:</strong>
                    <span className="text-gray-400"> A weboldal teljesítményének méréséhez és javításához használatosak.</span>
                  </div>
                </li>
              </ul>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-white border-l-4 border-[#ff8f35] pl-4 mb-2">
                  5.2. Sütik kezelése és felhasználói lehetőségek
                </h3>
                <p className="text-gray-400">
                  <strong className="text-white">Cookie banner:</strong> Az első látogatáskor megjelenő áttekinthető cookie banner tájékoztatja a látogatót a sütik típusairól és céljairól, valamint lehetőséget biztosít az összes sütik elfogadására vagy a nem létfontosságú sütik (analitikai, marketing) elutasítására.
                </p>
                <p className="mt-2 text-gray-400">
                  <strong className="text-white">Részletes beállítások:</strong> A cookie banner egy részletes adatkezelési tájékoztatóhoz vezet, ahol a látogatók módosíthatják sütik beállításaikat, illetve a böngésző beállításaiban is módosíthatják a sütik kezelését.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Az érintettek jogai és a kérelmek kezelése */}
          <section className="mb-12 bg-black/20 rounded-xl p-8 backdrop-blur-sm border border-gray-800/50">
            <h2 className="text-3xl font-bold mb-6 text-[#ff8f35]">
              6. Az érintettek jogai és a kérelmek kezelése
            </h2>
            <div className="space-y-6 text-gray-300">
              <p>Az Adatkezelő elkötelezett az érintettek jogainak biztosítása mellett. Az alábbi jogokkal élhet:</p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>
                    <strong className="text-white">Hozzáférési jog:</strong>
                    <span className="text-gray-400"> Kérelmezheti, hogy milyen személyes adatokat tárolunk Önről.</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>
                    <strong className="text-white">Helyesbítési jog:</strong>
                    <span className="text-gray-400"> Kérelmezheti a pontatlan vagy hiányos adatok javítását, módosítását, kiegészítését.</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>
                    <strong className="text-white">Törlési jog („elfeledtetéshez való jog”):</strong>
                    <span className="text-gray-400"> Igény esetén kérheti személyes adatainak törlését, illetve zárolását (kivéve a jogszabály által előírt kötelező adatkezelés esetén).</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>
                    <strong className="text-white">Zárolási/korlátozási jog:</strong>
                    <span className="text-gray-400"> Kérelmezheti az adatok ideiglenes feldolgozásának korlátozását.</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>
                    <strong className="text-white">Tiltakozási jog:</strong>
                    <span className="text-gray-400"> Bármikor tiltakozhat az adatok egyes, például marketing célú feldolgozása ellen.</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>
                    <strong className="text-white">Adathordozhatósági jog:</strong>
                    <span className="text-gray-400"> Kérelmezheti, hogy az adatokat strukturált, géppel olvasható formátumban átadjuk egy másik adatkezelő részére.</span>
                  </div>
                </li>
              </ul>
              <p className="mt-4 text-gray-400">
                A kérelmeket írásban (pl. e-mailben vagy online űrlapon) várjuk, dedikált adatvédelmi munkatársunk kezeli azokat, és általában 30 napon belül válaszolunk, szükség esetén a határidőt írásban meghosszabbítva.
              </p>
            </div>
          </section>

          {/* 7. További adatkezelési eljárások és biztonsági intézkedések */}
          <section className="mb-12 bg-black/20 rounded-xl p-8 backdrop-blur-sm border border-gray-800/50">
            <h2 className="text-3xl font-bold mb-6 text-[#ff8f35]">
              7. További adatkezelési eljárások és biztonsági intézkedések
            </h2>
            <div className="space-y-6 text-gray-300">
              {/* 7.1. Adatvédelmi incidens kezelése */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white border-l-4 border-[#ff8f35] pl-4">
                  7.1. Adatvédelmi incidens kezelése
                </h3>
                <ul className="list-disc list-inside ml-6 text-gray-400 space-y-1">
                  <li>
                    <strong className="text-white">Azonnali reagálás:</strong> Incidens észlelésekor azonnal aktiváljuk belső protokolljainkat.
                  </li>
                  <li>
                    <strong className="text-white">Dokumentáció és kivizsgálás:</strong> Részletesen dokumentáljuk az incidens okait, majd meghatározzuk a helyreállítási lépéseket.
                  </li>
                  <li>
                    <strong className="text-white">Értesítési kötelezettség:</strong> Személyes adatok érintése esetén a GDPR előírásainak megfelelően (72 órán belül) értesítjük az illetékes hatóságot és az érintetteket.
                  </li>
                  <li>
                    <strong className="text-white">Folyamatos fejlesztés:</strong> Rendszeresen frissítjük és teszteljük incidenskezelési eljárásainkat.
                  </li>
                </ul>
              </div>
              {/* 7.2. Technikai és szervezési biztonsági intézkedések */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white border-l-4 border-[#ff8f35] pl-4">
                  7.2. Technikai és szervezési biztonsági intézkedések
                </h3>
                <ul className="list-disc list-inside ml-6 text-gray-400 space-y-1">
                  <li>
                    <strong className="text-white">Titkosítás:</strong> Az adatátvitel során TLS protokollt, illetve tároláskor korszerű titkosítási algoritmusokat alkalmazunk.
                  </li>
                  <li>
                    <strong className="text-white">Jelszóvédelem és autentikáció:</strong> Erős jelszókövetelmények és kétfaktoros autentikáció biztosítja a fiókok védelmét.
                  </li>
                  <li>
                    <strong className="text-white">Vírusirtó és behatolás-megelőző rendszerek:</strong> Frissített vírusirtó szoftvereket, tűzfalakat és egyéb biztonsági megoldásokat használunk.
                  </li>
                  <li>
                    <strong className="text-white">Fizikai védelem:</strong> A szerverekhez és irodai létesítményekhez való hozzáférés szigorúan korlátozott, beléptető rendszerek és zárt helyiségek révén.
                  </li>
                  <li>
                    <strong className="text-white">Biztonsági mentések:</strong> Rendszeres adatmentésekkel biztosítjuk az adatok helyreállíthatóságát incidens esetén.
                  </li>
                </ul>
              </div>
              {/* 7.3. Adatok harmadik félnek történő továbbítása */}
              <div>
                <h3 className="text-2xl font-bold text-white border-l-4 border-[#ff8f35] pl-4">
                  7.3. Adatok harmadik félnek történő továbbítása
                </h3>
                <ul className="list-disc list-inside ml-6 text-gray-400 space-y-1">
                  <li>
                    <strong className="text-white">Szerződéses feltételek:</strong> Az adatok harmadik félnek történő továbbítása kizárólag szigorú szerződéses garanciák mellett történik.
                  </li>
                  <li>
                    <strong className="text-white">Adatvédelmi megfelelés:</strong> Biztosítjuk, hogy a harmadik felek is megfeleljenek a vonatkozó adatvédelmi előírásoknak, beleértve az EU-n kívüli továbbítás esetében alkalmazott standard szerződéses klauzulákat.
                  </li>
                  <li>
                    <strong className="text-white">Célhoz kötöttség:</strong> Az adatok továbbítása kizárólag a szolgáltatásnyújtáshoz és a kapcsolódó üzleti folyamatokhoz szükséges mértékben történik.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 8. Az Ön jogai és jogorvoslati lehetőségei */}
          <section className="mb-12 bg-black/20 rounded-xl p-8 backdrop-blur-sm border border-gray-800/50">
            <h2 className="text-3xl font-bold mb-6 text-[#ff8f35]">
              8. Az Ön jogai és jogorvoslati lehetőségei
            </h2>
            <div className="space-y-6 text-gray-300">
              <p>Ön az adatkezelésről:</p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>Tájékoztatást kérhet,</div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>Kérheti az általunk kezelt személyes adataik helyesbítését, módosítását, kiegészítését,</div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>Tiltakozhat az adatkezelés ellen, és kérheti adatai törlését, valamint zárolását (a kötelező adatkezelés kivételével),</div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>Bíróság előtt jogorvoslattal élhet,</div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>Felügyelő hatóságnál panaszt tehet, illetve eljárást kezdeményezhet (További információ a panaszügyintézés rendjéről).</div>
                </li>
              </ul>
              <p className="mt-4 text-gray-300">
                <strong className="text-white">Felügyelő Hatóság:</strong> Nemzeti Adatvédelmi és Információszabadság Hatóság
              </p>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div><strong className="text-white">Székhely:</strong> 1125 Budapest, Szilágyi Erzsébet fasor 22/c.</div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div><strong className="text-white">Levelezési cím:</strong> 1530 Budapest, Pf.: 5.</div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div><strong className="text-white">Telefon:</strong> +36 (1) 391-1400</div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div><strong className="text-white">Fax:</strong> +36 (1) 391-1410</div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div><strong className="text-white">E-mail:</strong> ugyfelszolgalat@naih.hu</div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div><strong className="text-white">Honlap:</strong> https://naih.hu/</div>
                </li>
              </ul>
              <p className="mt-4 text-gray-300">
                Az Ön kérelmére tájékoztatást adunk az általunk kezelt, illetve az általunk – vagy megbízott adatfeldolgozónk által – feldolgozott:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-6 space-y-1">
                <li>Adatairól,</li>
                <li>Azok forrásáról,</li>
                <li>Az adatkezelés céljáról és jogalapjáról,</li>
                <li>Az adatok megőrzési időtartamáról (vagy ezen időtartam meghatározásának szempontjairól),</li>
                <li>Az adatfeldolgozóink nevéről, címéről és az adatkezeléssel összefüggő tevékenységükről,</li>
                <li>Az adatvédelmi incidensek körülményeiről, hatásairól, valamint az elhárításukra és megelőzésükre tett intézkedéseinkről,</li>
                <li>Az Ön személyes adatainak továbbítása esetén az adattovábbítás jogalapjáról és címzettjéről.</li>
              </ul>
              <p className="mt-4 text-gray-300">
                A kérelem benyújtásától számított 15 napon belül (legfeljebb 1 hónapon belül) adjuk meg tájékoztatásunkat. A tájékoztatás ingyenes, kivéve, ha az adott évben azonos adatkörre vonatkozóan már benyújtott tájékoztatási kérelmet. Amennyiben Ön már megfizetett költségtérítést, azt visszatérítjük, ha az adatokat jogellenesen kezeltük, vagy a tájékoztatás kérése helyesbítéshez vezetett. A tájékoztatást csak törvényben foglalt esetekben tagadhatjuk meg, a jogszabályban meghatározott feltételek mellett, valamint a bírósági jogorvoslat, illetve a felügyelő hatósághoz fordulás lehetőségéről tájékoztatva.
              </p>
              <p className="mt-4 text-gray-300">
                Az Adatkezelő a személyes adatok helyesbítéséről, zárolásáról, megjelöléséről és törléséről értesíti Önt, valamint mindazokat, akiknek korábban az adatot az adatkezelés céljára továbbította – kivéve, ha az értesítés elmaradása az Ön jogos érdekeit nem sérti.
              </p>
              <p className="mt-4 text-gray-300">
                Amennyiben az Ön helyesbítési, zárolási vagy törlési kérelmét nem teljesítjük, a kérelmétől számított 15 napon belül (legfeljebb 1 hónapon belül) írásban vagy az Ön hozzájárulásával – elektronikus úton közljük elutasításunk indokait, és tájékoztatjuk Önt a bírósági jogorvoslat, illetve a felügyelő hatósághoz fordulás lehetőségéről.
              </p>
              <p className="mt-4 text-gray-300">
                Amennyiben Ön tiltakozik a személyes adatai kezelése ellen, a tiltakozást a kérelmétől számított 15 napon belül (legfeljebb 1 hónapon belül) megvizsgáljuk, és döntésünkről írásban tájékoztatjuk Önt. Ha úgy döntünk, hogy az Ön tiltakozása megalapozott, az esetben az adatkezelést – beleértve a további adatfelvételt és adattovábbítást – megszüntetjük, az adatokat zároljuk, és a tiltakozásról, valamint az azzal összefüggő intézkedésekről értesítjük mindazokat, akiknek korábban az érintett személyes adatot továbbítottuk, illetve akik kötelesek intézkedni a tiltakozási jog érvényesítése érdekében.
              </p>
              <p className="mt-4 text-gray-300">
                Abban az esetben megtagadjuk a kérés teljesítését, ha bizonyítjuk, hogy az adatkezelést olyan kényszerítő erejű jogos okok indokolják, amelyek elsőbbséget élveznek az Ön érdekeivel, jogaival és szabadságaival szemben, vagy amelyek jogi igények előterjesztéséhez, érvényesítéséhez vagy védelméhez kapcsolódnak. Amennyiben Ön a döntésünkkel nem ért egyet, illetve, ha elmulasztjuk a határidőt, a döntés közlésétől, illetve a határidő utolsó napjától számított 30 napon belül Ön bírósághoz fordulhat.
              </p>
              <p className="mt-4 text-gray-300">
                Az adatvédelmi perek elbírálása a törvénysék hatáskörébe tartozik, a per – az érintett választása szerint – az érintett lakóhelye vagy tartózkodási helye szerinti törvénysék előtt is megindítható. Külföldi állampolgár esetén a lakóhelye szerint illetékes felügyelő hatósághoz is fordulhat panasszal.
              </p>
            </div>
          </section>

          {/* 9. Irányadó jogszabályok és előírások */}
          <section className="mb-12 bg-black/20 rounded-xl p-8 backdrop-blur-sm border border-gray-800/50">
            <h2 className="text-3xl font-bold mb-6 text-[#ff8f35]">
              9. Irányadó jogszabályok és előírások
            </h2>
            <div className="space-y-6 text-gray-300">
              <p>Az adatkezelés során az alábbi jogszabályokat vesszük figyelembe:</p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>
                    <strong className="text-white">GDPR (EU 2016/679):</strong>
                    <span className="text-gray-400"> Az Európai Unió általános adatvédelmi rendelete, amely az adatkezelés alapelveit, érintetti jogokat és biztonsági előírásokat szabályozza.</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>
                    <strong className="text-white">2011. évi CXII. törvény:</strong>
                    <span className="text-gray-400"> Az információs önrendelkezési jogról és az információszabadságról szóló törvény, amely biztosítja az érintettek adatainak kezelésében az információs önrendelkezési jog érvényesülését.</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>
                    <strong className="text-white">Elektronikus hírközlésről szóló törvény (Eker tv.):</strong>
                    <span className="text-gray-400"> Szabályozza az elektronikus kommunikáció során alkalmazott sütik és technikai azonosítók kezelését.</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>
                    <strong className="text-white">Polgári Törvénykönyv és fogyasztóvédelmi előírások:</strong>
                    <span className="text-gray-400"> Az adatkezeléssel kapcsolatos felelősségi kérdések, szerződéses viszonyok és kártérítési szabályok tekintetében.</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-[#ff8f35] mt-1.5">•</span>
                  <div>
                    <strong className="text-white">Speciális biztonsági előírások:</strong>
                    <span className="text-gray-400"> A számítógépes rendszerek és adatvédelmi intézkedésekre vonatkozó egyéb releváns szabályozások.</span>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* 10. Az adatkezelési tájékoztató módosítása */}
          <section className="mb-12 bg-black/20 rounded-xl p-8 backdrop-blur-sm border border-gray-800/50">
            <h2 className="text-3xl font-bold mb-6 text-[#ff8f35]">
              10. Az adatkezelési tájékoztató módosítása
            </h2>
            <div className="space-y-6 text-gray-300">
              <p>
                Az Adatkezelő fenntartja a jogot a jelen adatkezelési tájékoztató módosítására. Az esetleges változásokról a vizitor.hu weboldalon keresztül értesítjük az érintetteket, hogy az adatkezelés minden szempontból naprakész és a vonatkozó jogszabályoknak megfelelő legyen.
              </p>
            </div>
          </section>

          {/* 11. Záró rendelkezések */}
          <section className="mb-12 bg-black/20 rounded-xl p-8 backdrop-blur-sm border border-gray-800/50">
            <h2 className="text-3xl font-bold mb-6 text-[#ff8f35]">
              11. Záró rendelkezések
            </h2>
            <div className="space-y-6 text-gray-300">
              <p>
                Gábor Sándor, mint egyéni vállalkozó, elkötelezett amellett, hogy a személyes adatokat a legszigorúbb biztonsági előírásoknak megfelelően kezelje. Munkatársaink és az adatkezelési eljárásaink folyamatosan figyelik a jogszabályi változásokat, és szükség esetén frissítik a folyamatokat, biztosítva ezzel a felhasználók jogainak maximális védelmét.
              </p>
            </div>
          </section>

          {/* 12. Kapcsolat és további tájékoztatás */}
          <section className="mb-12 bg-black/20 rounded-xl p-8 backdrop-blur-sm border border-gray-800/50">
            <h2 className="text-3xl font-bold mb-6 text-[#ff8f35]">
              12. Kapcsolat és további tájékoztatás
            </h2>
            <div className="space-y-6 text-gray-300">
              <p>
                Az adatkezeléssel kapcsolatos kérdéseivel Ön az <strong className="text-[#ff8f35]">info@vizitor.hu</strong> e-mail címen, illetve postacímen kérhet további tájékoztatást. Kérjük, vegye fel velünk a kapcsolatot, és válaszunkat 15 napon belül (legfeljebb 1 hónapon belül) megküldjük az Ön által megadott elérhetőségre.
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-lg font-semibold text-[#ff8f35]">
              Ez a tájékoztató 2025.02.25-én került véglegesítésre, és hatályos mindaddig, amíg azt újabb módosítás nem váltja fel.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Privacy;
