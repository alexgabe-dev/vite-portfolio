
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CountUp from '../CountUp';
import { fadeInUp, staggerChildren } from '../../utils/animations';
import { stats } from '../../constants';
// Note: ChevronRight is used in the fallback/carousel logic, need to import it if used.
import { ChevronRight } from 'lucide-react';

const Statistics = () => {
    // Logic for mobile carousel
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isAutoScroll, setIsAutoScroll] = useState(true);
    const autoScrollTimeout = useRef<NodeJS.Timeout | null>(null);
    const [statIndex, setStatIndex] = useState(0); // Kept for state compatibility if needed, though used in drag logic

    // Fluid automatikus scroll mobilon
    useEffect(() => {
        if (window.innerWidth >= 768) return;
        if (!isAutoScroll) return;
        let frame: number;
        function step() {
            if (!isAutoScroll) return;
            const el = carouselRef.current;
            if (!el) return;
            if (el.scrollLeft + el.offsetWidth >= el.scrollWidth - 2) {
                el.scrollLeft = 0;
            } else {
                el.scrollLeft += 2.5; // Folyamatos, gyorsabb scroll
            }
            frame = requestAnimationFrame(step);
        }
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [isAutoScroll]);

    // User interakció: scroll/drag/nyomás leállítja az automata scrollt 3mp-re
    function pauseAutoScroll() {
        setIsAutoScroll(false);
        if (autoScrollTimeout.current) clearTimeout(autoScrollTimeout.current);
        autoScrollTimeout.current = setTimeout(() => setIsAutoScroll(true), 3000);
    }

    return (
        <motion.section
            className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0f0f17] relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-[#ff5c35]/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#ff5c35]/10 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    className="text-center mb-16"
                    variants={staggerChildren}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}>
                    <motion.h2
                        className="text-4xl sm:text-5xl font-bold mb-6"
                        variants={fadeInUp}>
                        Miért fontos a
                        <span className="bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent"> weboldalad?</span>
                    </motion.h2>
                    <motion.p
                        className="text-gray-400 text-lg max-w-2xl mx-auto"
                        variants={fadeInUp}>
                        Sok kisvállalkozás <span className="underline decoration-[#ff5c35] underline-offset-4">alulértékeli</span> weboldalát, ami
                        <span className="text-[#ff5c35]"> milliós értékű elveszett lehetőségekhez</span> vezethet.
                    </motion.p>
                </motion.div>
                {/* Mobil: fluid scroll-snap carousel */}
                <div className="block md:hidden w-full max-w-[95vw] mx-auto relative">
                    <div
                        ref={carouselRef}
                        className="flex gap-4 overflow-x-auto scrollbar-none w-full"
                        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        onScroll={pauseAutoScroll}
                        onTouchStart={pauseAutoScroll}
                        onMouseDown={pauseAutoScroll}
                    >
                        {stats.map((stat, idx) => {
                            const radius = 44;
                            const circumference = 2 * Math.PI * radius;
                            return (
                                <div
                                    key={idx}
                                    className="relative bg-[#1a1a2e] rounded-2xl border border-gray-800/50 shadow-xl py-10 px-4 flex-shrink-0 flex flex-col items-center justify-center transition-all duration-300 min-h-[340px] w-[70vw] max-w-[300px] select-none"
                                >
                                    <div className="relative mb-4">
                                        <svg width="100" height="100" viewBox="0 0 100 100" className="block mx-auto">
                                            <circle cx="50" cy="50" r={radius} fill="none" stroke="#232336" strokeWidth="7" />
                                            <motion.circle
                                                cx="50" cy="50" r={radius} fill="none"
                                                stroke={`url(#stat-gradient-${idx})`}
                                                strokeWidth="7"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={circumference * (1 - stat.value / 100)}
                                                strokeLinecap="round"
                                                initial={{ strokeDashoffset: circumference }}
                                                animate={{ strokeDashoffset: circumference * (1 - stat.value / 100) }}
                                                transition={{ duration: 1.5 }}
                                            />
                                            <defs>
                                                <linearGradient id={`stat-gradient-${idx}`} x1="0" y1="0" x2="100" y2="100">
                                                    <stop offset="0%" stopColor={stat.colorFrom} />
                                                    <stop offset="100%" stopColor={stat.colorTo} />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-3xl font-extrabold bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent select-none">
                                                <CountUp end={stat.value} duration={1.5} suffix={stat.suffix} />
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-center text-base font-medium leading-relaxed">
                                        {stat.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    {/* Formázott szöveg és gomb a carousel alá */}
                    <div className="text-center mt-16 mb-12">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                            Több ezer weboldalt elemeztem
                            <span className="bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent"> hogy veled ez ne történhessen meg.</span>
                        </h2>
                        <div className="mt-8">
                            <a href="/kapcsolat" data-discover="true">
                                <button type="button" className="secondary-button inline-flex items-center" tabIndex={0}>
                                    Ingyenes konzultációt kérek!
                                    <ChevronRight className="ml-2" size={20} />
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
                {/* Desktop grid */}
                <div className="hidden lg:block max-w-6xl mx-auto mb-16">
                    <div className="grid grid-cols-3 gap-6 mb-6 items-stretch">
                        {stats.slice(0, 3).map((stat, idx) => {
                            const radius = 44;
                            const circumference = 2 * Math.PI * radius;
                            return (
                                <motion.div
                                    key={idx}
                                    className="relative bg-[#1a1a2e] rounded-3xl border border-gray-800/40 shadow-2xl shadow-[#ff5c35]/10 p-10 flex flex-col items-center justify-center min-h-[320px] h-full w-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[#ff5c35] group"
                                    whileHover={{ y: -8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="relative mb-4">
                                        <svg width="100" height="100" viewBox="0 0 100 100" className="block mx-auto">
                                            <circle cx="50" cy="50" r={radius} fill="none" stroke="#28304a" strokeWidth="10" />
                                            <motion.circle
                                                cx="50" cy="50" r={radius} fill="none"
                                                stroke={`url(#stat-gradient-${idx})`}
                                                strokeWidth="10"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={circumference * (1 - stat.value / 100)}
                                                strokeLinecap="round"
                                                initial={{ strokeDashoffset: circumference }}
                                                animate={{ strokeDashoffset: circumference * (1 - stat.value / 100) }}
                                                transition={{ duration: 1.5, delay: 0.2 * idx }}
                                            />
                                            <defs>
                                                <linearGradient id={`stat-gradient-${idx}`} x1="0" y1="0" x2="100" y2="100">
                                                    <stop offset="0%" stopColor={stat.colorFrom} />
                                                    <stop offset="100%" stopColor={stat.colorTo} />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-5xl font-extrabold bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent drop-shadow-lg select-none">
                                                <CountUp end={stat.value} duration={1.5} suffix={stat.suffix} />
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-gray-200 text-center text-lg font-medium leading-relaxed mt-2">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                    <div className="flex justify-center gap-6">
                        {stats.slice(3).map((stat, idx) => {
                            const radius = 44;
                            const circumference = 2 * Math.PI * radius;
                            return (
                                <motion.div
                                    key={idx + 3}
                                    className="relative bg-[#1a1a2e] rounded-3xl border border-gray-800/40 shadow-2xl shadow-[#ff5c35]/10 p-10 flex flex-col items-center justify-center min-h-[320px] h-full w-full max-w-[420px] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[#ff5c35] group"
                                    whileHover={{ y: -8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="relative mb-4">
                                        <svg width="100" height="100" viewBox="0 0 100 100" className="block mx-auto">
                                            <circle cx="50" cy="50" r={radius} fill="none" stroke="#28304a" strokeWidth="10" />
                                            <motion.circle
                                                cx="50" cy="50" r={radius} fill="none"
                                                stroke={`url(#stat-gradient-${idx + 3})`}
                                                strokeWidth="10"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={circumference * (1 - stat.value / 100)}
                                                strokeLinecap="round"
                                                initial={{ strokeDashoffset: circumference }}
                                                animate={{ strokeDashoffset: circumference * (1 - stat.value / 100) }}
                                                transition={{ duration: 1.5, delay: 0.2 * (idx + 3) }}
                                            />
                                            <defs>
                                                <linearGradient id={`stat-gradient-${idx + 3}`} x1="0" y1="0" x2="100" y2="100">
                                                    <stop offset="0%" stopColor={stat.colorFrom} />
                                                    <stop offset="100%" stopColor={stat.colorTo} />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-5xl font-extrabold bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent drop-shadow-lg select-none">
                                                <CountUp end={stat.value} duration={1.5} suffix={stat.suffix} />
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-gray-200 text-center text-lg font-medium leading-relaxed mt-2">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Desktopon is: Több ezer weboldalt... szöveg és gomb */}
                <div className="hidden md:block text-center mt-16 mb-12">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                        Több ezer weboldalt elemeztem
                        <span className="bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] bg-clip-text text-transparent"> hogy veled ez ne történhessen meg.</span>
                    </h2>
                    <div className="mt-8">
                        <a href="/kapcsolat" data-discover="true">
                            <button type="button" className="secondary-button inline-flex items-center" tabIndex={0}>
                                Ingyenes konzultációt kérek!
                                <ChevronRight className="ml-2" size={20} />
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default Statistics;
