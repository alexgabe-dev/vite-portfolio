import React, { memo, useMemo } from 'react';
import { motion, LazyMotion, domAnimation } from 'framer-motion';
import { Users, Target, Award, Rocket, ChevronRight, Code, Palette, Globe, Lightbulb, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import CountUp, { CountUpProps } from 'react-countup';

// Memoizált CountUp komponens típusdefinícióval
interface MemoizedCountUpProps extends CountUpProps {
  end: number;
  suffix?: string;
  duration?: number;
}

const MemoizedCountUp = memo(({ end, suffix = "", duration = 2.5, ...props }: MemoizedCountUpProps) => (
  <CountUp
    end={end}
    suffix={suffix}
    duration={duration}
    enableScrollSpy
    scrollSpyOnce
    {...props}
  />
));

MemoizedCountUp.displayName = 'MemoizedCountUp';

// Képek importálása
import teamMember1 from '../assets/images/team/member1.webp';
import teamMember2 from '../assets/images/team/member2.webp';
import teamMember3 from '../assets/images/team/member3.webp';

const About = () => {
  // Memoizált animációk
  const fadeInUp = useMemo(() => ({
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  }), []);

  const staggerChildren = useMemo(() => ({
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  // Memoizált csapattagok adatok
  const teamMembers = useMemo(() => [
    {
      name: "Kovács Péter",
      role: "Vezető Fejlesztő",
      image: teamMember1,
      description: "10+ év tapasztalat webfejlesztésben"
    },
    {
      name: "Nagy Anna",
      role: "UI/UX Designer",
      image: teamMember2,
      description: "Kreatív design megoldások szakértője"
    },
    {
      name: "Kiss Tamás",
      role: "Marketing Specialista",
      image: teamMember3,
      description: "Digital marketing stratégia specialista"
    }
  ], []);

  // Memoizált statisztikák
  const stats = useMemo(() => [
    { number: 150, suffix: "+", label: "Sikeres Projekt", icon: Rocket },
    { number: 98, suffix: "%", label: "Elégedett Ügyfél", icon: Users },
    { number: 5, suffix: "+", label: "Év Tapasztalat", icon: Award },
    { number: 24, suffix: "/7", label: "Ügyfélszolgálat", icon: Target }
  ], []);

  const services = [
    {
      icon: Code,
      title: "Modern Technológiák",
      description: "A legújabb webes technológiákat használjuk a fejlesztés során, hogy ügyfeleink mindig a legjobb megoldást kapják."
    },
    {
      icon: Palette,
      title: "Egyedi Design",
      description: "Minden projektünk egyedileg tervezett, az ügyfél brandjéhez és igényeihez igazítva."
    },
    {
      icon: Globe,
      title: "Nemzetközi Tapasztalat",
      description: "Számos nemzetközi projektben vettünk részt, így széles körű tapasztalattal rendelkezünk."
    }
  ];

  return (
    <LazyMotion features={domAnimation}>
      <motion.div
        className="container mx-auto px-4 py-16"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeInUp}
      >
        {/* Modern Background Effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#ff5c35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
          <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-[#ff8f35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-[25%] w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-24"
            variants={fadeInUp}
            initial="initial"
            animate="animate">
            <h1 className="text-5xl font-bold mb-6">
              Ismerd meg a
              <span className="bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent"> csapatunkat</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Szenvedélyes szakemberek csapata, akik elkötelezettek abban, hogy ügyfeleink digitális álmait valósággá váltsák
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
            variants={staggerChildren}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={fadeInUp}
              >
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-[#ff8f35]" />
                <div className="text-3xl font-bold text-white mb-2">
                  <MemoizedCountUp
                    end={stat.number}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Values */}
          <motion.div 
            className="mb-20"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}>
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center"
              variants={fadeInUp}>
              Értékeink
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Lightbulb className="w-8 h-8 text-[#ff5c35]" />,
                  title: "Innováció",
                  description: "Folyamatosan keressem az új technológiai megoldásokat",
                  gradient: "from-blue-500/20 to-purple-500/20",
                  features: ["Új technológiák", "Kreatív megoldások", "Folyamatos fejlődés"]
                },
                {
                  icon: <Handshake className="w-8 h-8 text-[#ff5c35]" />,
                  title: "Megbízhatóság",
                  description: "Amit megígérek, azt időben és kiváló minőségben teljesítem, ezt garantálni tudom",
                  gradient: "from-orange-500/20 to-red-500/20",
                  features: ["Pontos határidők", "Minőségi szolgáltatás", "Megbízható partner"]
                },
                {
                  icon: <Target className="w-8 h-8 text-[#ff5c35]" />,
                  title: "Eredményorientáltság",
                  description: "A mérhető, valós üzleti eredmények elérése a célom",
                  gradient: "from-green-500/20 to-teal-500/20",
                  features: ["Mérhető eredmények", "Üzleti növekedés", "ROI fókusz"]
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  variants={fadeInUp}>
                    <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl ${value.gradient}`}></div>
                    <div className="relative bg-[#1a1a2e] p-8 rounded-xl border border-gray-800/50 group-hover:border-[#ff5c35]/30 transition-all duration-500">
                      <motion.div 
                        className="w-14 h-14 bg-gradient-to-br from-[#ff5c35]/20 to-[#ff5c35]/10 rounded-lg flex items-center justify-center mb-6 text-[#ff5c35] group-hover:scale-110 transition-transform duration-500">
                        {value.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[#ff5c35] transition-colors duration-300">
                        {value.title}
                      </h3>
                      <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                        {value.description}
                      </p>
                      <ul className="space-y-3">
                        {value.features.map((feature, idx) => (
                          <motion.li 
                            key={idx}
                            className="flex items-center text-gray-400 group-hover:text-gray-300"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            whileHover={{ x: 5 }}>
                            <ChevronRight size={16} className="text-[#ff5c35] mr-2" />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>

          {/* Statistics Section */}
          <motion.div 
            className="mb-24"
            variants={fadeInUp}
            initial="initial"
            animate="animate">
            <h2 className="text-3xl font-bold text-center mb-12">
              Miért fontos a
              <span className="bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent"> weboldalad?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto text-center mb-16">
              Sok kisvállalkozás alulértékeli weboldalát, ami
              <span className="text-[#ff5c35]"> milliós értékű elveszett lehetőségekhez</span> vezethet.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <motion.div
                className="bg-[#1a1a2e]/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50"
                whileHover={{ y: -5, borderColor: '#ff5c35' }}
                transition={{ duration: 0.2 }}>
                <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent">88%</h3>
                <p className="text-gray-400">az online vásárlók közül nem tér vissza egy rossz élmény után</p>
              </motion.div>
              <motion.div
                className="bg-[#1a1a2e]/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50"
                whileHover={{ y: -5, borderColor: '#ff5c35' }}
                transition={{ duration: 0.2 }}>
                <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent">75%</h3>
                <p className="text-gray-400">a felhasználók a weboldal alapján ítéli meg a cég hitelességét</p>
              </motion.div>
              <motion.div
                className="bg-[#1a1a2e]/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50"
                whileHover={{ y: -5, borderColor: '#ff5c35' }}
                transition={{ duration: 0.2 }}>
                <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent">61%</h3>
                <p className="text-gray-400">a felhasználók elhagyja a mobilon rosszul működő oldalt</p>
              </motion.div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                className="bg-[#1a1a2e]/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50"
                whileHover={{ y: -5, borderColor: '#ff5c35' }}
                transition={{ duration: 0.2 }}>
                <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent">8/10</h3>
                <p className="text-gray-400">felhasználó abbahagyja a böngészést, ha az oldal nem jelenik meg megfelelően</p>
              </motion.div>
              <motion.div
                className="bg-[#1a1a2e]/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50"
                whileHover={{ y: -5, borderColor: '#ff5c35' }}
                transition={{ duration: 0.2 }}>
                <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent">94%</h3>
                <p className="text-gray-400">a negatív visszajelzések a weboldal dizájnjával kapcsolatosak</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Services Section */}
          <motion.div 
            className="mb-24"
            variants={fadeInUp}
            initial="initial"
            animate="animate">
            <h2 className="text-3xl font-bold text-center mb-12">
              Amiben
              <span className="bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent"> kiemelkedünk</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-[#1a1a2e]/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50"
                  whileHover={{ y: -5, borderColor: '#ff5c35' }}
                  transition={{ duration: 0.2 }}>
                  <motion.div
                    className="w-12 h-12 mb-6 bg-[#ff5c35]/20 rounded-xl flex items-center justify-center"
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 92, 53, 0.3)' }}>
                    {React.createElement(service.icon, { className: "w-6 h-6 text-[#ff5c35]" })}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-400">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            variants={staggerChildren}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 text-center"
                variants={fadeInUp}
              >
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={128}
                    height={128}
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-[#ff8f35] mb-2">{member.role}</p>
                <p className="text-gray-400">{member.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="mt-24 text-center"
            variants={fadeInUp}
            initial="initial"
            animate="animate">
            <h2 className="text-3xl font-bold mb-6">
              Készen állsz a
              <span className="bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent"> következő lépésre?</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Vedd fel velünk a kapcsolatot és beszéljük meg, hogyan tudunk segíteni a projektedben
            </p>
            <Link to="/kapcsolat" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <motion.button
                className="inline-flex items-center px-8 py-4 bg-[#ff5c35] text-white rounded-lg font-semibold hover:bg-[#ff5c35]/90 transition-colors group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Contact us to discuss your project">
                Kapcsolatfelvétel
                <ChevronRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </LazyMotion>
  );
};

export default memo(About);