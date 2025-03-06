import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";

const Home: React.FC = () => {
  const particlesInit = React.useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = React.useCallback(async (container: Container | undefined) => {
    console.log(container);
  }, []);

  return (
    <div className="relative min-h-screen">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          particles: {
            color: {
              value: "#ff5c35",
            },
            links: {
              color: "#ff5c35",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Üdvözöljük a <span className="text-[#ff5c35]">Vizitor</span> oldalán
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Modern weboldalak és digitális megoldások a vállalkozásod számára
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/szolgaltatasok"
              className="bg-[#ff5c35] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#e54d2a] transition-colors"
            >
              Szolgáltatásaink
            </Link>
            <Link
              to="/kapcsolat"
              className="bg-white text-[#ff5c35] border-2 border-[#ff5c35] px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#ff5c35] hover:text-white transition-colors"
            >
              Kapcsolat
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home; 