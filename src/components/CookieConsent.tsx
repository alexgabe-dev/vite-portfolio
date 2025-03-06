import React, { useEffect } from 'react';

interface CookieConsentProps {
  onAccept: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept }) => {
  useEffect(() => {
    // Wait for Cookiebot to load
    const checkCookiebot = () => {
      if (window.Cookiebot) {
        try {
          // Register callback for when consent is given
          window.Cookiebot.callback = () => {
            onAccept();
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
  }, [onAccept]);

  // Don't render anything as Cookiebot provides its own banner
  return null;
};

export default CookieConsent; 