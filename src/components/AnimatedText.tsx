import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = [
  "kattintással",
  "látogatóval",
  "ajánlatkéréssel",
  "hívással",
  "konverzióval",
  "ügyféllel",
  "projekttel",
  "megoldással",
  "kihívással",
  "üzenettel",
  "emaillel",
  "regisztrációval",
  "vásárlással",
  "megrendeléssel",
  "visszajelzéssel",
  "referenciával",
  "érdeklődéssel",
  "konzultációval",
  "támogatással",
  "követővkel",
  "aktivitással"
];

const AnimatedText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState(words[0]); // Start with first word
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // Start as false to show initial word immediately

  useEffect(() => {
    // Don't start animations until after initial render and LCP
    const initialDelay = setTimeout(() => {
      setIsTyping(true);
      setIsDeleting(true);
    }, 2000);

    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if (!isTyping) return; // Don't run animation logic until after initial render

    let timeout: ReturnType<typeof setTimeout>;

    const type = () => {
      const currentWord = words[currentIndex];
      
      if (isDeleting) {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
        timeout = setTimeout(type, 50);
      } else {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
        timeout = setTimeout(type, 100);
      }
    };

    const startTyping = () => {
      if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
      } else if (!isDeleting && currentText === words[currentIndex]) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
          type();
        }, 2000);
      } else {
        type();
      }
    };

    timeout = setTimeout(startTyping, 100);
    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, isTyping]);

  return (
    <div className="relative h-[1.2em] overflow-hidden">
      <motion.span
        className="absolute left-0 text-[#ff5c35]"
        initial={{ opacity: 1 }} // Start fully visible
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {currentText}
        {isTyping && <span className="animate-pulse">|</span>}
      </motion.span>
    </div>
  );
};

export default AnimatedText; 