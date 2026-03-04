import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from '../CountUp';
import { ChevronRight } from 'lucide-react';
import { stats } from '../../constants';

const Statistics = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [pulseCta, setPulseCta] = useState(false);
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isProgrammaticScroll = useRef(false);
    const previousIndexRef = useRef(0);

    const cards = useMemo(() => stats, []);

    const animateToIndex = (nextIndex: number) => {
        const slider = sliderRef.current;
        if (!slider) return;
        const firstCard = slider.querySelector('[data-stat-index="0"]') as HTMLElement | null;
        if (!firstCard) return;

        const cardWidth = firstCard.offsetWidth + 16;
        slider.scrollTo({ left: nextIndex * cardWidth, behavior: 'smooth' });
    };

    const pauseAutoPlay = () => {
        setIsAutoPlay(false);
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = setTimeout(() => setIsAutoPlay(true), 3000);
    };

    useEffect(() => {
        return () => {
            if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
            if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined' || window.innerWidth >= 768 || !isAutoPlay || !sliderRef.current) return;

        const interval = setInterval(() => {
            const next = (activeIndex + 1) % cards.length;
            isProgrammaticScroll.current = true;
            animateToIndex(next);
            setActiveIndex(next);
            setTimeout(() => {
                isProgrammaticScroll.current = false;
            }, 700);
        }, 3000);

        return () => clearInterval(interval);
    }, [activeIndex, cards.length, isAutoPlay]);

    useEffect(() => {
        const wasLast = previousIndexRef.current === cards.length - 1;
        const isNowLast = activeIndex === cards.length - 1;

        if (!wasLast && isNowLast) {
            setPulseCta(true);
            if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
            pulseTimerRef.current = setTimeout(() => setPulseCta(false), 800);
        }

        previousIndexRef.current = activeIndex;
    }, [activeIndex, cards.length]);

    return (
        <motion.section
            className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#0f0f17] relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}>
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-[#ff5c35]/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#ff5c35]/10 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                        Miért fontos a
                        <span className="text-[#ff5c35]"> weboldalad?</span>
                    </h2>
                    <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                        Sok kisvállalkozás alulértékeli a weboldalát, ami komoly üzleti lehetőségeket vesz el.
                    </p>
                </div>

                <div className="md:hidden -mx-4 px-4">
                    <div
                        ref={sliderRef}
                        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        onTouchStart={pauseAutoPlay}
                        onMouseDown={pauseAutoPlay}
                        onWheel={pauseAutoPlay}
                        onScroll={(e) => {
                            const el = e.currentTarget;
                            const firstCard = el.querySelector('[data-stat-index="0"]') as HTMLElement | null;
                            if (!firstCard) return;
                            const cardWidth = firstCard.offsetWidth + 16;
                            const idx = Math.round(el.scrollLeft / cardWidth);
                            const next = Math.min(Math.max(idx, 0), cards.length - 1);
                            if (next !== activeIndex) setActiveIndex(next);
                            if (!isProgrammaticScroll.current) pauseAutoPlay();
                        }}>
                        {cards.map((stat, idx) => {
                            const radius = 42;
                            const circumference = 2 * Math.PI * radius;

                            return (
                                <article
                                    key={idx}
                                    data-stat-index={idx}
                                    className="snap-center min-w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] bg-[#1a1a2e] rounded-2xl border border-gray-800/50 p-6">
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="relative">
                                            <svg width="100" height="100" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r={radius} fill="none" stroke="#2b2b42" strokeWidth="8" />
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r={radius}
                                                    fill="none"
                                                    stroke={stat.colorFrom}
                                                    strokeWidth="8"
                                                    strokeDasharray={circumference}
                                                    strokeDashoffset={circumference * (1 - stat.value / 100)}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <span className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold text-[#ff5c35]">
                                                <CountUp end={stat.value} duration={2.6} suffix={stat.suffix} />
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-center text-base leading-relaxed">{stat.label}</p>
                                </article>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-center gap-1 mt-4">
                        {cards.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                    pauseAutoPlay();
                                    isProgrammaticScroll.current = true;
                                    animateToIndex(idx);
                                    setActiveIndex(idx);
                                    setTimeout(() => {
                                        isProgrammaticScroll.current = false;
                                    }, 700);
                                }}
                                className="h-10 w-10 inline-flex items-center justify-center rounded-full"
                                aria-label={`Ugrás a(z) ${idx + 1}. statisztikára`}
                                aria-current={activeIndex === idx}>
                                <span className={`h-2.5 rounded-full ${activeIndex === idx ? 'w-6 bg-[#ff5c35]' : 'w-2.5 bg-white/25'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="hidden md:grid md:grid-cols-3 gap-6 mb-6">
                    {cards.slice(0, 3).map((stat, idx) => {
                        const radius = 42;
                        const circumference = 2 * Math.PI * radius;
                        return (
                            <article key={idx} className="bg-[#1a1a2e] rounded-2xl border border-gray-800/50 p-8">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="relative">
                                        <svg width="100" height="100" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r={radius} fill="none" stroke="#2b2b42" strokeWidth="8" />
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r={radius}
                                                fill="none"
                                                stroke={stat.colorFrom}
                                                strokeWidth="8"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={circumference * (1 - stat.value / 100)}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold leading-none tabular-nums text-[#ff5c35]">
                                            <CountUp end={stat.value} duration={2.6} suffix={stat.suffix} />
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-300 text-center text-base leading-relaxed">{stat.label}</p>
                            </article>
                        );
                    })}
                </div>

                <div className="hidden md:grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {cards.slice(3).map((stat, idx) => {
                        const radius = 42;
                        const circumference = 2 * Math.PI * radius;
                        return (
                            <article key={idx + 3} className="bg-[#1a1a2e] rounded-2xl border border-gray-800/50 p-8">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="relative">
                                        <svg width="100" height="100" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r={radius} fill="none" stroke="#2b2b42" strokeWidth="8" />
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r={radius}
                                                fill="none"
                                                stroke={stat.colorFrom}
                                                strokeWidth="8"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={circumference * (1 - stat.value / 100)}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold leading-none tabular-nums text-[#ff5c35]">
                                            <CountUp end={stat.value} duration={2.6} suffix={stat.suffix} />
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-300 text-center text-base leading-relaxed">{stat.label}</p>
                            </article>
                        );
                    })}
                </div>

                <div className="text-center mt-12">
                    <h3 className="text-2xl md:text-4xl font-bold mb-5 leading-tight">
                        Több ezer weboldalt elemeztem,
                        <span className="text-[#ff5c35]"> hogy veled ez ne történhessen meg.</span>
                    </h3>
                    <a href="/kapcsolat" data-discover="true" className="inline-flex">
                        <motion.button
                            type="button"
                            className="secondary-button inline-flex items-center"
                            animate={
                                pulseCta
                                    ? {
                                        scale: [1, 1.14, 0.97, 1],
                                        boxShadow: [
                                            '0 0 0 rgba(255,92,53,0)',
                                            '0 0 34px rgba(255,92,53,0.55)',
                                            '0 0 12px rgba(255,92,53,0.22)',
                                            '0 0 0 rgba(255,92,53,0)'
                                        ]
                                    }
                                    : { scale: 1, boxShadow: '0 0 0 rgba(255,92,53,0)' }
                            }
                            transition={{ duration: 0.48, ease: 'easeOut' }}>
                            Ingyenes konzultációt kérek!
                            <ChevronRight className="ml-2" size={20} />
                        </motion.button>
                    </a>
                </div>
            </div>
        </motion.section>
    );
};

export default Statistics;
