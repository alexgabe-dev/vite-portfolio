
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedText from '../AnimatedText';
import { fadeInUp, staggerChildren } from '../../utils/animations';

const Hero = () => {
    const [clickCount, setClickCount] = useState(0);

    return (
        <motion.section
            id="home"
            className="relative min-h-screen flex items-center pt-16 overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}>
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#0a0a0f] via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-[#0a0a0f] via-transparent to-transparent opacity-80"></div>
                <img
                    src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-10"
                    loading="eager"
                    decoding="async"
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    variants={staggerChildren}
                    initial="initial"
                    animate="animate"
                    className="will-change-transform">
                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6">
                        <motion.span
                            className="md:block leading-[1.2] inline-block py-1"
                            initial={{ opacity: 1, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}>
                            Növekedés
                        </motion.span>{' '}
                        <motion.span
                            className="md:block leading-[1.2] inline-block py-1"
                            initial={{ opacity: 1, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}>
                            minden
                        </motion.span>{' '}
                        <AnimatedText />
                    </h1>
                    <motion.p
                        className="text-lg sm:text-xl mb-6 md:mb-8 text-gray-400 max-w-lg leading-[1.8]"
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            contentVisibility: 'auto',
                            willChange: 'transform'
                        }}>
                        Modern weboldalkészítés, hatékony digitális marketing és automatizált megoldások, amelyek lenyűgözik a látogatókat és növelik a bevételt.
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 md:mt-0"
                        variants={fadeInUp}>
                        <Link to="/kapcsolat" state={{ fromFooter: true }}>
                            <motion.button
                                type="button"
                                className="primary-button text-base sm:text-lg w-full sm:w-auto px-6 py-3 sm:py-4"
                                whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgb(255, 92, 53)" }}
                                whileTap={{ scale: 0.95 }}>
                                Ajánlatkérés
                            </motion.button>
                        </Link>
                        <Link to="/szolgaltatasok">
                            <motion.button
                                type="button"
                                className="secondary-button text-base sm:text-lg w-full sm:w-auto px-6 py-3 sm:py-4"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}>
                                Szolgáltatásaim
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
                <motion.div
                    className="hidden md:block relative"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}>
                    <div className="relative w-full h-[400px]">
                        <motion.div
                            className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-lg transform"
                            animate={{
                                rotate: [12, 0, 12],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div
                            className="absolute right-20 top-40 w-48 h-48 bg-gradient-to-br from-[#16213e] to-[#1a1a2e] rounded-lg transform"
                            animate={{
                                rotate: [-12, 0, -12],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                duration: 15,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div
                            className="absolute right-40 top-20 w-32 h-32 bg-[#ff5c35] rounded-full shadow-lg shadow-[#ff5c35]/20 cursor-pointer"
                            animate={
                                clickCount === 4
                                    ? {
                                        scale: [1.5, 2, 0.5, 1],
                                        opacity: [1, 1, 0.8, 1],
                                        rotate: [0, 180, 360, 0],
                                        boxShadow: [
                                            "0 0 20px rgba(255, 92, 53, 0.4)",
                                            "0 0 40px rgba(255, 92, 53, 0.6)",
                                            "0 0 60px rgba(255, 92, 53, 0.2)",
                                            "0 0 20px rgba(255, 92, 53, 0.2)"
                                        ]
                                    }
                                    : {
                                        scale: 1 + (clickCount * 0.2),
                                        y: [0, -20, 0],
                                        boxShadow: `0 0 ${20 + (clickCount * 10)}px rgba(255, 92, 53, ${0.2 + (clickCount * 0.1)})`
                                    }
                            }
                            transition={
                                clickCount === 4
                                    ? {
                                        duration: 0.8,
                                        ease: "easeInOut",
                                        times: [0, 0.4, 0.7, 1],
                                        onComplete: () => setClickCount(0)
                                    }
                                    : {
                                        y: {
                                            duration: 5,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        },
                                        scale: {
                                            duration: 0.3,
                                            ease: "easeOut"
                                        }
                                    }
                            }
                            onClick={() => {
                                setClickCount(prev => (prev + 1) % 5);
                            }}
                            whileHover={{
                                scale: 1 + (clickCount * 0.2) + 0.05,
                                boxShadow: `0 0 ${25 + (clickCount * 10)}px rgba(255, 92, 53, ${0.3 + (clickCount * 0.1)})`
                            }}
                        />
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default Hero;
