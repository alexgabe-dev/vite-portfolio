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
        title: "Starter Csomag",
        price: "135.000 Ft",
        type: "-tól",
        category: "ALAP CSOMAG",
        features: [
          "Egyedi, modern dizájn",
          "Egy oldalas felépítés",
          "Reszponzív felület",
          "Alap CMS integráció",
          "Gyors oldalbetöltés & cache optimalizáció",
          "Alap SEO optimalizáció",
          "Kapcsolati űrlap",
          "Ingyenes domain (1 év)",
          "Ingyenes SSL tanúsítvány",
          "GDPR Consent Mode 2.0 megfelelés",
          "1 hónap ingyenes karbantartás"
        ]
      },
      {
        title: "Business Csomag",
        price: "200.000 Ft",
        type: "-tól",
        category: "LEGNÉPSZERŰBB",
        popular: true,
        features: [
          "Minden a Starterből, plusz:",
          "Többoldalas felépítés (max 15 oldal)",
          "Blog és híroldal integráció",
          "Kiterjesztett SEO & kulcsszó kutatás",
          "Social media integráció",
          "Email hírlevél és automata feliratkozás",
          "Google Analytics integráció",
          "Galéria, portfólió és videó szekció",
          "Prémium design elemek & grafikai illusztrációk",
          "Egyedi süti banner",
          "2 hónap ingyenes karbantartás"
        ]
      },
      {
        title: "Premium Csomag",
        price: "350.000 Ft",
        type: "-tól",
        category: "PRÉMIUM CSOMAG",
        features: [
          "Minden a Businessből, plusz:",
          "Teljes e-commerce rendszer",
          "Haladó SEO stratégiák & marketing támogatás",
          "Többnyelvű weboldal kialakítása",
          "Egyedi plugin és modul fejlesztés",
          "Fejlett biztonsági megoldások",
          "Haladó teljesítmény optimalizáció",
          "CRM integráció & automatizált ügyfélkezelés",
          "3 hónap ingyenes karbantartás"
        ]
      }
    ],
    marketing: [
      {
        title: "Alap Marketing Csomag",
        price: billingCycle === 'monthly' ? "75.000 Ft" : `${Math.round((75000 * 12 * 0.8) / 12).toLocaleString()} Ft`,
        type: "/ hónap",
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
        price: billingCycle === 'monthly' ? "145.000 Ft" : `${Math.round((145000 * 12 * 0.8) / 12).toLocaleString()} Ft`,
        type: "/ hónap",
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
        price: billingCycle === 'monthly' ? "295.000 Ft" : `${Math.round((295000 * 12 * 0.8) / 12).toLocaleString()} Ft`,
        type: "/ hónap",
        category: "PRÉMIUM CSOMAG",
        features: [
          "Átfogó közösségi média menedzsment",
          "Napi posztok tervezése, elkészítése és ütemezése",
          "Testreszabott grafikai tervezési megoldások",
          "Összetett Google Ads kampányok kezelése",
          "Facebook, Instagram és LinkedIn hirdetési kampányok",
          "Korlátlan email marketing kampány",
          "Heti friss blog tartalom készítése",
          "PR stratégia és sajtóközlemények kidolgozása",
          "Influencer együttműködések menedzselése",
          "Heti szakértői konzultáció"
        ]
      }
    ],
    maintenance: [
      {
        title: "Alap Karbantartási Csomag",
        price: billingCycle === 'monthly' ? "25.000 Ft" : `${Math.round((25000 * 12 * 0.8) / 12).toLocaleString()} Ft`,
        type: "/ hónap",
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
        price: billingCycle === 'monthly' ? "35.000 Ft" : `${Math.round((35000 * 12 * 0.8) / 12).toLocaleString()} Ft`,
        type: "/ hónap",
        category: "LEGNÉPSZERŰBB",
        popular: true,
        features: [
          "Heti biztonsági mentés",
          "Rendszeres frissítések és ellenőrzések",
          "Biztonsági monitoring",
          "Adatbázis védelem",
          "Havi 3 óra tartalommódosítás",
          "Teljesítmény optimalizálás",
          "SSL tanúsítvány kezelés",
          "Email és telefon támogatás",
          "Havi részletes jelentés"
        ]
      },
      {
        title: "Prémium Karbantartási Csomag",
        price: billingCycle === 'monthly' ? "75.000 Ft" : `${Math.round((75000 * 12 * 0.8) / 12).toLocaleString()} Ft`,
        type: "/ hónap",
        category: "PRÉMIUM CSOMAG",
        features: [
          "Napi biztonsági mentés",
          "24/7 monitoring és védelem",
          "Fejlett biztonsági szoftver",
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
            Tervek az
            <span className="bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent"> Ön igényeire </span>
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
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-[#ff5c35] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                aria-label="Switch to monthly billing"
                aria-pressed={billingCycle === 'monthly'}>
                Havi
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annually')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center ${
                  billingCycle === 'annually'
                    ? 'bg-[#ff5c35] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                aria-label="Switch to annual billing"
                aria-pressed={billingCycle === 'annually'}>
                Éves
                <span className="ml-2 text-xs bg-white/10 text-white px-2 py-1 rounded-full">
                  -20%
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
              type="button"
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${
                activeCategory === category.id
                  ? 'bg-[#ff5c35] text-white'
                  : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Switch to ${category.name} category`}
              aria-pressed={activeCategory === category.id}>
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
              {billingCycle === 'annually' && activeCategory !== 'web' && (
                <div className="absolute top-4 right-4">
                  <span className="bg-[#ff5c35] text-white text-xs font-semibold px-2 py-1 rounded-full">
                    -20%
                  </span>
                </div>
              )}
              <div className="p-8">
                <div className="text-sm font-medium text-[#ff5c35] mb-2">{pkg.category}</div>
                <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                <div className="flex items-baseline mb-6 space-x-2">
                  <span className="text-4xl font-bold">{pkg.price}</span>
                  <span className="text-gray-400 text-sm">{pkg.type}</span>
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
                whileTap={{ scale: 0.98 }}
                aria-label="Contact us for custom solutions"
                onClick={() => window.location.href = '/kapcsolat'}
              >
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