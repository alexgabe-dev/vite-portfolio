import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Database, Server, UserCheck } from 'lucide-react';

const Privacy = () => {
  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        delayChildren: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const sections = [
    {
      title: "Adatkezelés célja",
      content: "A Vizitor.hu weboldal adatkezelésének célja a látogatók adatainak biztonságos kezelése, valamint a szolgáltatásaink biztosítása. Az adatkezelés során mindig a legszigorúbb adatvédelmi szabályokat követjük.",
      icon: <Shield size={24} className="text-[#ff5c35]" />
    },
    {
      title: "Adatkezelés jogalapja",
      content: "Az adatkezelés jogalapja a GDPR 6. cikk (1) bekezdés a) pontja (beleegyezés) és b) pontja (szerződés teljesítése), valamint a 6. cikk (1) bekezdés f) pontja (jogos érdek).",
      icon: <Lock size={24} className="text-[#ff5c35]" />
    },
    {
      title: "Adatkezelés időtartama",
      content: "Az adatok kezelése a törvényben meghatározott időtartamig, vagy amíg az adatkezelés célja fennáll. A személyes adatok törlésre kerülnek, ha az adatkezelés célja megszűnik.",
      icon: <Eye size={24} className="text-[#ff5c35]" />
    },
    {
      title: "Adatkezelő adatai",
      content: "Vizitor.hu\nPélda utca 1.\n1234 Budapest\nAdószám: 12345678-2-41\nEmail: info@vizitor.hu",
      icon: <FileText size={24} className="text-[#ff5c35]" />
    },
    {
      title: "Adatkezelés módja",
      content: "Az adatkezelés automatikus és manuális módon is történik. Az adatok biztonságos tárolásra kerülnek, és csak a szükséges személyek férhetnek hozzájuk.",
      icon: <Database size={24} className="text-[#ff5c35]" />
    },
    {
      title: "Adatátvitel",
      content: "Az adatok harmadik félnek való továbbítása csak törvényes kötelezettség esetén történik. Minden adatátvitelről előzetesen tájékoztatjuk az érintetteket.",
      icon: <Server size={24} className="text-[#ff5c35]" />
    },
    {
      title: "Érintett jogai",
      content: "Az érintettek jogosultak az adatokhoz való hozzáférésre, helyesbítésre, törlésre, korlátozásra, továbbításra, valamint tiltakozásra. Minden kérelemre 30 napon belül válaszolunk.",
      icon: <UserCheck size={24} className="text-[#ff5c35]" />
    }
  ];

  return (
    <main className="min-h-screen bg-[#0f0f17] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="text-center mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            variants={fadeInUp}>
            Adatvédelmi Tájékoztató
          </motion.h1>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto text-lg"
            variants={fadeInUp}>
            A Vizitor.hu weboldal adatvédelmi tájékoztatója
          </motion.p>
          <div className="w-24 h-1 bg-[#ff5c35] mx-auto mt-6"></div>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-8"
          variants={staggerChildren}
          initial="initial"
          animate="animate">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-[#1a1a2e] p-8 rounded-lg border border-gray-800/50 hover:border-[#ff5c35]/30 transition-all duration-500">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-[#ff5c35]/10 rounded-lg flex items-center justify-center mr-4">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold">{section.title}</h2>
              </div>
              <p className="text-gray-400">{section.content}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-12 text-center text-gray-400"
          variants={fadeInUp}>
          <p>Utolsó módosítás: {new Date().toLocaleDateString('hu-HU')}</p>
        </motion.div>
      </div>
    </main>
  );
};

export default Privacy; 