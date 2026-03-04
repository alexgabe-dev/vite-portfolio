
import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import PromotionPopup from './components/PromotionPopup';
import Error from './components/Error';
import AdFrame from './components/AdFrame';
import SEOProvider from './components/SEOProvider';
import Footer from './components/Footer';

// Route-level lazy loading to reduce initial JS on homepage.
const Home = React.lazy(() => import('./pages/Home'));
const Packages = React.lazy(() => import('./components/Packages'));
const About = React.lazy(() => import('./components/About'));
const Contact = React.lazy(() => import('./components/Contact'));
const Services = React.lazy(() => import('./components/Services'));
const Blog = React.lazy(() => import('./components/Blog'));
const BlogDetail = React.lazy(() => import('./components/BlogDetail'));
const Privacy = React.lazy(() => import('./components/Privacy'));

function App() {
  const [showPromotion, setShowPromotion] = useState(false);
  const [showAdFrame, setShowAdFrame] = useState(false);
  const location = useLocation();

  // Prevent browser from restoring old scroll position on reload.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // On homepage load/reload always start from top.
  useEffect(() => {
    if (location.pathname !== '/') return;

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });

    const timer = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  React.useEffect(() => {
    let popupTimer: number | null = null;

    const hasSeenPopup = localStorage.getItem('hasSeenPopup');
    const isErrorPage = ['/404', '/403', '/500'].includes(location.pathname);

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

  useEffect(() => {
    const idle = (window as any).requestIdleCallback;
    if (idle) {
      const id = idle(() => setShowAdFrame(true), { timeout: 2500 });
      return () => (window as any).cancelIdleCallback?.(id);
    }

    const timer = window.setTimeout(() => setShowAdFrame(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <SEOProvider>
      <ScrollToTop />
      <Navbar />
      {showAdFrame && <AdFrame src="https://safeframe.googlesyndication.com/safeframe/1-0-40/html" />}
      <PromotionPopup
        isOpen={showPromotion}
        onClose={handleClosePromotion}
      />

      <Suspense fallback={<div className="min-h-[50vh]" aria-hidden="true" />}>
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
      </Suspense>

      <Footer />
    </SEOProvider>
  );
}

export default App;
