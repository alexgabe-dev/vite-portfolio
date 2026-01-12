
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { packages } from '../../constants';

const PackagesSection = () => {
    const [currentPackage, setCurrentPackage] = useState(0);
    const [prevPackage, setPrevPackage] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            // Reset to popular package when switching to mobile
            if (mobile) {
                setCurrentPackage(1);
            } else {
                setCurrentPackage(0);
            }
        };

        // Set initial package based on screen size
        if (window.innerWidth < 768) {
            setCurrentPackage(1);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePackageChange = (newIndex: number) => {
        setPrevPackage(currentPackage);
        setCurrentPackage(newIndex);
    };

    return (
        <section id="packages" className="py-20 relative bg-[#0f0f17] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Csomagajánlataink
                    </h2>
                    <div className="w-24 h-1 bg-[#ff5c35]"></div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:grid md:grid-cols-3 gap-8">
                    {packages.map((pkg, index) => (
                        <div key={index} className={`bg-[#0a0a0f] p-8 rounded-lg ${pkg.isPopular
                                ? 'border-2 border-[#ff5c35]/50 transform scale-105 relative shadow-lg shadow-[#ff5c35]/10'
                                : 'border border-gray-800/50 hover:border-[#ff5c35]/30'
                            } transition-all`}>
                            {pkg.isPopular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#ff5c35] text-white px-4 py-1 rounded-full text-sm font-bold">
                                    Legnépszerűbb
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                                <div className="text-3xl font-bold text-white">
                                    {pkg.price}
                                    <span className="text-lg font-normal text-gray-400 ml-1">{pkg.priceSuffix}</span>
                                </div>
                                <p className="text-gray-500 mt-2">{pkg.type}</p>
                            </div>

                            <ul className="space-y-3 text-gray-400 mb-8">
                                {pkg.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <ChevronRight size={18} className="text-[#ff5c35] mt-1 mr-2 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link to="/csomagok" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                <motion.button
                                    type="button"
                                    className={pkg.isPopular ? "primary-button w-full" : "secondary-button w-full"}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}>
                                    Részletek
                                </motion.button>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Mobile View - Carousel */}
                <div className="md:hidden relative">
                    <motion.div
                        className="overflow-visible"
                        initial={false}>
                        <AnimatePresence initial={false} mode="wait">
                            <motion.div
                                key={currentPackage}
                                className="flex w-full"
                                initial={{ opacity: 0, x: prevPackage < currentPackage ? 100 : -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: prevPackage < currentPackage ? -100 : 100 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                    mass: 0.8
                                }}>
                                <div className="w-full px-4">
                                    <motion.div
                                        className={`bg-[#0a0a0f] p-8 rounded-lg mt-6 ${currentPackage === 3 ? 'border border-gray-800/50' :
                                                packages[currentPackage].isPopular
                                                    ? 'border-2 border-[#ff5c35]/50 shadow-lg shadow-[#ff5c35]/10'
                                                    : 'border border-gray-800/50'
                                            }`}
                                        whileTap={{ scale: 0.98 }}
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={0.1}
                                        onDragEnd={(e, { offset, velocity }) => {
                                            const swipe = offset.x + velocity.x * 50;
                                            if (swipe < -50 && currentPackage < (isMobile ? 3 : packages.length - 1)) {
                                                handlePackageChange(currentPackage + 1);
                                            } else if (swipe > 50 && currentPackage > 0) {
                                                handlePackageChange(currentPackage - 1);
                                            }
                                        }}>
                                        {currentPackage < packages.length && packages[currentPackage].isPopular && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10 w-full flex justify-center">
                                                <div className="bg-[#ff5c35] text-white px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                                                    Legnépszerűbb
                                                </div>
                                            </div>
                                        )}
                                        {currentPackage === 3 ? (
                                            <div className="text-center py-8">
                                                <h3 className="text-xl font-bold mb-4">További Csomagok</h3>
                                                <p className="text-gray-400 mb-6">Fedezze fel személyre szabott megoldásainkat</p>
                                                <Link to="/csomagok">
                                                    <motion.button
                                                        className="primary-button"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}>
                                                        Összes csomag megtekintése
                                                    </motion.button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="mb-6">
                                                    <h3 className="text-xl font-bold mb-2">{packages[currentPackage].title}</h3>
                                                    <div className="text-3xl font-bold text-white">
                                                        {packages[currentPackage].price}
                                                        <span className="text-lg font-normal text-gray-400 ml-1">{packages[currentPackage].priceSuffix}</span>
                                                    </div>
                                                    <p className="text-gray-500 mt-2">{packages[currentPackage].type}</p>
                                                </div>

                                                <ul className="space-y-3 text-gray-400 mb-8">
                                                    {packages[currentPackage].features.map((feature, idx) => (
                                                        <motion.li
                                                            key={idx}
                                                            className="flex items-start"
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.1 }}>
                                                            <ChevronRight size={18} className="text-[#ff5c35] mt-1 mr-2 flex-shrink-0" />
                                                            <span>{feature}</span>
                                                        </motion.li>
                                                    ))}
                                                </ul>

                                                <Link to="/csomagok" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                                    <motion.button
                                                        type="button"
                                                        className={packages[currentPackage].isPopular ? "primary-button w-full" : "secondary-button w-full"}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}>
                                                        Részletek
                                                    </motion.button>
                                                </Link>
                                            </>
                                        )}
                                    </motion.div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    {/* Navigation Arrows */}
                    <div className="absolute top-1/2 left-0 right-0 -mt-4 flex justify-between px-4 pointer-events-none">
                        {currentPackage > 0 && (
                            <motion.button
                                type="button"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ff5c35]/10 text-[#ff5c35] pointer-events-auto"
                                onClick={() => setCurrentPackage(currentPackage - 1)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Previous package">
                                <ChevronRight size={20} className="transform rotate-180" />
                            </motion.button>
                        )}
                        {currentPackage < 3 && (
                            <motion.button
                                type="button"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ff5c35]/10 text-[#ff5c35] pointer-events-auto ml-auto"
                                onClick={() => setCurrentPackage(currentPackage + 1)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Next package">
                                <ChevronRight size={20} />
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Additional packages button for both mobile and desktop */}
                <motion.div
                    className="mt-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}>
                    <Link to="/csomagok" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <motion.button
                            type="button"
                            className="secondary-button inline-flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}>
                            További csomagjaink
                            <ChevronRight size={20} className="ml-2" />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default PackagesSection;
