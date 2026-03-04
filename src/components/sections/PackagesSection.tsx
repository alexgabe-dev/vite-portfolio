import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { packages } from '../../constants';

const PackagesSection = () => {
    const [currentPackage, setCurrentPackage] = useState(0);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    const sliderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setCurrentPackage(mobile ? 1 : 0);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!isMobile || !sliderRef.current) return;
        const slider = sliderRef.current;
        const firstCard = slider.querySelector('[data-pkg-index="0"]') as HTMLElement | null;
        if (!firstCard) return;
        const cardWidth = firstCard.offsetWidth + 16;
        slider.scrollTo({ left: currentPackage * cardWidth, behavior: 'smooth' });
    }, [currentPackage, isMobile]);

    return (
        <section id="packages" className="py-16 md:py-20 relative bg-[#0f0f17] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-10 md:mb-16 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Csomagajánlataink</h2>
                    <div className="w-24 h-1 bg-[#ff5c35] mx-auto md:mx-0"></div>
                </div>

                <div className="hidden md:grid md:grid-cols-3 gap-8">
                    {packages.map((pkg, index) => (
                        <article key={index} className={`bg-[#0a0a0f] p-8 rounded-xl ${pkg.isPopular
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
                                    className={pkg.isPopular ? 'primary-button w-full' : 'secondary-button w-full'}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}>
                                    Részletek
                                </motion.button>
                            </Link>
                        </article>
                    ))}
                </div>

                <div className="md:hidden">
                    <div
                        ref={sliderRef}
                        className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        onScroll={(e) => {
                            const el = e.currentTarget;
                            const first = el.querySelector('[data-pkg-index="0"]') as HTMLElement | null;
                            if (!first) return;
                            const cardWidth = first.offsetWidth + 16;
                            const idx = Math.round(el.scrollLeft / cardWidth);
                            const next = Math.min(Math.max(idx, 0), packages.length - 1);
                            if (next !== currentPackage) setCurrentPackage(next);
                        }}>
                        {packages.map((pkg, index) => (
                            <article
                                key={index}
                                data-pkg-index={index}
                                className={`snap-center min-w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] bg-[#0a0a0f] p-6 rounded-xl border ${pkg.isPopular
                                    ? 'border-[#ff5c35]/50 shadow-lg shadow-[#ff5c35]/10'
                                    : 'border-gray-800/50'
                                    } relative`}>
                                {pkg.isPopular && (
                                    <div className="mb-3">
                                        <span className="inline-flex bg-[#ff5c35] text-white px-3 py-1 rounded-full text-xs font-bold">
                                            Legnépszerűbb
                                        </span>
                                    </div>
                                )}

                                <div className="mb-5">
                                    <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                                    <div className="text-3xl font-bold text-white">
                                        {pkg.price}
                                        <span className="text-base font-normal text-gray-400 ml-1">{pkg.priceSuffix}</span>
                                    </div>
                                    <p className="text-gray-500 mt-1 text-sm">{pkg.type}</p>
                                </div>

                                <ul className="space-y-2.5 text-gray-400 mb-6 text-sm">
                                    {pkg.features.slice(0, 5).map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <ChevronRight size={16} className="text-[#ff5c35] mt-0.5 mr-2 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link to="/csomagok" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                    <button
                                        type="button"
                                        className={pkg.isPopular ? 'primary-button w-full' : 'secondary-button w-full'}>
                                        Részletek
                                    </button>
                                </Link>
                            </article>
                        ))}
                    </div>

                    <div className="flex justify-center gap-2 mt-4">
                        {packages.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setCurrentPackage(idx)}
                                className={`h-2.5 rounded-full transition-all ${currentPackage === idx ? 'w-6 bg-[#ff5c35]' : 'w-2.5 bg-white/25'}`}
                                aria-label={`Ugrás a(z) ${idx + 1}. csomagra`}
                            />
                        ))}
                    </div>
                </div>

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
