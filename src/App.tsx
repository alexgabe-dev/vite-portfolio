import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Code, BarChart, Settings, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, 
  Globe, Box, Palette, FileCode, Layout, CircuitBoard, Blocks, Laptop, Braces, Workflow, FileJson } from 'lucide-react';
import { motion, AnimatePresence, useInView, useSpring, useTransform } from 'framer-motion';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Packages from './components/Packages';
import About from './components/About';
import Contact from './components/Contact';
import Services from './components/Services';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [selectedTechs, setSelectedTechs] = React.useState<string[]>([]);
  const [currentPackage, setCurrentPackage] = React.useState(0);
  const [clickCount, setClickCount] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Reset to popular package when switching to mobile
      if (window.innerWidth < 768) {
        setCurrentPackage(1);
      } else {
        setCurrentPackage(0);
      }
    };

    // Set initial package based on screen size
    if (window.innerWidth < 768) {
      setCurrentPackage(1);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleTechSelection = (techName: string) => {
    setSelectedTechs(prev => 
      prev.includes(techName) 
        ? prev.filter(tech => tech !== techName)
        : [...prev, techName]
    );
  };

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

  const packages = [
    {
      title: "Alap Weboldal Csomag",
      price: "125.000 Ft",
      type: "Egyszeri díj",
      features: [
        "Egyedi dizájn",
        "WordPress testreszabás",
        "Interaktív űrlapok",
        "SEO-barát tartalom",
        "Reszponzív megjelenés"
      ],
      isPopular: false
    },
    {
      title: "Közép Csomag",
      price: "225.000 Ft",
      type: "Egyszeri díj",
      features: [
        "Az Alap csomag minden eleme",
        "E-commerce integráció",
        "Kiterjesztett oldalstruktúra",
        "Fejlettebb animációk",
        "Haladó SEO optimalizálás",
        "Részletes analitikai eszközök"
      ],
      isPopular: true
    },
    {
      title: "Prémium Csomag",
      price: "375.000 Ft-tól",
      type: "Egyedi árazás",
      features: [
        "Teljes körű fejlesztések",
        "Komplex modulok, CRM",
        "Dedikált technikai támogatás",
        "Marketing tanácsadás",
        "Egyedi kampányok"
      ],
      isPopular: false
    }
  ];

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -threshold || velocity < -500) {
      if (currentPackage < packages.length - 1) setCurrentPackage(prev => prev + 1);
    } else if (offset > threshold || velocity > 500) {
      if (currentPackage > 0) setCurrentPackage(prev => prev - 1);
    }
  };

  const navigation = [
    { name: 'Főoldal', path: '/' },
    { name: 'Szolgáltatások', path: '/szolgaltatasok' },
    { name: 'Rólunk', path: '/rolunk' },
    { name: 'Kapcsolat', path: '/kapcsolat' }
  ];

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <main>
            {/* Hero Section */}
            <motion.section 
              id="home" 
              className="relative min-h-screen flex items-center pt-16 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}>
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#0a0a0f] via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-[#0a0a0f] via-transparent to-transparent opacity-80"></div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')] bg-cover bg-center opacity-10"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  variants={staggerChildren}
                  initial="initial"
                  animate="animate">
                  <motion.h1 
                    className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                    variants={fadeInUp}>
                    Növekedés <br />minden <br /><span className="text-[#ff5c35]">kattintással</span>
                  </motion.h1>
                  <motion.p 
                    className="text-xl mb-8 text-gray-400 max-w-lg"
                    variants={fadeInUp}>
                  Weboldalak, digitális marketing és automatizált megoldások, amelyek lenyűgözik a látogatókat és növelik a bevételt.
                  </motion.p>
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4"
                    variants={fadeInUp}>
                    <motion.button 
                      className="primary-button"
                      whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgb(255, 92, 53)" }}
                      whileTap={{ scale: 0.95 }}>
                      Ajánlatkérés
                    </motion.button>
                    <motion.button 
                      className="secondary-button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}>
                    Beszéljen szakértőnkkel
                    </motion.button>
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="hidden md:block relative"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}>
                <div className="relative w-full h-[400px]">
                    <motion.div 
                      className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-lg transform"
                      animate={{ 
                        rotate: [12, 0, 12],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 20, 
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div 
                      className="absolute right-20 top-40 w-48 h-48 bg-gradient-to-br from-[#16213e] to-[#1a1a2e] rounded-lg transform"
                      animate={{ 
                        rotate: [-12, 0, -12],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 15, 
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div 
                      className="absolute right-40 top-20 w-32 h-32 bg-[#ff5c35] rounded-full shadow-lg shadow-[#ff5c35]/20 cursor-pointer"
                      animate={
                        clickCount === 4
                          ? {
                              scale: [1.5, 2, 0.5, 1],
                              opacity: [1, 1, 0.8, 1],
                              rotate: [0, 180, 360, 0],
                              boxShadow: [
                                "0 0 20px rgba(255, 92, 53, 0.4)",
                                "0 0 40px rgba(255, 92, 53, 0.6)",
                                "0 0 60px rgba(255, 92, 53, 0.2)",
                                "0 0 20px rgba(255, 92, 53, 0.2)"
                              ]
                            }
                          : {
                              scale: 1 + (clickCount * 0.2),
                              y: [0, -20, 0],
                              boxShadow: `0 0 ${20 + (clickCount * 10)}px rgba(255, 92, 53, ${0.2 + (clickCount * 0.1)})`
                            }
                      }
                      transition={
                        clickCount === 4
                          ? {
                              duration: 0.8,
                              ease: "easeInOut",
                              times: [0, 0.4, 0.7, 1],
                              onComplete: () => setClickCount(0)
                            }
                          : {
                              y: {
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              },
                              scale: {
                                duration: 0.3,
                                ease: "easeOut"
                              }
                            }
                      }
                      onClick={() => {
                        setClickCount(prev => (prev + 1) % 5);
                      }}
                      whileHover={{
                        scale: 1 + (clickCount * 0.2) + 0.05,
                        boxShadow: `0 0 ${25 + (clickCount * 10)}px rgba(255, 92, 53, ${0.3 + (clickCount * 0.1)})`
                      }}
                    />
                </div>
                </motion.div>
              </div>
            </motion.section>

            {/* Services Section */}
            <motion.section 
              id="services" 
              className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0f0f17] relative overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>
              {/* Background decoration */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-[#ff5c35]/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#ff5c35]/10 to-transparent"></div>
              </div>
              
              <div className="max-w-7xl mx-auto relative z-10">
                <motion.div 
                  className="text-center mb-16"
                  variants={staggerChildren}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}>
                  <motion.h2 
                    className="text-4xl sm:text-5xl font-bold mb-6"
                    variants={fadeInUp}>
                    Szolgáltatásaink
                  </motion.h2>
                  <motion.p 
                    className="text-gray-400 max-w-2xl mx-auto text-lg"
                    variants={fadeInUp}>
                    Fedezze fel átfogó szolgáltatásainkat, amelyek segítenek vállalkozása digitális növekedésében
                  </motion.p>
                  <div className="w-24 h-1 bg-[#ff5c35] mx-auto mt-6"></div>
                </motion.div>

                <motion.div 
                  className="grid md:grid-cols-3 gap-8"
                  variants={staggerChildren}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}>
                  {[
                    {
                      icon: <Code size={28} />,
                      title: "Webfejlesztés",
                      description: "Modern, reszponzív weboldalak fejlesztése, amelyek nem csak jól néznek ki, de hatékonyan konvertálnak.",
                      features: [
                        "Egyedi weboldal fejlesztés",
                        "WordPress fejlesztés",
                        "E-commerce megoldások",
                        "Weboldal karbantartás"
                      ],
                      color: "from-blue-500/20 to-purple-500/20"
                    },
                    {
                      icon: <BarChart size={28} />,
                      title: "Marketing",
                      description: "Átfogó digitális marketing stratégiák, amelyek növelik az online láthatóságot és az értékesítést.",
                      features: [
                        "SEO optimalizálás",
                        "Google Ads kampányok",
                        "Social media marketing",
                        "Email marketing"
                      ],
                      color: "from-orange-500/20 to-red-500/20"
                    },
                    {
                      icon: <Settings size={28} />,
                      title: "Automatizálás",
                      description: "Üzleti folyamatok automatizálása, amely időt és erőforrásokat szabadít fel vállalkozása számára.",
                      features: [
                        "Folyamatautomatizálás",
                        "CRM rendszerek",
                        "Marketing automatizálás",
                        "Chatbot megoldások"
                      ],
                      color: "from-green-500/20 to-teal-500/20"
                    }
                  ].map((service, index) => (
                    <motion.div
                      key={index}
                      className="group relative"
                      variants={fadeInUp}>
                      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
                           style={{background: `linear-gradient(to bottom right, ${service.color})`}}></div>
                      <div className="relative bg-[#1a1a2e] p-8 rounded-xl border border-gray-800/50 group-hover:border-[#ff5c35]/30 transition-all duration-500">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#ff5c35]/20 to-[#ff5c35]/10 rounded-lg flex items-center justify-center mb-6 text-[#ff5c35] group-hover:scale-110 transition-transform duration-500">
                          {service.icon}
                </div>
                        <h3 className="text-2xl font-bold mb-4 group-hover:text-[#ff5c35] transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                          {service.description}
                        </p>
                        <ul className="space-y-3">
                          {service.features.map((feature, idx) => (
                            <motion.li 
                              key={idx}
                              className="flex items-center text-gray-400 group-hover:text-gray-300"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * idx }}>
                              <ChevronRight size={16} className="text-[#ff5c35] mr-2" />
                              {feature}
                            </motion.li>
                          ))}
                </ul>
                        <motion.button 
                          className="mt-8 px-6 py-2 bg-[#1a1a2e] border border-[#ff5c35]/30 text-[#ff5c35] rounded-lg hover:bg-[#ff5c35] hover:text-white transition-all duration-300 w-full"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}>
                          Részletek
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                </div>
            </motion.section>

            {/* Technologies Section */}
            <motion.section 
              className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0f0f17] relative overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>
              {/* Background decoration */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-[#ff5c35]/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#ff5c35]/10 to-transparent"></div>
              </div>

              <div className="max-w-7xl mx-auto relative z-10">
                <motion.div 
                  className="text-center mb-16"
                  variants={staggerChildren}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}>
                  <motion.h2 
                    className="text-4xl sm:text-5xl font-bold mb-6"
                    variants={fadeInUp}>
                    Technológiák
                  </motion.h2>
                  <motion.p 
                    className="text-gray-400 max-w-2xl mx-auto text-lg mb-6"
                    variants={fadeInUp}>
                    Modern technológiák, amelyekkel álmai weboldala valósággá válik
                  </motion.p>
                  <div className="w-24 h-1 bg-[#ff5c35] mx-auto"></div>
                </motion.div>

                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                  variants={staggerChildren}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}>
                  {[
                    {
                      name: "WordPress",
                      description: "Tartalomkezelő rendszer",
                      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
                      color: "from-[#21759B]/20 to-[#21759B]/5"
                    },
                    {
                      name: "Wix",
                      description: "Weboldalépítő platform",
                      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wix/wix-original.svg",
                      color: "from-[#000000]/20 to-[#000000]/5"
                    },
                    {
                      name: "Webflow",
                      description: "Vizuális fejlesztőeszköz",
                      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webflow/webflow-original.svg",
                      color: "from-[#4353FF]/20 to-[#4353FF]/5"
                    },
                    {
                      name: "HTML5",
                      description: "Webes szabvány",
                      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
                      color: "from-[#E34F26]/20 to-[#E34F26]/5"
                    },
                    {
                      name: "CSS3",
                      description: "Stílusleíró nyelv",
                      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
                      color: "from-[#1572B6]/20 to-[#1572B6]/5"
                    },
                    {
                      name: "JavaScript",
                      description: "Programozási nyelv",
                      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
                      color: "from-[#F7DF1E]/20 to-[#F7DF1E]/5"
                    },
                    {
                      name: "React",
                      description: "Frontend keretrendszer",
                      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
                      color: "from-[#61DAFB]/20 to-[#61DAFB]/5"
                    },
                    {
                      name: "Vite",
                      description: "Fejlesztői eszköz",
                      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
                      color: "from-[#646CFF]/20 to-[#646CFF]/5"
                    },
                    {
                      name: "Next.js",
                      description: "React keretrendszer",
                      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
                      color: "from-[#000000]/20 to-[#000000]/5"
                    },
                    {
                      name: "TypeScript",
                      description: "Típusos JavaScript",
                      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
                      color: "from-[#3178C6]/20 to-[#3178C6]/5"
                    },
                    {
                      name: "Svelte",
                      description: "Modern keretrendszer",
                      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
                      color: "from-[#FF3E00]/20 to-[#FF3E00]/5"
                    },
                    {
                      name: "PHP",
                      description: "Programozási nyelv",
                      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
                      color: "from-[#777BB4]/20 to-[#777BB4]/5"
                    }
                  ].map((tech, index) => (
                    <motion.div
                      key={index}
                      className="group relative cursor-pointer"
                      variants={fadeInUp}
                      onClick={() => toggleTechSelection(tech.name)}>
                      <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 rounded-xl ${
                        selectedTechs.includes(tech.name) 
                          ? 'opacity-100 bg-gradient-to-br from-[#ff5c35]/30 to-[#ff5c35]/10' 
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                           style={!selectedTechs.includes(tech.name) ? {background: `linear-gradient(to bottom right, ${tech.color})`} : undefined}></div>
                      <div className={`relative bg-[#1a1a2e] p-8 rounded-xl border transition-all duration-500 ${
                        selectedTechs.includes(tech.name)
                          ? 'border-[#ff5c35] shadow-lg shadow-[#ff5c35]/20'
                          : 'border-gray-800/50 group-hover:border-[#ff5c35]/30'
                      }`}>
                        <div className="flex flex-col items-center text-center">
                          <motion.div 
                            className="w-16 h-16 mb-4 relative flex items-center justify-center"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}>
                            <img 
                              src={tech.icon} 
                              alt={tech.name}
                              className={`w-12 h-12 object-contain transition-all duration-300 ${
                                selectedTechs.includes(tech.name)
                                  ? 'brightness-125 scale-110'
                                  : 'filter group-hover:brightness-110'
                              }`}
                            />
                          </motion.div>
                          <motion.h3 
                            className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                              selectedTechs.includes(tech.name)
                                ? 'text-[#ff5c35]'
                                : 'group-hover:text-[#ff5c35]'
                            }`}
                            whileHover={{ scale: 1.05 }}>
                              {tech.name}
                            </motion.h3>
                            <p className={`text-sm transition-colors duration-300 ${
                              selectedTechs.includes(tech.name)
                                ? 'text-gray-300'
                                : 'text-gray-400 group-hover:text-gray-300'
                            }`}>
                              {tech.description}
                            </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.section>

            {/* Packages Section */}
            <section id="packages" className="py-20 relative bg-[#0f0f17] overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Csomagajánlataink
                  </h2>
                  <div className="w-24 h-1 bg-[#ff5c35]"></div>
                </div>
                
                {/* Desktop View */}
                <div className="hidden md:grid md:grid-cols-3 gap-8">
                  {packages.map((pkg, index) => (
                    <div key={index} className={`bg-[#0a0a0f] p-8 rounded-lg ${
                      pkg.isPopular 
                        ? 'border-2 border-[#ff5c35]/50 transform scale-105 relative shadow-lg shadow-[#ff5c35]/10'
                        : 'border border-gray-800/50 hover:border-[#ff5c35]/30'
                    } transition-all`}>
                      {pkg.isPopular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#ff5c35] text-white px-4 py-1 rounded-full text-sm font-bold">
                          Legnépszerűbb
                        </div>
                      )}
                      
                      <div className="mb-6">
                        <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                        <div className="text-3xl font-bold text-white">{pkg.price}</div>
                        <p className="text-gray-500 mt-2">{pkg.type}</p>
                      </div>
                      
                      <ul className="space-y-3 text-gray-400 mb-8">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <ChevronRight size={18} className="text-[#ff5c35] mt-1 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <button className={pkg.isPopular ? "primary-button w-full" : "secondary-button w-full"}>
                        Részletek
                      </button>
                    </div>
                  ))}
                </div>

                {/* Mobile View - Carousel */}
                <div className="md:hidden relative">
                  <motion.div 
                    className="overflow-visible"
                    initial={false}>
                    <AnimatePresence initial={false} mode="wait">
                      <motion.div
                        key={currentPackage}
                        className="flex w-full"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                          mass: 0.8
                        }}>
                        <div className="w-full px-4">
                          <motion.div
                            className={`bg-[#0a0a0f] p-8 rounded-lg mt-6 ${
                              currentPackage === 3 ? 'border border-gray-800/50' :
                              packages[currentPackage].isPopular 
                                ? 'border-2 border-[#ff5c35]/50 shadow-lg shadow-[#ff5c35]/10'
                                : 'border border-gray-800/50'
                            }`}
                            whileTap={{ scale: 0.98 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.1}
                            onDragEnd={(e, { offset, velocity }) => {
                              const swipe = offset.x + velocity.x * 50;
                              if (swipe < -50 && currentPackage < (isMobile ? 3 : packages.length - 1)) {
                                setCurrentPackage(currentPackage + 1);
                              } else if (swipe > 50 && currentPackage > 0) {
                                setCurrentPackage(currentPackage - 1);
                              }
                            }}>
                            {currentPackage < packages.length && packages[currentPackage].isPopular && (
                              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10 w-full flex justify-center">
                                <div className="bg-[#ff5c35] text-white px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                                  Legnépszerűbb
                                </div>
                              </div>
                            )}
                            {currentPackage === 3 ? (
                              <div className="text-center py-8">
                                <h3 className="text-xl font-bold mb-4">További Csomagok</h3>
                                <p className="text-gray-400 mb-6">Fedezze fel személyre szabott megoldásainkat</p>
                                <Link to="/csomagok">
                                  <motion.button 
                                    className="primary-button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}>
                                    Összes csomag megtekintése
                                  </motion.button>
                                </Link>
                              </div>
                            ) : (
                              <>
                                <div className="mb-6">
                                  <h3 className="text-xl font-bold mb-2">{packages[currentPackage].title}</h3>
                                  <div className="text-3xl font-bold text-white">{packages[currentPackage].price}</div>
                                  <p className="text-gray-500 mt-2">{packages[currentPackage].type}</p>
                                </div>
                                
                                <ul className="space-y-3 text-gray-400 mb-8">
                                  {packages[currentPackage].features.map((feature, idx) => (
                                    <motion.li 
                                      key={idx} 
                                      className="flex items-start"
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.1 }}>
                                      <ChevronRight size={18} className="text-[#ff5c35] mt-1 mr-2 flex-shrink-0" />
                                      <span>{feature}</span>
                                    </motion.li>
                                  ))}
                                </ul>
                                
                                <motion.button 
                                  className={packages[currentPackage].isPopular ? "primary-button w-full" : "secondary-button w-full"}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}>
                                  Részletek
                                </motion.button>
                              </>
                            )}
                          </motion.div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>

                  {/* Dots Navigation */}
                  <div className="flex justify-center mt-8 space-x-2">
                    {[...Array(4)].map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentPackage(index)}
                        className="relative h-2 rounded-full overflow-hidden"
                        style={{ width: currentPackage === index ? 24 : 8 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}>
                        <div className={`absolute inset-0 ${
                          currentPackage === index 
                            ? 'bg-[#ff5c35]' 
                            : 'bg-gray-600 hover:bg-gray-500'
                        }`} />
                      </motion.button>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <div className="absolute top-1/2 left-0 right-0 -mt-4 flex justify-between px-4 pointer-events-none">
                    {currentPackage > 0 && (
                      <motion.button
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ff5c35]/10 text-[#ff5c35] pointer-events-auto"
                        onClick={() => setCurrentPackage(currentPackage - 1)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}>
                        <ChevronRight size={20} className="transform rotate-180" />
                      </motion.button>
                    )}
                    {currentPackage < 3 && (
                      <motion.button
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ff5c35]/10 text-[#ff5c35] pointer-events-auto ml-auto"
                        onClick={() => setCurrentPackage(currentPackage + 1)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}>
                        <ChevronRight size={20} />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Additional packages button for both mobile and desktop */}
                <motion.div 
                  className="mt-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}>
                  <Link to="/csomagok">
                    <motion.button 
                      className="secondary-button inline-flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}>
                      További csomagjaink
                      <ChevronRight size={20} className="ml-2" />
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </section>

            {/* About Section */}
            <motion.section 
              id="rólunk" 
              className="py-20 px-4 sm:px-6 lg:px-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>
              <div className="max-w-7xl mx-auto">
                <motion.h1 
                  className="text-4xl font-bold mb-16"
                  variants={fadeInUp}>
                  Rólunk
                  <div className="w-24 h-1 bg-[#ff5c35] mt-4"></div>
                </motion.h1>

                {/* Hero Story */}
                <motion.div 
                  className="grid md:grid-cols-2 gap-12 items-center mb-20"
                  variants={staggerChildren}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}>
                  <motion.div variants={fadeInUp}>
                    <h2 className="text-3xl font-bold mb-6">Történetünk</h2>
                  <p className="text-gray-400 mb-6">
                      A Vizitor története 2020-ban kezdődött, amikor felismertük, hogy a magyar vállalkozásoknak 
                      szükségük van egy megbízható partnerre a digitális átalakulásban. Célunk az volt, hogy 
                      olyan megoldásokat kínáljunk, amelyek nem csak technológiailag korszerűek, hanem 
                      valódi üzleti értéket is teremtenek.
                  </p>
                  <p className="text-gray-400">
                      Ma már büszkén mondhatjuk, hogy több mint 100 sikeres projektet valósítottunk meg, 
                      és csapatunk folyamatosan növekszik elkötelezett szakemberekkel.
                    </p>
                  </motion.div>
                  <motion.div 
                    className="relative h-[400px]"
                    variants={fadeInUp}>
                    <motion.div 
                      className="absolute right-0 w-full h-full bg-[#1a1a2e] rounded-lg overflow-hidden"
                      whileHover={{ scale: 1.02 }}>
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#ff5c35]/20 to-transparent"></div>
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-50"></div>
                    </motion.div>
                  </motion.div>
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
                        icon: "💡",
                        title: "Innováció",
                        description: "Folyamatosan keressük az új technológiai megoldásokat"
                      },
                      {
                        icon: "🤝",
                        title: "Megbízhatóság",
                        description: "Amit ígérünk, azt teljesítjük, határidőre és minőségben"
                      },
                      {
                        icon: "🎯",
                        title: "Eredményorientáltság",
                        description: "A mérhető üzleti eredmények elérése a célunk"
                      }
                    ].map((value, index) => (
                      <motion.div
                        key={index}
                        className="bg-[#1a1a2e] p-8 rounded-lg border border-gray-800/50"
                        variants={fadeInUp}
                        whileHover={{ 
                          scale: 1.03,
                          boxShadow: "0 10px 30px -15px rgba(255, 92, 53, 0.2)"
                        }}>
                        <div className="text-4xl mb-4">{value.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                        <p className="text-gray-400">{value.description}</p>
                      </motion.div>
                    ))}
                </div>
                </motion.div>

                {/* Team */}
                <motion.div
                  variants={staggerChildren}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}>
                  <motion.h2 
                    className="text-3xl font-bold mb-12 text-center"
                    variants={fadeInUp}>
                    Csapatunk
                  </motion.h2>
                  <div className="grid md:grid-cols-4 gap-8">
                    {[
                      {
                        name: "Nagy Péter",
                        role: "Ügyvezető",
                        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3"
                      },
                      {
                        name: "Kiss Anna",
                        role: "Vezető Fejlesztő",
                        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3"
                      },
                      {
                        name: "Kovács Tamás",
                        role: "Design Vezető",
                        image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3"
                      },
                      {
                        name: "Szabó Eszter",
                        role: "Marketing Vezető",
                        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3"
                      }
                    ].map((member, index) => (
                      <motion.div
                        key={index}
                        className="group relative"
                        variants={fadeInUp}>
                        <motion.div 
                          className="relative h-[300px] rounded-lg overflow-hidden mb-4"
                          whileHover={{ scale: 1.05 }}>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent z-10"></div>
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                            <h3 className="text-xl font-bold">{member.name}</h3>
                            <p className="text-[#ff5c35]">{member.role}</p>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                </div>
                </motion.div>
              </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section 
              id="kapcsolat" 
              className="py-20 px-4 sm:px-6 lg:px-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>
              <div className="max-w-7xl mx-auto">
                <motion.h1 
                  className="text-4xl font-bold mb-16"
                  variants={fadeInUp}>
                  Kapcsolatfelvétel
                  <div className="w-24 h-1 bg-[#ff5c35] mt-4"></div>
                </motion.h1>
              
              <div className="grid md:grid-cols-2 gap-12">
                  {/* Contact Form */}
                  <motion.div
                    variants={fadeInUp}
                    className="bg-[#0f0f17] p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-6">Küldjön üzenetet</h2>
                    <motion.form className="space-y-6">
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">Név</label>
                        <motion.input 
                        type="text" 
                        placeholder="Az Ön neve"
                          className="w-full bg-[#1a1a2e] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff5c35] transition-colors"
                          whileFocus={{ scale: 1.01 }}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">Email</label>
                        <motion.input 
                        type="email" 
                        placeholder="pelda@email.hu"
                          className="w-full bg-[#1a1a2e] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff5c35] transition-colors"
                          whileFocus={{ scale: 1.01 }}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">Tárgy</label>
                        <motion.input 
                        type="text" 
                        placeholder="Üzenet tárgya"
                          className="w-full bg-[#1a1a2e] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff5c35] transition-colors"
                          whileFocus={{ scale: 1.01 }}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">Üzenet</label>
                        <motion.textarea 
                          placeholder="Írja le kérdését vagy projektjét..."
                          rows={5}
                          className="w-full bg-[#1a1a2e] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff5c35] transition-colors resize-none"
                          whileFocus={{ scale: 1.01 }}
                        />
                      </div>
                      <motion.button 
                        type="submit"
                        className="w-full primary-button"
                        whileHover={{ scale: 1.02, boxShadow: "0 0 8px rgb(255, 92, 53)" }}
                        whileTap={{ scale: 0.98 }}>
                        Üzenet küldése
                      </motion.button>
                    </motion.form>
                  </motion.div>

                  {/* Contact Info */}
                  <motion.div variants={fadeInUp}>
                    <h2 className="text-2xl font-bold mb-6">Elérhetőségeink</h2>
                    
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Email</h3>
                        <motion.a 
                          href="mailto:info@vizitor.hu"
                          className="text-gray-400 hover:text-white flex items-center"
                          whileHover={{ x: 5 }}>
                          <Mail className="mr-2 text-[#ff5c35]" size={20} />
                          info@vizitor.hu
                        </motion.a>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Telefon</h3>
                        <motion.a 
                          href="tel:+36301234567"
                          className="text-gray-400 hover:text-white flex items-center"
                          whileHover={{ x: 5 }}>
                          <Phone className="mr-2 text-[#ff5c35]" size={20} />
                          +36 30 123 4567
                        </motion.a>
                    </div>
                    
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Cím</h3>
                        <motion.div 
                          className="text-gray-400 flex items-center"
                          whileHover={{ x: 5 }}>
                          <MapPin className="mr-2 text-[#ff5c35]" size={20} />
                          Példa utca 1., Budapest
                        </motion.div>
                  </div>
                  
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Kövessen minket</h3>
                    <div className="flex space-x-4">
                          <motion.a 
                            href="#"
                            className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center text-[#ff5c35] hover:text-white transition-colors"
                            whileHover={{ y: -5 }}>
                            <Facebook size={20} />
                          </motion.a>
                          <motion.a 
                            href="#"
                            className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center text-[#ff5c35] hover:text-white transition-colors"
                            whileHover={{ y: -5 }}>
                            <Instagram size={20} />
                          </motion.a>
                          <motion.a 
                            href="#"
                            className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center text-[#ff5c35] hover:text-white transition-colors"
                            whileHover={{ y: -5 }}>
                            <Linkedin size={20} />
                          </motion.a>
                          <motion.a 
                            href="#"
                            className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center text-[#ff5c35] hover:text-white transition-colors"
                            whileHover={{ y: -5 }}>
                            <Twitter size={20} />
                          </motion.a>
                    </div>
                  </div>
                  
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Nyitvatartás</h3>
                    <div className="space-y-2 text-gray-400">
                      <p>Hétfő - Péntek: 9:00 - 17:00</p>
                      <p>Szombat - Vasárnap: Zárva</p>
                    </div>
                  </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          </main>
        } />
        <Route path="/csomagok" element={<Packages />} />
        <Route path="/rolunk" element={<About />} />
        <Route path="/kapcsolat" element={<Contact />} />
        <Route path="/szolgaltatasok" element={<Services />} />
      </Routes>

      {/* Footer */}
      <motion.footer 
        className="bg-[#0a0a0f] border-t border-gray-800/30 py-12 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div variants={fadeInUp}>
              <div className="mb-4">
                <motion.img 
                  src="/vizitor-logo.png" 
                  alt="Vizitor Logo" 
                  className="h-8 w-auto" 
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </div>
              <p className="text-gray-400">Modern megoldások az Ön vállalkozása számára</p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h4 className="font-semibold mb-4">Szolgáltatások</h4>
              <ul className="space-y-2">
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-gray-400 hover:text-white">Webfejlesztés</a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-gray-400 hover:text-white">Marketing</a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-gray-400 hover:text-white">Automatizálás</a>
                </motion.li>
              </ul>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h4 className="font-semibold mb-4">Vállalat</h4>
              <ul className="space-y-2">
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-gray-400 hover:text-white">Rólunk</a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-gray-400 hover:text-white">Karrier</a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-gray-400 hover:text-white">Kapcsolat</a>
                </motion.li>
              </ul>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h4 className="font-semibold mb-4">Kövessen minket</h4>
              <div className="flex space-x-4">
                <motion.a 
                  href="#" 
                  className="text-gray-400 hover:text-white"
                  whileHover={{ y: -5 }}>
                  <Facebook size={20} />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-gray-400 hover:text-white"
                  whileHover={{ y: -5 }}>
                  <Twitter size={20} />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-gray-400 hover:text-white"
                  whileHover={{ y: -5 }}>
                  <Instagram size={20} />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-gray-400 hover:text-white"
                  whileHover={{ y: -5 }}>
                  <Linkedin size={20} />
                </motion.a>
            </div>
            </motion.div>
          </div>
          <motion.div 
            className="mt-12 pt-8 border-t border-gray-800/30 text-center text-gray-400"
            variants={fadeInUp}>
            © {new Date().getFullYear()} Vizitor.hu. Minden jog fenntartva.
          </motion.div>
        </div>
      </motion.footer>
    </>
  );
}

export default App;