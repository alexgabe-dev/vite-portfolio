import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  ChevronDown,
  Check,
  Code,
  Cog,
  MessageSquare,
  Rocket,
  Search,
  Share2,
  Shield,
  Zap
} from 'lucide-react';
import ProgressBar from './ProgressBar';

interface Service {
  id: string;
  shortTitle: string;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  benefits: string[];
  technologies?: string[];
}

const services: Service[] = [
  {
    id: 'webdev',
    shortTitle: 'Webfejlesztés',
    title: 'Webfejlesztés és Weboldalkészítés',
    description:
      'Modern, gyors és konverzióra épített weboldalak tervezése és fejlesztése, amelyek minden eszközön profi élményt nyújtanak.',
    icon: Code,
    features: [
      'Egyedi dizájn tervezés és kivitelezés',
      'WordPress és egyedi fejlesztés',
      'Mobilbarát, reszponzív kialakítás',
      'Modern UI/UX megoldások',
      'Teljes körű webfejlesztés',
      'E-commerce megoldások'
    ],
    benefits: [
      'Egyedi arculat és üzenet kiemelése',
      'Professzionális, modern megjelenés',
      'Kiváló felhasználói élmény minden eszközön',
      'Gyors betöltési idő',
      'SEO-barát struktúra'
    ],
    technologies: ['React', 'Next.js', 'WordPress', 'WooCommerce', 'TailwindCSS', 'TypeScript']
  },
  {
    id: 'marketing',
    shortTitle: 'Marketing',
    title: 'Digitális Marketing',
    description:
      'Átgondolt marketing stratégiák és kampánykezelés, amelyek mérhetően növelik az elérést, érdeklődőszámot és bevételt.',
    icon: BarChart,
    features: [
      'PPC kampánykezelés',
      'Social Media Marketing kampányok',
      'Tartalommarketing stratégia',
      'Email marketing kampányok',
      'Remarketing megoldások',
      'Konverzió optimalizálás'
    ],
    benefits: [
      'Növekvő online láthatóság',
      'Célzott ügyfélszerzés',
      'Mérhető eredmények',
      'Magasabb konverziós ráta',
      'Erősebb márkaismertség'
    ],
    technologies: ['Google Ads', 'Facebook Ads', 'Instagram', 'LinkedIn', 'Google Analytics', 'Meta Business Suite']
  },
  {
    id: 'seo',
    shortTitle: 'SEO',
    title: 'Keresőoptimalizálás (SEO)',
    description:
      'Technikai és tartalmi SEO folyamatok, amelyek segítenek jobb helyezéseket és stabil, organikus forgalmat elérni.',
    icon: Search,
    features: [
      'Technikai SEO elemzés és optimalizálás',
      'On-page és Off-page SEO',
      'Kulcsszókutatás és optimalizálás',
      'Tartalom SEO',
      'Linképítési stratégiák',
      'Teljesítmény monitoring'
    ],
    benefits: [
      'Jobb keresési pozíciók',
      'Növekvő organikus forgalom',
      'Minőségi látogatók',
      'Hosszú távú eredmények',
      'Költséghatékony megoldás'
    ],
    technologies: ['SEMrush', 'Ahrefs', 'Google Search Console', 'Google Analytics', 'Screaming Frog', 'Moz Pro']
  },
  {
    id: 'maintenance',
    shortTitle: 'Karbantartás',
    title: 'Weboldal Karbantartás',
    description:
      'Folyamatos felügyelet, biztonsági frissítések és teljesítmény-optimalizálás a stabil, üzembiztos működésért.',
    icon: Cog,
    features: [
      'Rendszeres szoftverfrissítések',
      'Biztonsági mentések készítése',
      'Teljesítmény optimalizálás',
      'Biztonsági monitoring',
      'Hibajavítás és támogatás',
      '24/7 felügyelet'
    ],
    benefits: [
      'Biztonságos működés',
      'Gyors betöltési idő',
      'Minimális állásidő',
      'Naprakész rendszerek',
      'Folyamatos támogatás'
    ],
    technologies: ['CloudFlare', 'WP Engine', 'Sucuri', 'Google PageSpeed', 'GTmetrix', 'Uptime Robot']
  }
];

const Services = () => {
  const [openServiceId, setOpenServiceId] = useState<string>('');
  const headerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const scrollToTarget = (target: HTMLElement | null) => {
    if (!target) return;
    const y = window.scrollY + target.getBoundingClientRect().top - 96;
    window.scrollTo({ top: Math.max(y, 0), behavior: 'smooth' });
  };

  const handleToggleService = (serviceId: string) => {
    const isClosing = openServiceId === serviceId;

    if (isClosing) {
      setOpenServiceId('');
      requestAnimationFrame(() => {
        scrollToTarget(headerRefs.current[serviceId]);
      });
      return;
    }

    setOpenServiceId(serviceId);
    setTimeout(() => {
      scrollToTarget(headerRefs.current[serviceId]);
    }, 220);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#ff5c35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-[#ff8f35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-[25%] w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <ProgressBar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6">Szolgáltatásaink</h1>
          <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto mb-6 md:mb-8">
            Válassz területet, és nézd meg gyorsan, mit kapsz, milyen eredményt várhatsz, és milyen technológiával dolgozom.
          </p>
          <div className="w-24 h-1 bg-[#ff5c35] mx-auto"></div>
        </motion.div>

        <div className="space-y-4 mb-12">
          {services.map((service) => {
            const Icon = service.icon;
            const isOpen = openServiceId === service.id;

            return (
              <motion.article
                key={service.id}
                className={`bg-[#1a1a2e]/85 backdrop-blur-sm rounded-2xl border transition-all ${
                  isOpen ? 'border-[#ff5c35]/50 shadow-lg shadow-[#ff5c35]/15' : 'border-gray-800/60'
                }`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}>
                <button
                  type="button"
                  ref={(el) => {
                    headerRefs.current[service.id] = el;
                  }}
                  onClick={() => handleToggleService(service.id)}
                  className="w-full text-left p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${isOpen ? 'bg-[#ff5c35]/20' : 'bg-[#ff5c35]/10'}`}>
                      <Icon className={`w-6 h-6 ${isOpen ? 'text-[#ff8f35]' : 'text-[#ff6f45]'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl md:text-3xl font-bold mb-1">{service.title}</h2>
                      <p className="text-gray-400 text-sm md:text-base pr-4">{service.description}</p>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 mt-1 text-gray-300 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#ff8f35]' : ''
                      }`}
                    />
                  </div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0
                  }}
                  transition={{ duration: 0.28 }}
                  className="overflow-hidden">
                  <div className="px-5 pb-6 md:px-6 md:pb-7 border-t border-white/5">
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8 pt-5">
                      <div>
                        <h3 className="font-semibold text-[#ff8f35] mb-3">Mit tartalmaz?</h3>
                        <ul className="space-y-2.5">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-gray-200 text-sm md:text-base">
                              <Check className="w-4 h-4 text-[#ff8f35] mt-1 mr-2.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-[#ff8f35] mb-3">Üzleti előnyök</h3>
                        <ul className="space-y-2.5 mb-6">
                          {service.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start text-gray-200 text-sm md:text-base">
                              <Rocket className="w-4 h-4 text-[#ff8f35] mt-1 mr-2.5 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                        {!!service.technologies?.length && (
                          <>
                            <h3 className="font-semibold text-[#ff8f35] mb-3">Technológiák</h3>
                            <div className="flex flex-wrap gap-2">
                              {service.technologies.map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-[#ff8f35]/10 text-[#ffb17a] rounded-full text-xs md:text-sm">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          className="bg-[#1a1a2e]/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-gray-800/50 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Miért válassz engem?</h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-[#ff5c35]/20 rounded-lg">
                  <Shield className="w-5 h-5 text-[#ff5c35]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Professzionális megoldások</h3>
                  <p className="text-gray-400 text-sm md:text-base">A legmodernebb technológiákat alkalmazom.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-[#ff5c35]/20 rounded-lg">
                  <Zap className="w-5 h-5 text-[#ff5c35]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Teljes körű szolgáltatás</h3>
                  <p className="text-gray-400 text-sm md:text-base">Minden digitális megoldást egy helyen kínálok.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-[#ff5c35]/20 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-[#ff5c35]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Átlátható kommunikáció</h3>
                  <p className="text-gray-400 text-sm md:text-base">Folyamatos támogatás és gyors válaszidő minden kérdésre.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-[#ff5c35]/20 rounded-lg">
                  <Share2 className="w-5 h-5 text-[#ff5c35]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Egyedi megközelítés</h3>
                  <p className="text-gray-400 text-sm md:text-base">Személyre szabott megoldások az igényeid szerint.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-[#1a1a2e]/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-gray-800/50 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Kezdjük el a közös munkát!</h2>
          <p className="text-gray-400 mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base">
            Kérj személyre szabott, ingyenes árajánlatot, és megmutatom, melyik irány hozza a legjobb eredményt a vállalkozásodnak.
          </p>
          <motion.a
            href="/kapcsolat"
            className="inline-flex items-center px-7 py-3 md:px-8 md:py-4 bg-[#ff5c35] text-white rounded-lg font-semibold text-base md:text-lg hover:bg-[#ff5c35]/90 transition-colors shadow-lg shadow-[#ff5c35]/20"
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(255, 92, 53, 0.3)' }}
            whileTap={{ scale: 0.98 }}>
            <Rocket className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            Ajánlatkérés
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
