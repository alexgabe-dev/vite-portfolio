import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";

interface ErrorProps {
  code: number;
}

const Error: React.FC<ErrorProps> = ({ code }) => {
  const navigate = useNavigate();

  const particlesInit = React.useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = React.useCallback(async (container: Container | undefined) => {
    console.log(container);
  }, []);

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
    <main className="min-h-screen bg-[#0f0f17] relative overflow-hidden">
      {/* Particles Background */}
      <Particles
        id="tsparticles-error"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: "#ff5c35",
            },
            links: {
              color: "#ff5c35",
              distance: 150,
              enable: true,
              opacity: 0.12,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 0.8,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 1200,
              },
              value: 60,
            },
            opacity: {
              value: 0.12,
              animation: {
                enable: true,
                speed: 0.3,
                minimumValue: 0.08,
              },
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 2 },
            },
          },
          detectRetina: true,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "grab",
                parallax: {
                  enable: true,
                  force: 50,
                  smooth: 80
                }
              },
            },
            modes: {
              grab: {
                distance: 200,
                links: {
                  opacity: 0.25
                }
              }
            }
          }
        }}
        className="absolute inset-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
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