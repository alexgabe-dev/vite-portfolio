import React from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  ChevronRight,
  Globe,
  Info,
  LayoutTemplate,
  LifeBuoy,
  Megaphone,
  ShieldCheck,
  ShoppingCart,
  Target,
  TrendingUp,
  Wrench
} from 'lucide-react';

interface Package {
  title: string;
  price: string;
  type: string;
  category: string;
  icon: React.ElementType;
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
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [expandedMobileCards, setExpandedMobileCards] = React.useState<Record<string, boolean>>({});
  const [currentMobileCard, setCurrentMobileCard] = React.useState(0);
  const mobileSliderRef = React.useRef<HTMLDivElement | null>(null);
  const formatForint = (amount: number) => `${amount.toLocaleString('hu-HU').replace(/\s/g, '.')} Ft`;
  const discountedMonthly = (monthlyPrice: number) => formatForint(Math.round(monthlyPrice * 0.8));

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const packages: PackageCategories = {
    web: [
      {
        title: "Launch Web Csomag",
        price: formatForint(189000),
        type: "-tól",
        category: "INDULÓ CSOMAG",
        icon: LayoutTemplate,
        features: [
          "1-4 oldalas modern, reszponzív weboldal",
          "Kulcsoldalak felépítése (Főoldal, Rólunk, Szolgáltatások, Kapcsolat)",
          "Technikai alap SEO beállítások",
          "Kapcsolati űrlap és mérési események bekötése",
          "Google Analytics 4 és Search Console integráció",
          "Alap sebességoptimalizálás",
          "Ingyenes SSL tanúsítvány és biztonsági alapbeállítás",
          "1 hónap garanciális karbantartás"
        ]
      },
      {
        title: "Premium Web Csomag",
        price: formatForint(329000),
        type: "-tól",
        category: "LEGNÉPSZERŰBB",
        icon: Globe,
        popular: true,
        features: [
          "Minden a Launch csomagból, plusz:",
          "Legfeljebb 12 oldalas weboldal struktúra",
          "Blog vagy tudástár modul",
          "Haladó on-page SEO (meta, schema, belső linkelés)",
          "Hírlevél-feliratkozás és automatizált e-mail indulás",
          "Egyedi CTA blokkok és konverziós szekciók",
          "Cookie banner és GDPR finomhangolás",
          "Alap CRM vagy időpontfoglaló integráció",
          "2 hónap garanciális karbantartás"
        ]
      },
      {
        title: "Corporate Web Csomag",
        price: formatForint(549000),
        type: "-tól",
        category: "HALADÓ CSOMAG",
        icon: ShoppingCart,
        features: [
          "Minden a Pro csomagból, plusz:",
          "Webshop vagy komplex szolgáltatói rendszer kialakítás",
          "Többnyelvű működés és tartalomstruktúra",
          "Fizetési és számlázási integrációk",
          "Haladó technikai SEO és Core Web Vitals optimalizáció",
          "Egyedi automatizmusok (ajánlatkérő, follow-up, lead kezelés)",
          "Fejlett biztonsági és hozzáférés-kezelési megoldások",
          "3 hónap garanciális karbantartás"
        ]
      }
    ],
    marketing: [
      {
        title: "Start Marketing Csomag",
        price: billingCycle === 'monthly' ? formatForint(89000) : discountedMonthly(89000),
        type: "/ hónap",
        category: "INDULÓ CSOMAG",
        icon: Megaphone,
        features: [
          "Social media menedzsment 2 platformon",
          "Heti 2-3 posztterv és kivitelezés",
          "Havi 1 kampány kreatív és szövegírás",
          "Google Cégem és helyi jelenlét optimalizálás",
          "Alap hirdetéskezelés (Meta vagy Google)",
          "Havi riport + 30 perces konzultáció"
        ]
      },
      {
        title: "Growth Marketing Csomag",
        price: billingCycle === 'monthly' ? formatForint(169000) : discountedMonthly(169000),
        type: "/ hónap",
        category: "LEGNÉPSZERŰBB",
        icon: TrendingUp,
        popular: true,
        features: [
          "Social media menedzsment 3 platformon",
          "Heti 4-5 poszt + havi tartalomnaptár",
          "Meta és Google Ads kampánykezelés",
          "Remarketing közönségek felépítése",
          "Landing oldal optimalizálási javaslatok",
          "Havi 2 SEO-optimalizált cikk vagy hírlevél",
          "Részletes havi riport + kétheti konzultáció"
        ]
      },
      {
        title: "Next Marketing Csomag",
        price: billingCycle === 'monthly' ? formatForint(289000) : discountedMonthly(289000),
        type: "/ hónap",
        category: "HALADÓ CSOMAG",
        icon: Target,
        features: [
          "Teljes funnel alapú marketing menedzsment",
          "Social media menedzsment 4 platformon",
          "Skálázott Meta + Google hirdetéskezelés",
          "Heti kreatív tesztelés (A/B üzenetek és ajánlatok)",
          "Lead magnet és e-mail automatizációs folyamatok",
          "Havi 4 tartalomanyag (cikk, hírlevél vagy esettanulmány)",
          "Dashboard + heti optimalizálási egyeztetés"
        ]
      }
    ],
    maintenance: [
      {
        title: "Secure Karbantartó Csomag",
        price: billingCycle === 'monthly' ? formatForint(29000) : discountedMonthly(29000),
        type: "/ hónap",
        category: "INDULÓ CSOMAG",
        icon: Wrench,
        features: [
          "Heti biztonsági mentés és verziófigyelés",
          "Rendszer, bővítmény és függőség frissítések",
          "Alap biztonsági ellenőrzések",
          "Havi 1 óra tartalmi módosítás",
          "E-mail support 48 órán belüli válasszal",
          "Havi állapotriport"
        ]
      },
      {
        title: "Business Karbantartó Csomag",
        price: billingCycle === 'monthly' ? formatForint(49000) : discountedMonthly(49000),
        type: "/ hónap",
        category: "LEGNÉPSZERŰBB",
        icon: ShieldCheck,
        popular: true,
        features: [
          "Napi biztonsági mentés és visszaállítási pontok",
          "Folyamatos biztonsági monitoring és riasztás",
          "Sebesség- és adatbázis-optimalizálás",
          "Havi 3 óra tartalmi vagy funkcionális módosítás",
          "SSL, domain és uptime felügyelet",
          "E-mail + telefon support prioritással",
          "Havi részletes technikai riport"
        ]
      },
      {
        title: "Fortress Karbantartó Csomag",
        price: billingCycle === 'monthly' ? formatForint(89000) : discountedMonthly(89000),
        type: "/ hónap",
        category: "HALADÓ CSOMAG",
        icon: LifeBuoy,
        features: [
          "24/7 monitoring, incidenskezelés és gyors hibaelhárítás",
          "Napi többpontos backup és automatikus restore terv",
          "Haladó WAF/DDoS védelem és hozzáférés-kezelés",
          "Folyamatos teljesítményhangolás és cache stratégia",
          "Havi 6 óra módosítás vagy fejlesztési támogatás",
          "Prioritásos support 4-8 órás reakcióidővel",
          "Heti riport és dedikált kapcsolattartás"
        ]
      }
    ]
  };

  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };
  const activePackages = packages[activeCategory as keyof typeof packages];
  const popularIndex = Math.max(activePackages.findIndex((pkg) => pkg.popular), 0);

  React.useEffect(() => {
    if (!isMobile || !mobileSliderRef.current) return;
    const slider = mobileSliderRef.current;
    setCurrentMobileCard(popularIndex);

    requestAnimationFrame(() => {
      const target = slider.querySelector(`[data-card-index="${popularIndex}"]`) as HTMLElement | null;
      target?.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
    });
  }, [activeCategory, billingCycle, isMobile]);

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
          className="text-center mb-10 md:mb-16"
          variants={fadeInUp}
          initial="initial"
          animate="animate">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Tervek az
            <span className="bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent"> Ön igényeire </span>
            szabva
          </h1>
          <p className="text-gray-400 text-xl md:text-lg max-w-2xl mx-auto">
            Válassza ki az Önnek legmegfelelőbb csomagot és kezdje el vállalkozása online jelenlétének kiépítését
          </p>
        </motion.div>

        {/* Category Selector */}
        <motion.div 
          className={`mb-8 md:mb-12 ${
            isMobile ? 'grid grid-cols-3 gap-2' : 'flex flex-wrap justify-center gap-2 md:gap-4'
          }`}
          variants={fadeInUp}
          initial="initial"
          animate="animate">
          {[
            { id: 'web', name: 'Webfejlesztés', icon: LayoutTemplate },
            { id: 'marketing', name: 'Marketing', icon: Megaphone },
            { id: 'maintenance', name: 'Karbantartás', icon: ShieldCheck }
          ].map((category) => (
            (() => {
              const CategoryIcon = category.icon;
              return (
            <motion.button
              type="button"
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`${
                isMobile ? 'px-2 py-2.5 text-[12px] leading-tight min-h-[46px]' : 'px-3 md:px-6 py-2.5 md:py-3'
              } rounded-xl font-semibold transition-all md:text-base ${
                activeCategory === category.id
                  ? 'bg-[#ff5c35] text-white shadow-[0_8px_20px_rgba(255,92,53,0.3)]'
                  : 'bg-[#1a1a2e] text-gray-300 hover:text-white border border-transparent hover:border-[#ff5c35]/30'
              }`}
              whileHover={!isMobile ? { scale: 1.05 } : undefined}
              whileTap={{ scale: 0.97 }}
              aria-label={`Switch to ${category.name} category`}
              aria-pressed={activeCategory === category.id}>
              {isMobile ? (
                <span>{category.name}</span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <CategoryIcon className="w-4 h-4" />
                  {category.name}
                </span>
              )}
            </motion.button>
              );
            })()
          ))}
        </motion.div>

        {/* Billing Cycle Selector */}
        {activeCategory !== 'web' && (
          <motion.div 
            className="flex justify-center mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate">
            <div className="w-full max-w-[420px] flex items-center justify-center gap-3 sm:gap-4 text-white">
              <button
                type="button"
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly')}
                className="inline-flex items-center gap-3 sm:gap-4"
                aria-label="Switch billing cycle"
                aria-pressed={billingCycle === 'annually'}>
                <span className={`text-lg font-medium transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
                  Havi
                </span>
                <span className="relative inline-flex w-[68px] h-[36px] bg-black rounded-full border border-white/15">
                  <motion.span
                    className="absolute top-[3px] left-[3px] w-[28px] h-[28px] rounded-full bg-white shadow-[0_3px_10px_rgba(0,0,0,0.35)]"
                    animate={{ x: billingCycle === 'annually' ? 32 : 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                </span>
                <span className={`text-lg font-medium transition-colors ${billingCycle === 'annually' ? 'text-white' : 'text-gray-400'}`}>
                  Éves
                </span>
              </button>
              <span className="text-xs sm:text-sm font-bold tracking-wide px-3 py-1.5 rounded-full bg-[#d35735] text-white whitespace-nowrap">
                -20% MEGTAKARÍTÁS
              </span>
            </div>
          </motion.div>
        )}
        {activeCategory !== 'web' && (
          <motion.p
            className="text-center text-sm text-gray-400 mb-8 md:mb-12 md:-mt-6 hidden md:block"
            variants={fadeInUp}
            initial="initial"
            animate="animate">
            Éves számlázással automatikusan
            <span className="text-[#ff8f35] font-semibold"> 20% kedvezmény </span>
            jár minden havi díjas csomagra.
          </motion.p>
        )}

        {/* Packages Grid */}
        {isMobile ? (
          <>
            <div
              ref={mobileSliderRef}
              onScroll={(e) => {
                const el = e.currentTarget;
                const firstCard = el.querySelector('[data-card-index="0"]') as HTMLElement | null;
                if (!firstCard) return;
                const cardWidth = firstCard.offsetWidth + 16;
                const nextIndex = Math.round(el.scrollLeft / cardWidth);
                const bounded = Math.min(Math.max(nextIndex, 0), activePackages.length - 1);
                if (bounded !== currentMobileCard) setCurrentMobileCard(bounded);
              }}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pt-2 pb-2 -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {activePackages.map((pkg, index) => {
                const PackageIcon = pkg.icon;
                const cardKey = `${activeCategory}-${index}`;
                const isExpanded = expandedMobileCards[cardKey] ?? false;
                const featuresToShow = isExpanded ? pkg.features : pkg.features.slice(0, 5);
                const remainingFeatures = pkg.features.length - featuresToShow.length;

                return (
                  <motion.div
                    key={index}
                    data-card-index={index}
                    className={`snap-center min-w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] relative bg-[#1a1a2e] rounded-2xl border transition-all ${
                      pkg.popular
                        ? 'border-[#ff5c35] shadow-lg shadow-[#ff5c35]/20'
                        : 'border-gray-800/50'
                    }`}
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: index * 0.1 }}>
                    <div className="p-6">
                      {pkg.popular && (
                        <div className="mb-3">
                          <span className="inline-flex bg-[#ff5c35] text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Legnépszerűbb
                          </span>
                        </div>
                      )}
                      {!pkg.popular && (
                        <div className="text-sm font-medium text-[#ff5c35] mb-2">{pkg.category}</div>
                      )}
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2.5">
                        <span className="inline-flex p-1.5 rounded-lg bg-[#ff5c35]/15 border border-[#ff5c35]/20">
                          <PackageIcon className="w-4 h-4 text-[#ff8f35]" />
                        </span>
                        <span>{pkg.title}</span>
                      </h3>
                      <div className="flex items-baseline mb-5 space-x-2">
                        <span className="text-3xl font-bold">{pkg.price}</span>
                        <span className="text-gray-400 text-sm">{pkg.type}</span>
                      </div>

                      <motion.button
                        className={`w-full px-5 py-3 rounded-lg font-semibold mb-6 transition-all ${
                          pkg.popular
                            ? 'bg-[#ff5c35] text-white hover:bg-[#ff5c35]/90'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        whileTap={{ scale: 0.98 }}>
                        {pkg.popular ? 'Kezdés most' : 'Ajánlatkérés'}
                      </motion.button>

                      <ul className="space-y-3">
                        {featuresToShow.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-gray-300">
                            <Check className="w-5 h-5 text-[#ff5c35] mt-1 mr-3 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {pkg.features.length > 5 && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedMobileCards((prev) => ({ ...prev, [cardKey]: !isExpanded }))
                          }
                          className="mt-4 text-sm font-semibold text-[#ff8f35] hover:text-[#ff5c35] transition-colors">
                          {isExpanded ? 'Kevesebb megjelenítése' : `Még ${remainingFeatures} szolgáltatás`}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-2 mt-4 mb-2">
              {activePackages.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  type="button"
                  onClick={() => {
                    const slider = mobileSliderRef.current;
                    if (!slider) return;
                    const target = slider.querySelector(`[data-card-index="${index}"]`) as HTMLElement | null;
                    target?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    setCurrentMobileCard(index);
                  }}
                  className={`h-2.5 rounded-full transition-all ${
                    currentMobileCard === index ? 'w-6 bg-[#ff5c35]' : 'w-2.5 bg-white/30'
                  }`}
                  aria-label={`Ugrás a(z) ${index + 1}. csomagra`}
                />
              ))}
            </div>
            <p className="text-center text-xs text-gray-400">
              {currentMobileCard + 1} / {activePackages.length}
            </p>
          </>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {activePackages.map((pkg, index) => {
              const PackageIcon = pkg.icon;
              return (
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
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2.5">
                      <span className="inline-flex p-2 rounded-lg bg-[#ff5c35]/15 border border-[#ff5c35]/20">
                        <PackageIcon className="w-5 h-5 text-[#ff8f35]" />
                      </span>
                      <span>{pkg.title}</span>
                    </h3>
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
              );
            })}
          </div>
        )}

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
              <h2 className="text-2xl font-bold mb-2">Egyedi igényeid vannak?</h2>
              <p className="text-gray-400 mb-6">
                Amennyiben a fenti csomagok nem fedik le teljesen az igényeidet, keress engem bizalommal! 
              </p>
              <p className="text-gray-400 mb-6">
                Garantálom hogy az egyedi problémáidra személyre szabott megoldást találok a vállalkozásod számára.
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
