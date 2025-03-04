import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Info } from 'lucide-react';

interface Package {
  title: string;
  price: string;
  type: string;
  category: string;
  popular?: boolean;
  features: string[];
}

interface PackageCategories {
  web: Package[];
  marketing: Package[];
  maintenance: Package[];
}

const Packages = () => {
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annually'>('monthly');
  const [activeCategory, setActiveCategory] = React.useState('web');

  const packages: PackageCategories = {
    web: [
      {
        title: "Alap Weboldal Csomag",
        price: "1.250.000 Ft",
        type: "egyszeri díj",
        category: "ALAP CSOMAG",
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
        price: "2.250.000 Ft",
        type: "egyszeri díj",
        category: "LEGNÉPSZERŰBB",
        popular: true,
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
        price: "3.750.000 Ft",
        type: "egyszeri díj",
        category: "PRÉMIUM CSOMAG",
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
        price: billingCycle === 'monthly' ? "75.000 Ft" : "729.000 Ft",
        type: billingCycle === 'monthly' ? "/ hónap" : "/ év",
        category: "ALAP CSOMAG",
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
        price: billingCycle === 'monthly' ? "145.000 Ft" : "1.409.400 Ft",
        type: billingCycle === 'monthly' ? "/ hónap" : "/ év",
        category: "LEGNÉPSZERŰBB",
        popular: true,
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
        price: billingCycle === 'monthly' ? "295.000 Ft" : "2.867.400 Ft",
        type: billingCycle === 'monthly' ? "/ hónap" : "/ év",
        category: "PRÉMIUM CSOMAG",
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
        price: billingCycle === 'monthly' ? "15.000 Ft" : "145.800 Ft",
        type: billingCycle === 'monthly' ? "/ hónap" : "/ év",
        category: "ALAP CSOMAG",
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
        price: billingCycle === 'monthly' ? "35.000 Ft" : "340.200 Ft",
        type: billingCycle === 'monthly' ? "/ hónap" : "/ év",
        category: "LEGNÉPSZERŰBB",
        popular: true,
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
        price: billingCycle === 'monthly' ? "75.000 Ft" : "729.000 Ft",
        type: billingCycle === 'monthly' ? "/ hónap" : "/ év",
        category: "PRÉMIUM CSOMAG",
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

  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-24 relative overflow-hidden">
      {/* Modern Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#ff5c35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-[#ff8f35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-[25%] w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          variants={fadeInUp}
          initial="initial"
          animate="animate">
          <h1 className="text-5xl font-bold mb-4">
            Tervek az Ön
            <span className="bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent"> igényeire </span>
            szabva
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Válassza ki az Önnek legmegfelelőbb csomagot és kezdje el vállalkozása online jelenlétének kiépítését
          </p>
        </motion.div>

        {/* Billing Cycle Selector */}
        {activeCategory !== 'web' && (
          <motion.div 
            className="flex justify-center mb-12"
            variants={fadeInUp}
            initial="initial"
            animate="animate">
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm p-1 rounded-xl inline-flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-[#ff5c35] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}>
                Havi
              </button>
              <button
                onClick={() => setBillingCycle('annually')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center ${
                  billingCycle === 'annually'
                    ? 'bg-[#ff5c35] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}>
                Éves
                <span className="ml-2 text-xs bg-white/10 text-white px-2 py-1 rounded-full">
                  -10%
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Category Selector */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12"
          variants={fadeInUp}
          initial="initial"
          animate="animate">
          {[
            { id: 'web', name: 'Webfejlesztés' },
            { id: 'marketing', name: 'Marketing' },
            { id: 'maintenance', name: 'Karbantartás' }
          ].map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${
                activeCategory === category.id
                  ? 'bg-[#ff5c35] text-white'
                  : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {packages[activeCategory as keyof typeof packages].map((pkg, index) => (
            <motion.div
              key={index}
              className={`relative bg-[#1a1a2e] rounded-2xl border transition-all ${
                pkg.popular
                  ? 'border-[#ff5c35] shadow-lg shadow-[#ff5c35]/20'
                  : 'border-gray-800/50 hover:border-[#ff5c35]/30'
              }`}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}>
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#ff5c35] text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Legnépszerűbb
                  </span>
                </div>
              )}
              
              <div className="p-8">
                <div className="text-sm font-medium text-[#ff5c35] mb-2">{pkg.category}</div>
                <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">{pkg.price}</span>
                  <span className="text-gray-400 ml-2">{pkg.type}</span>
                </div>

                <motion.button
                  className={`w-full px-6 py-3 rounded-lg font-semibold mb-8 transition-all ${
                    pkg.popular
                      ? 'bg-[#ff5c35] text-white hover:bg-[#ff5c35]/90'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  {pkg.popular ? 'Kezdés most' : 'Ajánlatkérés'}
                </motion.button>

                <ul className="space-y-4">
                  {pkg.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start text-gray-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}>
                      <Check className="w-5 h-5 text-[#ff5c35] mt-1 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Information */}
        <motion.div
          className="mt-16 p-8 bg-[#1a1a2e] rounded-2xl border border-gray-800/50"
          variants={fadeInUp}
          initial="initial"
          animate="animate">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-[#ff5c35]/20 rounded-lg">
              <Info className="w-6 h-6 text-[#ff5c35]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Egyedi igényei vannak?</h2>
              <p className="text-gray-400 mb-6">
                Amennyiben a fenti csomagok nem fedik le teljesen az Ön igényeit, keressen minket bizalommal! 
                Szakértő csapatunk személyre szabott megoldást készít az Ön vállalkozása számára.
              </p>
              <motion.button
                className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-[#ff5c35] text-[#ff5c35] rounded-lg font-semibold hover:bg-[#ff5c35] hover:text-white transition-colors group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                Kapcsolatfelvétel
                <ChevronRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Packages; 