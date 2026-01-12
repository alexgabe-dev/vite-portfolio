
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';

// Components
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import PromotionPopup from './components/PromotionPopup';
import Error from './components/Error';
import AdFrame from './components/AdFrame';
import CookieConsent from './components/CookieConsent';
import SEOProvider from './components/SEOProvider';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Packages from './components/Packages';
import About from './components/About';
import Contact from './components/Contact';
import Services from './components/Services';
import Blog from './components/Blog';
import BlogDetail from './components/BlogDetail';
import Privacy from './components/Privacy';

function App() {
  const [showPromotion, setShowPromotion] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const location = useLocation();

  // Cookie consent initialization
  useEffect(() => {
    // Wait for CookieYes to load
    const checkCookieYes = () => {
      if ((window as any).CookieYes) {
        try {
          // Register callback for when consent is given
          document.addEventListener('cookieyes_consent_update', () => {
            setShowCookieConsent(false);
          });

          // Also trigger if CookieYes is already loaded with consent
          if ((window as any).CookieYes.consent) {
            setShowCookieConsent(false);
          }
        } catch (error) {
          console.warn('CookieYes callback registration failed:', error);
        }
      } else {
        // Retry after a short delay if not loaded yet
        setTimeout(checkCookieYes, 100);
      }
    };

    checkCookieYes();

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener('cookieyes_consent_update', () => setShowCookieConsent(false));
    };
  }, []);

  const handleCookieConsent = () => {
    setShowCookieConsent(false);
  };

  // Add bfcache support
  React.useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page was restored from bfcache
        console.log('Page restored from bfcache');
        // Reset any necessary state
        setShowPromotion(false);
        setShowCookieConsent(false);
      }
    };

    const handlePageHide = () => {
      // Clean up any timers, subscriptions, or connections
      localStorage.removeItem('tempFormData');

      // Cancel any pending requests
      if (window.navigator.sendBeacon) {
        // Use sendBeacon for any analytics
        window.navigator.sendBeacon('/api/analytics', JSON.stringify({
          event: 'page_hide',
          timestamp: Date.now()
        }));
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Similar cleanup as pageHide
        localStorage.removeItem('tempFormData');
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Modify popup effect to support bfcache
  React.useEffect(() => {
    let popupTimer: number | null = null;

    const hasSeenPopup = localStorage.getItem('hasSeenPopup');
    const isErrorPage = ['/404', '/403', '/500'].includes(location.pathname) || location.pathname.match(/^\/\w+/);

    // Only show on home page if not seen yet
    const isHomePage = location.pathname === '/';

    if (!hasSeenPopup && !isErrorPage && isHomePage) {
      popupTimer = window.setTimeout(() => {
        setShowPromotion(true);
      }, 10000);
    }

    return () => {
      if (popupTimer) {
        window.clearTimeout(popupTimer);
      }
    };
  }, [location]);

  const handleClosePromotion = () => {
    setShowPromotion(false);
    localStorage.setItem('hasSeenPopup', 'true');
  };

  return (
    <SEOProvider>
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
        <Route path="/" element={<Home />} />
        <Route path="/csomagok" element={<Packages />} />
        <Route path="/rolunk" element={<About />} />
        <Route path="/kapcsolat" element={<Contact />} />
        <Route path="/szolgaltatasok" element={<Services />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/adatvedelem" element={<Privacy />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/404" element={<Error code={404} />} />
        <Route path="/403" element={<Error code={403} />} />
        <Route path="/500" element={<Error code={500} />} />
        <Route path="*" element={<Error code={404} />} />
      </Routes>

      <Footer />
    </SEOProvider>
  );
}

export default App;