
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { techStack } from '../../constants';
import { fadeInUp, staggerChildren } from '../../utils/animations';

const Technologies = () => {
    const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

    const toggleTechSelection = (techName: string) => {
        setSelectedTechs(prev =>
            prev.includes(techName)
                ? prev.filter(tech => tech !== techName)
                : [...prev, techName]
        );
    };

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
                        Technológiák
                    </motion.h2>
                    <motion.p
                        className="text-gray-400 max-w-2xl mx-auto text-lg mb-6"
                        variants={fadeInUp}>
                        Modern technológiák, amelyekkel álmai weboldala valósággá válik
                    </motion.p>
                    <div className="w-24 h-1 bg-[#ff5c35] mx-auto"></div>
                </motion.div>

                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                    variants={staggerChildren}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}>
                    {techStack.map((tech, index) => (
                        <motion.div
                            key={index}
                            className="group relative cursor-pointer"
                            variants={fadeInUp}
                            onClick={() => toggleTechSelection(tech.name)}>
                            <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 rounded-xl ${selectedTechs.includes(tech.name)
                                    ? 'opacity-100 bg-gradient-to-br from-[#ff5c35]/30 to-[#ff5c35]/10'
                                    : 'opacity-0 group-hover:opacity-100'
                                }`}
                                style={!selectedTechs.includes(tech.name) ? { background: `linear-gradient(to bottom right, ${tech.color})` } : undefined}></div>
                            <div className={`relative bg-[#1a1a2e] p-8 rounded-xl border transition-all duration-500 ${selectedTechs.includes(tech.name)
                                    ? 'border-[#ff5c35] shadow-lg shadow-[#ff5c35]/20'
                                    : 'border-gray-800/50 group-hover:border-[#ff5c35]/30'
                                }`}>
                                <div className="flex flex-col items-center text-center">
                                    <motion.div
                                        className="w-16 h-16 mb-4 relative flex items-center justify-center"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}>
                                        <img
                                            src={tech.icon}
                                            alt={tech.name}
                                            className={`w-12 h-12 object-contain transition-all duration-300 ${selectedTechs.includes(tech.name)
                                                    ? 'brightness-125 scale-110'
                                                    : 'filter group-hover:brightness-110'
                                                }`}
                                            loading="lazy"
                                            decoding="async"
                                            width={64}
                                            height={64}
                                        />
                                    </motion.div>
                                    <motion.h3
                                        className={`text-lg font-semibold mb-2 transition-colors duration-300 ${selectedTechs.includes(tech.name)
                                                ? 'text-[#ff5c35]'
                                                : 'group-hover:text-[#ff5c35]'
                                            }`}
                                        whileHover={{ scale: 1.05 }}>
                                        {tech.name}
                                    </motion.h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
};

export default Technologies;
