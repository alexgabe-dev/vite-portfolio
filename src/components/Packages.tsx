import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const Packages = () => {
  const packages = {
    web: [
      {
        title: "Alap Weboldal Csomag",
        price: "125.000 Ft",
        type: "Egyszeri díj",
        features: [
          "Reszponzív weboldal kialakítás",
          "5 egyedi aloldal",
          "Kapcsolati űrlap",
          "Google Térkép integráció",
          "Közösségi média integráció",
          "Alapszintű SEO beállítások",
          "SSL tanúsítvány",
          "Webhosting (első év)",
          "Domain név (első év)",
          "Email cím létrehozása"
        ]
      },
      {
        title: "Közép Weboldal Csomag",
        price: "225.000 Ft",
        type: "Egyszeri díj",
        features: [
          "Az Alap csomag minden eleme",
          "10 egyedi aloldal",
          "Blog funkció",
          "Többnyelvű tartalom kezelés",
          "Galéria modul",
          "Hírlevél feliratkozás",
          "Google Analytics integráció",
          "Keresőoptimalizálás (SEO)",
          "Weboldal sebesség optimalizálás",
          "Admin felület testreszabás",
          "Online időpontfoglaló rendszer",
          "Chat widget integráció"
        ]
      },
      {
        title: "Prémium Weboldal Csomag",
        price: "375.000 Ft-tól",
        type: "Egyedi árazás",
        features: [
          "A Közép csomag minden eleme",
          "Korlátlan aloldal",
          "Egyedi design tervezés",
          "E-commerce funkciók",
          "Fizetési gateway integráció",
          "Raktárkészlet kezelés",
          "Egyedi modulok fejlesztése",
          "Automatizált marketing eszközök",
          "CRM integráció",
          "Részletes látogatói analitika",
          "Teljes körű SEO optimalizálás",
          "Prémium hosting szolgáltatás",
          "24/7 technikai támogatás"
        ]
      }
    ],
    marketing: [
      {
        title: "Alap Marketing Csomag",
        price: "75.000 Ft/hó",
        type: "Minimum 3 hónap",
        features: [
          "Social media jelenlét kezelése (2 platform)",
          "Heti 3 poszt készítése és ütemezése",
          "Google cégem profil optimalizálás",
          "Havi riport készítése",
          "Email marketing alapcsomag (500 címig)",
          "Alapszintű Google Ads kampány",
          "Versenytárs analízis",
          "Havi konzultáció"
        ]
      },
      {
        title: "Közép Marketing Csomag",
        price: "145.000 Ft/hó",
        type: "Minimum 3 hónap",
        features: [
          "Social media jelenlét kezelése (4 platform)",
          "Heti 5 poszt készítése és ütemezése",
          "Influencer marketing stratégia",
          "Google Ads kampányok (Search + Display)",
          "Facebook és Instagram hirdetések",
          "Email marketing (2000 címig)",
          "Havi 2 blog bejegyzés írása",
          "Havi részletes elemzés",
          "Kétheti konzultáció"
        ]
      },
      {
        title: "Prémium Marketing Csomag",
        price: "295.000 Ft/hó",
        type: "Minimum 6 hónap",
        features: [
          "Teljes körű social media menedzsment",
          "Napi posztok készítése és ütemezése",
          "Egyedi grafikai tervezés",
          "Komplex Google Ads kampányok",
          "Facebook, Instagram, LinkedIn hirdetések",
          "Email marketing (korlátlan)",
          "Heti blog bejegyzések",
          "PR és sajtóközlemények",
          "Influencer kampányok",
          "Heti konzultáció",
          "24/7 ügyfélszolgálat"
        ]
      }
    ],
    maintenance: [
      {
        title: "Alap Karbantartási Csomag",
        price: "15.000 Ft/hó",
        type: "Éves szerződés",
        features: [
          "Havi biztonsági mentés",
          "WordPress frissítések",
          "Plugin frissítések",
          "Alapszintű biztonsági ellenőrzés",
          "Havi 1 óra tartalommódosítás",
          "Email támogatás",
          "Havi teljesítmény jelentés"
        ]
      },
      {
        title: "Közép Karbantartási Csomag",
        price: "35.000 Ft/hó",
        type: "Éves szerződés",
        features: [
          "Heti biztonsági mentés",
          "Rendszeres frissítések és ellenőrzések",
          "Biztonsági monitoring",
          "Malware védelem",
          "Havi 3 óra tartalommódosítás",
          "Teljesítmény optimalizálás",
          "SSL tanúsítvány kezelés",
          "Email és telefon támogatás",
          "Havi részletes jelentés"
        ]
      },
      {
        title: "Prémium Karbantartási Csomag",
        price: "75.000 Ft/hó",
        type: "Éves szerződés",
        features: [
          "Napi biztonsági mentés",
          "24/7 monitoring és védelem",
          "Fejlett biztonsági rendszer",
          "DDoS védelem",
          "Korlátlan tartalommódosítás",
          "Folyamatos teljesítmény optimalizálás",
          "CDN szolgáltatás",
          "Prioritásos támogatás",
          "Heti jelentések",
          "Egyedi fejlesztések kedvezményes áron"
        ]
      }
    ]
  };

  const [activeCategory, setActiveCategory] = React.useState('web');

  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 
          className="text-4xl font-bold mb-16"
          variants={fadeInUp}
          initial="initial"
          animate="animate">
          Szolgáltatási Csomagok
          <div className="w-24 h-1 bg-[#ff5c35] mt-4"></div>
        </motion.h1>

        {/* Category Selector */}
        <div className="flex flex-wrap gap-4 mb-12">
          {[
            { id: 'web', name: 'Webfejlesztés' },
            { id: 'marketing', name: 'Marketing' },
            { id: 'maintenance', name: 'Karbantartás' }
          ].map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeCategory === category.id
                  ? 'bg-[#ff5c35] text-white'
                  : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {packages[activeCategory as keyof typeof packages].map((pkg, index) => (
            <motion.div
              key={index}
              className="bg-[#1a1a2e] p-8 rounded-lg border border-gray-800/50 hover:border-[#ff5c35]/30 transition-all"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: index * 0.1 }}>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                <div className="text-3xl font-bold text-white">{pkg.price}</div>
                <p className="text-gray-500 mt-2">{pkg.type}</p>
              </div>

              <ul className="space-y-3 text-gray-400 mb-8">
                {pkg.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}>
                    <ChevronRight size={18} className="text-[#ff5c35] mt-1 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                className="w-full px-6 py-3 bg-[#ff5c35] text-white rounded-lg font-semibold hover:bg-[#ff5c35]/90 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                Ajánlatkérés
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Additional Information */}
        <motion.div
          className="mt-16 p-8 bg-[#1a1a2e] rounded-lg border border-gray-800/50"
          variants={fadeInUp}
          initial="initial"
          animate="animate">
          <h2 className="text-2xl font-bold mb-4">Egyedi igények?</h2>
          <p className="text-gray-400 mb-6">
            Amennyiben a fenti csomagok nem fedik le teljesen az Ön igényeit, keressen minket bizalommal! 
            Szakértő csapatunk személyre szabott megoldást készít az Ön vállalkozása számára.
          </p>
          <motion.button
            className="px-6 py-3 bg-transparent border-2 border-[#ff5c35] text-[#ff5c35] rounded-lg font-semibold hover:bg-[#ff5c35] hover:text-white transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}>
            Kapcsolatfelvétel
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Packages; 