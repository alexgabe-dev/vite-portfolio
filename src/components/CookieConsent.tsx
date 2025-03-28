import React, { useEffect } from 'react';

interface CookieConsentProps {
  onAccept: () => void;
}

// Extend Window interface to include CookieYes
declare global {
  interface Window {
    CookieYes?: {
      consent: {
        marketing: boolean;
        analytics: boolean;
        preferences: boolean;
        necessary: boolean;
      };
      show: () => void;
      hide: () => void;
      renew: () => void;
    };
  }
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept }) => {
  useEffect(() => {
    // Wait for CookieYes to load
    const checkCookieYes = () => {
      if (window.CookieYes) {
        try {
          // Add event listener for CookieYes consent change
          document.addEventListener('cookieyes_consent_update', () => {
            onAccept();
          });
          
          // Also trigger onAccept if CookieYes is already loaded with consent
          if (window.CookieYes.consent) {
            onAccept();
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
      document.removeEventListener('cookieyes_consent_update', onAccept);
    };
  }, [onAccept]);

  // Don't render anything as CookieYes provides its own banner
  return null;
};

export default CookieConsent;