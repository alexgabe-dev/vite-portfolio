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
  "emaillel"
];

const AnimatedText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const type = () => {
      const currentWord = words[currentIndex];
      
      if (isDeleting) {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
        timeout = setTimeout(type, 50); // Törlés sebessége
      } else {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
        timeout = setTimeout(type, 100); // Írás sebessége
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
        }, 2000); // Mennyi ideig marad meg a szöveg
      } else {
        type();
      }
    };

    timeout = setTimeout(startTyping, 100);
    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting]);

  return (
    <div className="relative h-[1.2em] overflow-hidden">
      <motion.span
        className="absolute left-0 text-[#ff5c35]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {currentText}
        <span className="animate-pulse">|</span>
      </motion.span>
    </div>
  );
};

export default AnimatedText; 