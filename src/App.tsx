import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Code, BarChart, Settings, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, 
  Globe, Box, Palette, FileCode, Layout, CircuitBoard, Blocks, Laptop, Braces, Workflow, FileJson, Lightbulb, Handshake, Target, CheckCircle, Send } from 'lucide-react';
import { motion, AnimatePresence, useInView, useSpring, useTransform } from 'framer-motion';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Packages from './components/Packages';
import About from './components/About';
import Contact from './components/Contact';
import Services from './components/Services';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Privacy from './components/Privacy';
import AnimatedText from './components/AnimatedText';
import PromotionPopup from './components/PromotionPopup';
import Error from './components/Error';
import AdFrame from './components/AdFrame';
import CookieConsent from './components/CookieConsent';
import Cookies from 'js-cookie';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [selectedTechs, setSelectedTechs] = React.useState<string[]>([]);
  const [currentPackage, setCurrentPackage] = React.useState(0);
  const [clickCount, setClickCount] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const [showPromotion, setShowPromotion] = React.useState(false);
  const [showCookieConsent, setShowCookieConsent] = React.useState(false);
  const location = useLocation();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    privacyAccepted: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState({
    ip: '',
    device: '',
    browser: ''
  });

  // Cookie consent initialization
  useEffect(() => {
    // Wait for Cookiebot to load
    const checkCookiebot = () => {
      if (window.Cookiebot) {
        try {
          // Register callback for when consent is given
          window.Cookiebot.callback = () => {
            setShowCookieConsent(false);
          };
        } catch (error) {
          console.warn('Cookiebot callback registration failed:', error);
        }
      } else {
        // Retry after a short delay if not loaded yet
        setTimeout(checkCookiebot, 100);
      }
    };
    
    checkCookiebot();
  }, []);

  const handleCookieConsent = () => {
    setShowCookieConsent(false);
  };

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

  // Popup state management
  React.useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenPopup');
    
    // Ne jelenítse meg a popupot a hibaoldalakon
    const isErrorPage = ['/404', '/403', '/500'].includes(location.pathname) || location.pathname.match(/^\/\w+/);
    
    if (!hasSeenPopup && !isErrorPage) {
      const timer = setTimeout(() => {
        setShowPromotion(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleClosePromotion = () => {
    setShowPromotion(false);
    localStorage.setItem('hasSeenPopup', 'true');
  };

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
      title: "Starter Csomag",
      price: "150.000 Ft",
      type: "Egyszeri díj",
      features: [
        "Egyedi, modern dizájn",
        "Reszponzív felület",
        "Alap CMS integráció",
        "Gyors oldalbetöltés & cache optimalizáció",
        "Alap SEO optimalizáció",
        "Kapcsolati űrlap",
        "Ingyenes domain (1 év)",
        "Ingyenes SSL tanúsítvány",
        "1 hónap ingyenes karbantartás"
      ],
      isPopular: false
    },
    {
      title: "Business Csomag",
      price: "200.000 Ft",
      type: "Egyszeri díj",
      features: [
        "Minden a Starterből, plusz:",
        "Többoldalas felépítés (10+ oldal)",
        "Blog és híroldal integráció",
        "Kiterjesztett SEO & kulcsszó kutatás",
        "Social media integráció",
        "Email hírlevél és automata feliratkozás",
        "Google Analytics integráció",
        "Galéria, portfólió és videó szekció",
        "Prémium design elemek & grafikai illusztrációk",
        "Egyedi süti banner"
      ],
      isPopular: true
    },
    {
      title: "Premium Csomag",
      price: "350.000 Ft",
      type: "Egyszeri díj",
      features: [
        "Minden a Businessből, plusz:",
        "Teljes e-commerce rendszer",
        "Haladó SEO stratégiák & marketing támogatás",
        "Többnyelvű weboldal kialakítása",
        "Egyedi plugin és modul fejlesztés",
        "Fejlett biztonsági megoldások",
        "Haladó teljesítmény optimalizáció",
        "CRM integráció & automatizált ügyfélkezelés",
        "2 hónap ingyenes karbantartás"
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

  useEffect(() => {
    // Collect device and browser information
    const deviceInfo = {
      device: `${navigator.platform} - ${navigator.userAgent.match(/\((.*?)\)/)?.[1] || 'Unknown'}`,
      browser: `${navigator.userAgent.match(/(Chrome|Safari|Firefox|Edge|MSIE|Trident)\/[\d.]+/)?.[0] || 'Unknown'}`
    };
    setUserInfo(prev => ({ ...prev, ...deviceInfo }));

    // Get IP address
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        setUserInfo(prev => ({ ...prev, ip: data.ip }));
      })
      .catch(error => {
        console.error('Error fetching IP:', error);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.privacyAccepted) {
      setError('Kérjük fogadja el az adatvédelmi tájékoztatót!');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      // Add additional fields to the form data
      formData.append('_subject', 'Új érdeklődő - vizitor.hu');
      formData.append('_replyto', formState.email);
      
      // Add user information
      formData.append('ip_address', userInfo.ip);
      formData.append('device_info', userInfo.device);
      formData.append('browser_info', userInfo.browser);
      
      // Add source information
      formData.append('source', 'footer_form');
      
      const response = await fetch('https://formspree.io/f/xvgkpzen', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        setError('Form submission failed');
        return;
      }

      setIsSubmitted(true);
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: '',
        privacyAccepted: false
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError('Hiba történt az üzenet küldése közben. Kérjük próbálja újra később.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <AdFrame src="https://safeframe.googlesyndication.com/safeframe/1-0-40/html" />
      <PromotionPopup 
        isOpen={showPromotion} 
        onClose={handleClosePromotion} 
      />
      
      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showCookieConsent && (
          <CookieConsent onAccept={handleCookieConsent} />
        )}
      </AnimatePresence>

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
                    className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6"
                    variants={fadeInUp}>
                    <span className="md:block leading-[1.2] inline-block py-1">Növekedés</span>{' '}
                    <span className="md:block leading-[1.2] inline-block py-1">minden</span>{' '}
                    <AnimatedText />
                  </motion.h1>
                  <motion.p 
                    className="text-lg sm:text-xl mb-6 md:mb-8 text-gray-400 max-w-lg leading-[1.8]"
                    variants={fadeInUp}>
                    Modern weboldalkészítés, hatékony digitális marketing és automatizált megoldások, amelyek lenyűgözik a látogatókat és növelik a bevételt.
                  </motion.p>
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 md:mt-0"
                    variants={fadeInUp}>
                    <Link to="/kapcsolat" state={{ fromFooter: true }}>
                      <motion.button 
                        type="button"
                        className="primary-button text-base sm:text-lg w-full sm:w-auto px-6 py-3 sm:py-4"
                        whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgb(255, 92, 53)" }}
                        whileTap={{ scale: 0.95 }}>
                        Ajánlatkérés
                      </motion.button>
                    </Link>
                    <Link to="/szolgaltatasok">
                      <motion.button 
                        type="button"
                        className="secondary-button text-base sm:text-lg w-full sm:w-auto px-6 py-3 sm:py-4"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}>
                        Szolgáltatásaim
                      </motion.button>
                    </Link>
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
                    Szolgáltatásaim
                  </motion.h2>
                  <motion.p 
                    className="text-gray-400 max-w-2xl mx-auto text-lg"
                    variants={fadeInUp}>
                    Fedezd fel átfogó szolgáltatásaimat, amelyek segítenek vállalkozásod digitális növekedésében
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
                      description: "Modern, reszponzív weboldalak készítése, amelyek nem csak jól néznek ki, de hatékonyan konvertálnak.",
                      features: [
                        "Egyedi weboldal készítés",
                        "WordPress fejlesztés",
                        "E-commerce megoldások",
                        "Weboldal karbantartás"
                      ],
                      color: "from-blue-500/20 to-purple-500/20"
                    },
                    {
                      icon: <BarChart size={28} />,
                      title: "Marketing",
                      description: "Átfogó, professzionális digitális marketing stratégiák, amelyek növelik az online láthatóságot és az értékesítést.",
                      features: [
                        "SEO optimalizálás",
                        "PPC kampányok",
                        "Social Media Marketing",
                        "Email marketing"
                      ],
                      color: "from-orange-500/20 to-red-500/20"
                    },
                    {
                      icon: <Settings size={28} />,
                      title: "Automatizálás",
                      description: "Üzleti folyamatok részletes automatizálása, amely időt és erőforrásokatanak szabadít fel vállalkozásod számára.",
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
                              className="flex items-center text-gray-400 group-hover:text-gray-300 cursor-pointer"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * idx }}
                              whileHover={{ x: 5 }}
                              onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                // Itt hozzáadhatsz további navigációs logikát
                              }}>
                              <ChevronRight size={16} className="text-[#ff5c35] mr-2" />
                              {feature}
                            </motion.li>
                          ))}
                </ul>
                        <Link 
                          to="/szolgaltatasok" 
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          className="block w-full"
                        >
                          <motion.button 
                            type="button"
                            className="mt-8 px-6 py-2 bg-[#1a1a2e] border border-[#ff5c35]/30 text-[#ff5c35] rounded-lg hover:bg-[#ff5c35] hover:text-white transition-all duration-300 w-full"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}>
                            Részletek
                          </motion.button>
                        </Link>
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
                      icon: "https://cdn.worldvectorlogo.com/logos/wix-1.svg",
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
                      
                      <Link to="/csomagok" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <motion.button 
                          type="button"
                          className={pkg.isPopular ? "primary-button w-full" : "secondary-button w-full"}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}>
                          Részletek
                        </motion.button>
                      </Link>
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
                                
                                <Link to="/csomagok" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                  <motion.button 
                                    type="button"
                                    className={packages[currentPackage].isPopular ? "primary-button w-full" : "secondary-button w-full"}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}>
                                    Részletek
                                  </motion.button>
                                </Link>
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
                        type="button"
                        key={index}
                        onClick={() => setCurrentPackage(index)}
                        className="relative h-2 rounded-full overflow-hidden"
                        style={{ width: currentPackage === index ? 24 : 8 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        aria-label={`Go to package ${index + 1}`}>
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
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ff5c35]/10 text-[#ff5c35] pointer-events-auto"
                        onClick={() => setCurrentPackage(currentPackage - 1)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Previous package">
                        <ChevronRight size={20} className="transform rotate-180" />
                      </motion.button>
                    )}
                    {currentPackage < 3 && (
                      <motion.button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ff5c35]/10 text-[#ff5c35] pointer-events-auto ml-auto"
                        onClick={() => setCurrentPackage(currentPackage + 1)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Next package">
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
                  <Link to="/csomagok" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <motion.button 
                      type="button"
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
                  <h2 className="text-3xl font-bold mb-6">Történetem</h2>
                      <p className="text-gray-400 mb-6">
                  A viztor.hu-t azért hosztam létre, mivel felismertem, hogy a magyar vállalkozásoknak 
                  szükségük van egy megbízható partnerre a digitális átalakulásban. Célom az, hogy 
                  olyan megoldásokat kínáljak, amelyek nem csak technológiailag korszerűek, hanem 
                  valódi üzleti értéket is teremtenek.
                      </p>
                      <p className="text-gray-400">
                  Ma már büszkén mondhatom, hogy több sikeres projektet valósítottam meg, 
                  és folyamatosan fejlesztem magam, hogy együtt növekedjek az ügyfeleimmel.
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
                    <motion.form 
                      onSubmit={handleSubmit}
                      className="space-y-4">
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">Név</label>
                        <motion.input 
                          type="text" 
                          name="name"
                          value={formState.name}
                          onChange={handleInputChange}
                          placeholder="Az Ön neve"
                          className="w-full bg-[#1a1a2e] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff5c35] transition-colors"
                          whileFocus={{ scale: 1.01 }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">Email</label>
                        <motion.input 
                          type="email" 
                          name="email"
                          value={formState.email}
                          onChange={handleInputChange}
                          placeholder="pelda@email.hu"
                          className="w-full bg-[#1a1a2e] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff5c35] transition-colors"
                          whileFocus={{ scale: 1.01 }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">Tárgy</label>
                        <motion.input 
                          type="text" 
                          name="subject"
                          value={formState.subject}
                          onChange={handleInputChange}
                          placeholder="Üzenet tárgya"
                          className="w-full bg-[#1a1a2e] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff5c35] transition-colors"
                          whileFocus={{ scale: 1.01 }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">Üzenet</label>
                        <motion.textarea 
                          name="message"
                          value={formState.message}
                          onChange={handleInputChange}
                          placeholder="Írja le kérdését vagy projektjét..."
                          rows={5}
                          className="w-full bg-[#1a1a2e] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff5c35] transition-colors resize-none"
                          whileFocus={{ scale: 1.01 }}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.input
                          type="checkbox"
                          id="privacy"
                          checked={formState.privacyAccepted}
                          onChange={(e) => setFormState(prev => ({
                            ...prev,
                            privacyAccepted: e.target.checked
                          }))}
                          className="h-4 w-4 rounded border-gray-800 bg-[#0a0a0f] text-[#ff5c35] focus:ring-[#ff5c35] focus:ring-opacity-25"
                        />
                        <label htmlFor="privacy" className="text-sm text-gray-400">
                          Elolvastam és elfogadom az <Link to="/adatvedelem" className="text-[#ff5c35] hover:underline">adatvédelmi tájékoztatót</Link>
                        </label>
                      </div>
                      <motion.button 
                        type="submit"
                        disabled={isLoading}
                        className={`w-full inline-flex items-center justify-center px-6 py-4 bg-[#ff5c35] text-white rounded-lg font-semibold transition-colors group text-sm md:text-base ${
                          isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-[#ff5c35]/90'
                        }`}
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}>
                        {isLoading ? (
                          <>
                            <motion.div
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Küldés folyamatban...
                          </>
                        ) : isSubmitted ? (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Üzenet elküldve!
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Ingyenes ajánlatkérés
                          </>
                        )}
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
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
                            href="https://facebook.com/vizitor"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center text-[#ff5c35] hover:text-white transition-colors"
                            whileHover={{ y: -5 }}
                            aria-label="Kövessen minket Facebookon">
                            <Facebook size={20} />
                          </motion.a>
                          <motion.a 
                            href="#"
                            className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center text-[#ff5c35] hover:text-white transition-colors"
                            whileHover={{ y: -5 }}
                            aria-label="Kövessen minket Instagramon">
                            <Instagram size={20} />
                          </motion.a>
                          <motion.a 
                            href="#"
                            className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center text-[#ff5c35] hover:text-white transition-colors"
                            whileHover={{ y: -5 }}
                            aria-label="Kövessen minket LinkedInen">
                            <Linkedin size={20} />
                          </motion.a>
                          <motion.a 
                            href="#"
                            className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center text-[#ff5c35] hover:text-white transition-colors"
                            whileHover={{ y: -5 }}
                            aria-label="Kövessen minket Twitteren">
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
        <Route path="/adatvedelem" element={<Privacy />} />
        <Route path="/404" element={<Error code={404} />} />
        <Route path="/403" element={<Error code={403} />} />
        <Route path="/500" element={<Error code={500} />} />
        <Route path="*" element={<Error code={404} />} />
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
                  <Link to="/szolgaltatasok" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">Webfejlesztés</Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/szolgaltatasok" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">Marketing</Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/szolgaltatasok" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">Automatizálás</Link>
                </motion.li>
              </ul>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h4 className="font-semibold mb-4">Vállalat</h4>
              <ul className="space-y-2">
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/rolunk" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">Rólunk</Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/rolunk" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">Karrier</Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/kapcsolat" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">Kapcsolat</Link>
                </motion.li>
              </ul>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h4 className="font-semibold mb-4">Jogi</h4>
              <ul className="space-y-2">
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/adatvedelem" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">Adatvédelmi Tájékoztató</Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/adatvedelem" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">ÁSZF</Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/adatvedelem" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white">Cookie tájékoztató</Link>
                </motion.li>
              </ul>
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