import React, { useEffect } from 'react';

interface CookieConsentProps {
  onAccept: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept }) => {
  useEffect(() => {
    // Initialize Cookiebot if it exists
    if (window.Cookiebot) {
      try {
        // Register callback for when consent is given
        window.Cookiebot.callback = () => {
          onAccept();
        };
      } catch (error) {
        console.warn('Cookiebot callback registration failed:', error);
      }
    }
  }, [onAccept]);

  // Don't render anything as Cookiebot provides its own banner
  return null;
};

export default CookieConsent; 