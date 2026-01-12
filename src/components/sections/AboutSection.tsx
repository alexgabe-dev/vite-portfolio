
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Handshake, Target, ChevronRight } from 'lucide-react';
import { fadeInUp, staggerChildren } from '../../utils/animations';

const AboutSection = () => {
    return (
        <motion.section
            id="rólam"
            className="py-20 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    className="text-4xl font-bold mb-16"
                    variants={fadeInUp}>
                    Rólam
                    <div className="w-24 h-1 bg-[#ff5c35] mt-4"></div>
                </motion.h1>

                {/* Hero Story */}
                <motion.div
                    className="grid md:grid-cols-2 gap-12 items-center mb-20"
                    variants={staggerChildren}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}>
                    <motion.div variants={fadeInUp}>
                        <h2 className="text-3xl font-bold mb-6">Történetem</h2>
                        <p className="text-gray-400 mb-6">
                            A <a href="https://vizitor.hu" className="text-[#ff5c35] hover:underline">vizitor.hu</a>-t azért hosztam létre, mivel felismertem, hogy a magyar vállalkozásoknak
                            szükségük van egy megbízható partnerre a digitális átalakulásban. Célom az, hogy
                            olyan megoldásokat kínáljak, amelyek nem csak technológiailag korszerűek, hanem
                            valódi üzleti értéket is teremtenek.
                        </p>
                        <p className="text-gray-400">
                            Ma már büszkén mondhatom, hogy több sikeres projektet valósítottam meg,
                            és folyamatosan fejlesztem magam, hogy együtt növekedjek az ügyfeleimmel.
                        </p>
                    </motion.div>
                    <motion.div
                        className="relative h-[400px]"
                        variants={fadeInUp}>
                        <motion.div
                            className="absolute right-0 w-full h-full bg-[#1a1a2e] rounded-lg overflow-hidden"
                            whileHover={{ scale: 1.02 }}>
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#ff5c35]/20 to-transparent"></div>
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-50"></div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Values - Desktop Grid / Mobile Marquee */}
                <motion.div
                    className="mb-20 overflow-hidden"
                    variants={staggerChildren}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}>
                    <motion.h2
                        className="text-3xl font-bold mb-12 text-center"
                        variants={fadeInUp}>
                        Értékeink
                    </motion.h2>

                    {/* Desktop Grid (Hidden on mobile) */}
                    <div className="hidden md:grid grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Lightbulb className="w-8 h-8 text-[#ff5c35]" />,
                                title: "Innováció",
                                description: "Folyamatosan keressem az új technológiai megoldásokat",
                                gradient: "from-blue-500/20 to-purple-500/20",
                                features: ["Új technológiák", "Kreatív megoldások", "Folyamatos fejlődés"]
                            },
                            {
                                icon: <Handshake className="w-8 h-8 text-[#ff5c35]" />,
                                title: "Megbízhatóság",
                                description: "Amit megígérek, azt időben és kiváló minőségben teljesítem, ezt garantálni tudom",
                                gradient: "from-orange-500/20 to-red-500/20",
                                features: ["Pontos határidők", "Minőségi szolgáltatás", "Megbízható partner"]
                            },
                            {
                                icon: <Target className="w-8 h-8 text-[#ff5c35]" />,
                                title: "Eredményorientáltság",
                                description: "A mérhető, valós üzleti eredmények elérése a célom",
                                gradient: "from-green-500/20 to-teal-500/20",
                                features: ["Mérhető eredmények", "Üzleti növekedés", "ROI fókusz"]
                            }
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                className="group relative"
                                variants={fadeInUp}>
                                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl ${value.gradient}`}></div>
                                <div className="relative bg-[#1a1a2e] p-8 rounded-xl border border-gray-800/50 group-hover:border-[#ff5c35]/30 transition-all duration-500">
                                    <motion.div
                                        className="w-14 h-14 bg-gradient-to-br from-[#ff5c35]/20 to-[#ff5c35]/10 rounded-lg flex items-center justify-center mb-6 text-[#ff5c35] group-hover:scale-110 transition-transform duration-500">
                                        {value.icon}
                                    </motion.div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#ff5c35] transition-colors duration-300">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                                        {value.description}
                                    </p>
                                    <ul className="space-y-3">
                                        {value.features.map((feature, idx) => (
                                            <motion.li
                                                key={idx}
                                                className="flex items-center text-gray-400 group-hover:text-gray-300"
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * idx }}
                                                whileHover={{ x: 5 }}>
                                                <ChevronRight size={16} className="text-[#ff5c35] mr-2" />
                                                {feature}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mobile Infinite Marquee Carousel (Hidden on desktop) */}
                    <div className="md:hidden relative">
                        <motion.div
                            className="flex gap-4 w-fit"
                            animate={{
                                x: [0, -888],
                            }}
                            transition={{
                                x: {
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 30,
                                    ease: "linear",
                                },
                            }}
                        >
                            {/* Duplicate items for seamless loop */}
                            {[...Array(3)].map((_, loopIdx) => (
                                <div key={loopIdx} className="flex gap-4">
                                    {[
                                        {
                                            icon: <Lightbulb size={24} />,
                                            title: "Innováció",
                                            description: "Folyamatosan keressem az új megoldásokat."
                                        },
                                        {
                                            icon: <Handshake size={24} />,
                                            title: "Megbízhatóság",
                                            description: "Amit megígérek, azt teljesítem."
                                        },
                                        {
                                            icon: <Target size={24} />,
                                            title: "Eredményorientáltság",
                                            description: "Valós üzleti eredmények elérése."
                                        }
                                    ].map((value, idx) => (
                                        <div
                                            key={idx}
                                            className="w-[280px] flex-shrink-0 bg-[#1a1a2e] p-6 rounded-2xl border border-gray-800/50"
                                        >
                                            <div className="w-12 h-12 bg-[#ff5c35]/10 rounded-xl flex items-center justify-center mb-4 text-[#ff5c35]">
                                                {value.icon}
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                                            <p className="text-gray-400 text-sm">{value.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </motion.div>

                        {/* Gradient Fades for smoothness */}
                        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10" />
                        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10" />
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default AboutSection;
