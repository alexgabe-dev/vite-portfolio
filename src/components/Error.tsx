import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

interface ErrorProps {
  code: number;
}

const Error: React.FC<ErrorProps> = ({ code }) => {
  const navigate = useNavigate();

  const getErrorDetails = (errorCode: number) => {
    switch (errorCode) {
      case 404:
        return {
          title: 'Az oldal nem található',
          description: 'A keresett oldal nem található vagy már nem elérhető.',
          suggestion: 'Kérjük, ellenőrizze a megadott URL-t vagy térjen vissza a főoldalra.'
        };
      case 403:
        return {
          title: 'Hozzáférés megtagadva',
          description: 'Nincs jogosultsága az oldal megtekintéséhez.',
          suggestion: 'Kérjük, jelentkezzen be vagy térjen vissza a főoldalra.'
        };
      case 500:
        return {
          title: 'Szerver hiba',
          description: 'A szerver átmeneti problémába ütközött.',
          suggestion: 'Kérjük, próbálja meg később vagy térjen vissza a főoldalra.'
        };
      default:
        return {
          title: 'Hiba történt',
          description: 'Váratlan hiba történt az oldal betöltése közben.',
          suggestion: 'Kérjük, próbálja meg később vagy térjen vissza a főoldalra.'
        };
    }
  };

  const errorDetails = getErrorDetails(code);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden flex items-center justify-center">
      {/* Modern Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#ff5c35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#ff8f35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-[25%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl border border-gray-800"
        >
          <motion.h1 
            className="text-7xl md:text-9xl font-bold mb-8 bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {code}
          </motion.h1>
          
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {errorDetails.title}
          </motion.h2>
          
          <motion.p 
            className="text-gray-400 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {errorDetails.description}
          </motion.p>
          
          <motion.p 
            className="text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {errorDetails.suggestion}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <motion.button
              type="button"
              onClick={() => navigate(-1)}
              className="secondary-button flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Go back to previous page">
              <ArrowLeft size={20} />
              Vissza
            </motion.button>
            
            <Link to="/">
              <motion.button
                type="button"
                className="primary-button flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Go to homepage">
                <Home size={20} />
                Főoldal
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default Error; 