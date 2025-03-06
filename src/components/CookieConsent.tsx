import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface CookieConsentProps {
  onAccept: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept }) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-[#1a1a2e] border-t border-gray-800/30 p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-gray-300 text-sm">
          A weboldal használatával elfogadja a cookie-k használatát. 
          <Link to="/adatvedelem" className="text-[#ff5c35] hover:text-[#ff5c35]/80 ml-1">
            Részletek
          </Link>
        </div>
        <motion.button
          onClick={onAccept}
          className="primary-button px-6 py-2 text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}>
          Elfogadom
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CookieConsent; 