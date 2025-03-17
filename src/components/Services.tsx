import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Code, Paintbrush, Rocket, Cog, BarChart, Globe, Shield, 
  Zap, MessageSquare, Search, Share2, Database, Laptop,
  MonitorSmartphone, Sparkles, Coffee, Phone, Mail
} from 'lucide-react';
import ProgressBar from './ProgressBar';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  benefits: string[];
  technologies?: string[];
}

const Services = () => {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [coffeeCount, setCoffeeCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleCoffeeClick = () => {
    setCoffeeCount(prev => prev + 1);
    if (coffeeCount + 1 === 5) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 3000);
    }
  };

  const services: Service[] = [
    {
      id: 'webdev',
      title: 'Webfejlesztés és Weboldalkészítés',
      description: 'Kreatív és egyedi webfejlesztési szolgáltatásaink keretében olyan weboldalakat készítünk, amelyek a legújabb webdesign trendeket, a reszponzív kialakítást és a modern UI/UX megoldásokat ötvözik.',
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
      title: 'Digitális Marketing',
      description: 'Digitális marketing szolgáltatásaink segítségével növelheti márkája online láthatóságát, ügyfélkörét és bevételeit. Átfogó megoldásaink között megtalálhatóak a PPC kampányok, social media marketing, tartalommarketing és remarketing stratégiák is.',
      icon: BarChart,
      features: [
        'PPC Express, Pro és Elite csomagok',
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
        'Erősebb márkaismertség',

      ],
      technologies: ['Google Ads', 'Facebook Ads', 'Instagram', 'LinkedIn', 'Google Analytics', 'Meta Business Suite']
    },
    {
      id: 'seo',
      title: 'Keresőoptimalizálás (SEO)',
      description: 'A keresőoptimalizálás az online siker egyik alappillére. SEO szakértőink átfogó stratégiát dolgoznak ki, hogy weboldala a Google keresőoptimalizálás és a kulcsszavak optimalizálása révén az első találatok között szerepeljen.',
      icon: Search,
      features: [
        'Technikai SEO elemzés és optimalizálás',
        'On-page és Off-page SEO',
        'Kulcsszókutatás és optimalizálás',
        'Tartalom SEO',
        'Linképítési stratégiák',
        'Teljesítmény monitoring',
        'Backlink elemzés',
        'On-site SEO',
        'Off-site SEO'
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
      title: 'Weboldal Karbantartás',
      description: 'A professzionális weboldal karbantartás elengedhetetlen a zavartalan működés és a biztonságos online jelenlét érdekében. Szolgáltatásunk biztosítja weboldala folyamatos és biztonságos működését.',
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

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-24 relative overflow-hidden">
      {/* Modern Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#ff5c35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-[#ff8f35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-[25%] w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <ProgressBar />

      {/* Easter Egg */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showEasterEgg ? 1 : 0, y: showEasterEgg ? 0 : 20 }}
        className="fixed bottom-4 right-4 bg-[#ff5c35] text-white p-4 rounded-lg shadow-lg z-50">
        <p className="text-sm font-medium">☕️ Kávészünet! Megérdemled!</p>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <h1 className="text-5xl font-bold mb-6">
            Szolgáltatásaink
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
            Fedezd fel átfogó szolgáltatásaimat, amelyek segítenek vállalkozásod digitális növekedésében. Modern megoldásaim révén versenyelőnyhöz juthatsz az online térben.
          </p>
          <div className="w-24 h-1 bg-[#ff5c35] mx-auto"></div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                className={`bg-[#1a1a2e]/80 backdrop-blur-sm p-8 rounded-2xl border transition-all cursor-pointer ${
                  activeService === service.id
                    ? 'border-[#ff5c35] shadow-lg shadow-[#ff5c35]/20'
                    : 'border-gray-800/50 hover:border-[#ff5c35]/30'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveService(activeService === service.id ? null : service.id)}
                whileHover={{ y: -5 }}>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#ff5c35]/20 rounded-xl">
                    <Icon className="w-6 h-6 text-[#ff5c35]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-400 mb-4">{service.description}</p>
                    
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: activeService === service.id ? 'auto' : 0,
                        opacity: activeService === service.id ? 1 : 0
                      }}
                      className="overflow-hidden">
                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <h4 className="font-semibold text-[#ff5c35] mb-3">Szolgáltatásaim</h4>
                          <ul className="space-y-2">
                            {service.features.map((feature, idx) => (
                              <motion.li
                                key={idx}
                                className="flex items-start text-gray-300"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}>
                                <Sparkles className="w-5 h-5 text-[#ff5c35] mt-1 mr-2 flex-shrink-0" />
                                <span>{feature}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#ff5c35] mb-3">Előnyök</h4>
                          <ul className="space-y-2">
                            {service.benefits.map((benefit, idx) => (
                              <motion.li
                                key={idx}
                                className="flex items-start text-gray-300"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}>
                                <Rocket className="w-5 h-5 text-[#ff5c35] mt-1 mr-2 flex-shrink-0" />
                                <span>{benefit}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {service.technologies && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-[#ff5c35] mb-3">Technológiák</h4>
                          <div className="flex flex-wrap gap-2">
                            {service.technologies.map((tech, idx) => (
                              <motion.span
                                key={idx}
                                className="px-3 py-1 bg-[#ff5c35]/10 text-[#ff5c35] rounded-full text-sm"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}>
                                {tech}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Why Choose Us Section */}
        <motion.div
          className="bg-[#1a1a2e]/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}>
          <h2 className="text-3xl font-bold mb-6">Miért válassz engem?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-[#ff5c35]/20 rounded-lg">
                  <Shield className="w-5 h-5 text-[#ff5c35]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Professzionális megoldások</h3>
                  <p className="text-gray-400">A legmodernebb technológiákat alkalmazzom.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-[#ff5c35]/20 rounded-lg">
                  <Zap className="w-5 h-5 text-[#ff5c35]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Teljes körű szolgáltatás</h3>
                  <p className="text-gray-400">Minden digitális megoldást egy helyen kínálok.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-[#ff5c35]/20 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-[#ff5c35]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Átlátható kommunikáció</h3>
                  <p className="text-gray-400">Folyamatos támogatás és gyors válaszidő minden kérdésre.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-[#ff5c35]/20 rounded-lg">
                  <Share2 className="w-5 h-5 text-[#ff5c35]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Egyedi megközelítés</h3>
                  <p className="text-gray-400">Személyre szabott megoldások az igényeid szerint.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="bg-[#1a1a2e]/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}>
          <h2 className="text-3xl font-bold mb-4">
            Kezdjük el a közös munkát!
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Ne várj tovább, kezdd el a digitális sikert még ma! Kérj személyre szabott INGYENES árajánlatot szolgáltatásaimra!
          </p>
          <motion.a
            href="/kapcsolat"
            className="inline-flex items-center px-8 py-4 bg-[#ff5c35] text-white rounded-lg font-semibold text-lg hover:bg-[#ff5c35]/90 transition-colors shadow-lg shadow-[#ff5c35]/20"
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(255, 92, 53, 0.3)' }}
            whileTap={{ scale: 0.98 }}>
            <Rocket className="w-6 h-6 mr-2" />
            Ajánlatkérés
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default Services; 