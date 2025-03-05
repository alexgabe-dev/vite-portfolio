import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PromotionPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PromotionPopup: React.FC<PromotionPopupProps> = ({ isOpen, onClose }) => {
  // Add console log for debugging
  console.log('PromotionPopup rendered, isOpen:', isOpen);

  // Prevent body scroll when popup is open
  useEffect(() => {
    console.log('PromotionPopup useEffect, isOpen:', isOpen);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
          />

          {/* Popup Container */}
          <motion.div 
            className="fixed inset-0 z-[10000] flex items-center justify-center px-4 sm:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Popup Content */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }
              }}
              exit={{ 
                scale: 0.5, 
                opacity: 0,
                transition: {
                  duration: 0.3
                }
              }}
              className="w-full max-w-md mx-auto bg-[#0f0f17] rounded-xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <div className="flex justify-center mb-6">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1.1, 1]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="w-16 h-16 bg-[#ff5c35]/10 rounded-full flex items-center justify-center"
                  >
                    <Gift size={32} className="text-[#ff5c35]" />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
                    Különleges Ajánlat!
                  </h2>
                  <p className="text-gray-400 text-center mb-4">
                    Kérjen ajánlatot most és{' '}
                    <span className="text-[#ff5c35] font-semibold">
                      20% kedvezményt
                    </span>{' '}
                    adunk a választott csomagból!
                  </p>
                  <div className="bg-[#1a1a2e] p-4 rounded-lg mb-6">
                    <p className="text-sm text-center text-gray-400">
                      Az ajánlat korlátozott ideig érvényes
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Link 
                    to="/kapcsolat" 
                    className="flex-1"
                    onClick={onClose}
                  >
                    <motion.button
                      className="primary-button w-full flex items-center justify-center gap-2 text-base sm:text-lg py-3 sm:py-4"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Ajánlatkérés
                      <ArrowRight size={18} />
                    </motion.button>
                  </Link>
                </motion.div>
              </div>

              {/* Bottom decoration */}
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#ff5c35] to-transparent" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PromotionPopup; 