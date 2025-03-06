import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Menu, X, ChevronRight, Code, BarChart, Settings, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, 
  Globe, Box, Palette, FileCode, Layout, CircuitBoard, Blocks, Laptop, Braces, Workflow, FileJson, Lightbulb, Handshake, Target, CheckCircle, Send } from 'lucide-react';
import { motion, AnimatePresence, useInView, useSpring, useTransform } from 'framer-motion';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";
import './App.css';
import Loading from './components/Loading';

// Lazy load components
const Navbar = React.lazy(() => import('./components/Navbar'));
const Home = React.lazy(() => import('./components/Home'));
const Services = React.lazy(() => import('./components/Services'));
const About = React.lazy(() => import('./components/About'));
const Contact = React.lazy(() => import('./components/Contact'));
const Packages = React.lazy(() => import('./components/Packages'));
const Privacy = React.lazy(() => import('./components/Privacy'));
const Error = React.lazy(() => import('./components/Error'));

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

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log(container);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<Loading />}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/szolgaltatasok" element={<Services />} />
          <Route path="/rolunk" element={<About />} />
          <Route path="/kapcsolat" element={<Contact />} />
          <Route path="/csomagok" element={<Packages />} />
          <Route path="/adatvedelem" element={<Privacy />} />
          <Route path="*" element={<Error code={404} />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;